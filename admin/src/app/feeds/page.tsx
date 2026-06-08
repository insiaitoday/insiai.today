'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { requireSession } from '@/lib/auth';
import { adminApi } from '@/lib/api';
import { AdminSidebar } from '@/components/shell/AdminSidebar';
import { AdminTopBar } from '@/components/shell/AdminTopBar';
import type { RssFeed } from '@/types';
import toast from 'react-hot-toast';

function timeAgo(d?: string | null) {
  if (!d) return 'Never';
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60)    return `${s}s ago`;
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function timeUntil(d?: string | null) {
  if (!d) return '—';
  const ms = new Date(d).getTime() - Date.now();
  if (ms <= 0) return 'imminent';
  const m = Math.floor(ms / 60000);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${m}m`;
}

const EMPTY_FEED = {
  name: '',
  url: '',
  auto_approve: false,
  priority_tier: 2 as 1 | 2 | 3,
  fetch_frequency: 120,
};

const TOP_COMPANY_NAMES = [
  'openai', 'anthropic', 'google deepmind', 'meta ai',
  'microsoft ai', 'google ai', 'nvidia ai', 'hugging face',
  'mistral ai', 'cohere', 'aws machine learning', 'stability ai',
  'xai', 'grok', 'x.ai',
];
function isTopCompany(name: string) {
  return TOP_COMPANY_NAMES.some(tc => name.toLowerCase().includes(tc));
}

const COMPANY_ICONS: Record<string, string> = {
  openai: '🤖', anthropic: '🧠', deepmind: '🔬', 'meta ai': '📘',
  microsoft: '🪟', 'google ai': '🔍', nvidia: '⚡', 'hugging face': '🤗',
  mistral: '🌬️', cohere: '🔗', aws: '☁️', stability: '🎨', xai: '𝕏', grok: '𝕏',
};
function getCompanyIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(COMPANY_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return '📡';
}

type Tab      = 'companies' | 'feeds';
type ViewMode = 'cards' | 'table';

interface PollerStatus {
  running: boolean;
  startedAt: string | null;
  lastPollAt: string | null;
  nextPollAt: string | null;
  intervalMs: number;
  totalRuns: number;
}

// ── Countdown clock component ─────────────────────────────────────────────────
function Countdown({ nextPollAt }: { nextPollAt: string | null }) {
  const [label, setLabel] = useState(timeUntil(nextPollAt));
  useEffect(() => {
    if (!nextPollAt) { setLabel('—'); return; }
    const id = setInterval(() => setLabel(timeUntil(nextPollAt)), 10_000);
    return () => clearInterval(id);
  }, [nextPollAt]);
  return <span className="font-mono text-xs text-emerald-400">{label}</span>;
}

export default function FeedsPage() {
  const [feeds,        setFeeds]        = useState<RssFeed[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [fetching,     setFetching]     = useState<string | null>(null);
  const [fetchingAll,  setFetchingAll]  = useState(false);
  const [tab,          setTab]          = useState<Tab>('companies');
  const [viewMode,     setViewMode]     = useState<ViewMode>('cards');
  const [showForm,     setShowForm]     = useState(false);
  const [form,         setForm]         = useState(EMPTY_FEED);
  const [saving,       setSaving]       = useState(false);
  const [editModal,    setEditModal]    = useState(false);
  const [editingFeed,  setEditingFeed]  = useState<RssFeed | null>(null);
  const [recentModal,  setRecentModal]  = useState(false);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [loadingRecent,  setLoadingRecent]  = useState(false);
  const [recentSearch,   setRecentSearch]   = useState('');
  const [recentSource,   setRecentSource]   = useState('all');

  // ── Poller state ────────────────────────────────────────────────────────────
  const [poller,         setPoller]       = useState<PollerStatus | null>(null);
  const [pollerLoading,  setPollerLoading] = useState(false);
  const pollerPollRef    = useRef<NodeJS.Timeout | null>(null);

  // ── Data loading ────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    try {
      const data = await adminApi.feeds.list();
      setFeeds(data);
    } catch {
      toast.error('Failed to load feeds');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshPoller = useCallback(async () => {
    try {
      const s = await adminApi.poller.status();
      setPoller(s);
    } catch {
      // backend might not be available — ignore
    }
  }, []);

  useEffect(() => {
    requireSession().then((s) => {
      if (s) {
        load();
        refreshPoller();
      }
    });
  }, [load, refreshPoller]);

  // Poll poller status every 30s while running so countdown stays fresh
  useEffect(() => {
    if (poller?.running) {
      pollerPollRef.current = setInterval(refreshPoller, 30_000);
    } else {
      if (pollerPollRef.current) clearInterval(pollerPollRef.current);
    }
    return () => { if (pollerPollRef.current) clearInterval(pollerPollRef.current); };
  }, [poller?.running, refreshPoller]);

  const companyFeeds  = feeds.filter(f => f.priority_tier === 1 && isTopCompany(f.name));
  const otherFeeds    = feeds.filter(f => !(f.priority_tier === 1 && isTopCompany(f.name)));
  const currentFeeds  = tab === 'companies' ? companyFeeds : otherFeeds;

  // ── Poller controls ─────────────────────────────────────────────────────────
  const handlePollerToggle = async () => {
    setPollerLoading(true);
    try {
      if (poller?.running) {
        await adminApi.poller.stop();
        toast.success('⏹ Auto-poller stopped');
      } else {
        toast.loading('⚡ Starting poller — running immediate fetch…', { id: 'poller-start' });
        await adminApi.poller.start();
        toast.dismiss('poller-start');
        toast.success('✅ Auto-poller started! Fetching now, then every 2 hours');
        load(); // refresh feed last-fetched timestamps
      }
      await refreshPoller();
    } catch (err: any) {
      toast.dismiss('poller-start');
      toast.error(err.message || 'Poller error');
    } finally {
      setPollerLoading(false);
    }
  };

  // ── Feed actions ────────────────────────────────────────────────────────────
  const toggleEnabled = async (feed: RssFeed) => {
    try {
      const updated = await adminApi.feeds.update(feed.id, { enabled: !feed.enabled });
      setFeeds(f => f.map(x => (x.id === feed.id ? updated : x)));
      toast.success(feed.enabled ? 'Feed disabled' : 'Feed enabled');
    } catch { toast.error('Failed to update'); }
  };

  const deleteFeed = async (id: string) => {
    if (!confirm('Delete this feed?')) return;
    try {
      await adminApi.feeds.delete(id);
      setFeeds(f => f.filter(x => x.id !== id));
      toast.success('Feed removed');
    } catch { toast.error('Delete failed'); }
  };

  const fetchFeed = async (feed: RssFeed) => {
    setFetching(feed.id);
    try {
      const { newArticles } = await adminApi.feeds.fetch(feed.id);
      toast.success(`✅ ${feed.name}: ${newArticles} new articles`);
      load();
    } catch { toast.error('Fetch failed'); }
    finally { setFetching(null); }
  };

  const fetchAllFeeds = async () => {
    setFetchingAll(true);
    const toastId = toast.loading('🔄 Fetching all feeds…');
    try {
      const { total } = await adminApi.feeds.fetchAll();
      toast.dismiss(toastId);
      toast.success(`✅ Fetch complete — ${total} new articles`);
      load();
    } catch {
      toast.dismiss(toastId);
      toast.error('Fetch all failed');
    } finally { setFetchingAll(false); }
  };

  const showRecent = async () => {
    setRecentModal(true);
    setLoadingRecent(true);
    try {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      const { posts } = await adminApi.posts.list({ status: 'pending,published', since: twoHoursAgo, limit: 500, sort: 'new', filterBy: 'fetched_at' });
      const recent = posts.filter((p: any) => {
        const t = new Date(p.fetched_at || p.created_at).getTime();
        return (Date.now() - t) <= 2 * 60 * 60 * 1000;
      });
      setRecentArticles(recent);
    } catch { toast.error('Failed to load recent articles'); }
    finally { setLoadingRecent(false); }
  };

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await adminApi.feeds.create(form);
      setFeeds(f => [created, ...f]);
      setForm(EMPTY_FEED);
      setShowForm(false);
      toast.success('Feed added!');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed');
    } finally { setSaving(false); }
  };

  const handleEditFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeed) return;
    setSaving(true);
    try {
      const updated = await adminApi.feeds.update(editingFeed.id, {
        name: editingFeed.name,
        url: editingFeed.url,
        auto_approve: editingFeed.auto_approve,
        priority_tier: editingFeed.priority_tier,
        fetch_frequency: editingFeed.fetch_frequency,
      });
      setFeeds(f => f.map(x => (x.id === editingFeed.id ? updated : x)));
      setEditModal(false);
      setEditingFeed(null);
      toast.success('Feed updated!');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed');
    } finally { setSaving(false); }
  };

  const tierLabel: Record<number, string> = { 1: '⭐ Tier 1', 2: '🔷 Tier 2', 3: '⬛ Tier 3' };
  const statusColor = (status?: string) => {
    if (status === 'success') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (status === 'error')   return 'bg-red-500/10 text-red-400 border-red-500/20';
    return 'bg-zinc-800 text-zinc-500 border-zinc-700';
  };

  const uniqueSources  = ['all', ...Array.from(new Set(recentArticles.map((a: any) => a.source_name || 'Unknown'))).sort()];
  const filteredRecent = recentArticles
    .filter((a: any) => recentSource === 'all' || a.source_name === recentSource)
    .filter((a: any) => !recentSearch || a.title?.toLowerCase().includes(recentSearch.toLowerCase()))
    .sort((a: any, b: any) => new Date(b.fetched_at || b.created_at).getTime() - new Date(a.fetched_at || a.created_at).getTime());

  const isRunning = poller?.running ?? false;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 ml-56 overflow-y-auto">
        <AdminTopBar
          title="Feed Manager"
          subtitle={`${feeds.filter(f => f.enabled).length} active · ${companyFeeds.length} companies · ${otherFeeds.length} publications`}
          actions={
            <div className="flex items-center gap-2">
              <button onClick={showRecent} className="admin-btn-ghost text-xs">
                📊 Recent (2h)
              </button>
              <button
                onClick={fetchAllFeeds}
                disabled={fetchingAll}
                className="admin-btn-success text-xs"
              >
                {fetchingAll ? '⏳ Fetching…' : '🔄 Fetch All'}
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="admin-btn-primary text-xs"
              >
                {showForm ? '✕ Cancel' : '+ Add Feed'}
              </button>
            </div>
          }
        />

        <div className="p-6 space-y-5">

          {/* ── AUTO-POLLER CONTROL PANEL ──────────────────────────────────── */}
          <div className={`rounded-xl border p-4 transition-all duration-300 ${
            isRunning
              ? 'border-emerald-500/40 bg-emerald-500/5'
              : 'border-border bg-background-card'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-4">

              {/* Left — icon + labels */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Animated pulse when running */}
                <div className={`relative flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  isRunning ? 'bg-emerald-500/15' : 'bg-background-elevated'
                }`}>
                  {isRunning && (
                    <span className="absolute inset-0 rounded-xl bg-emerald-400/20 animate-ping" />
                  )}
                  <span className="text-xl relative z-10">{isRunning ? '⚡' : '⏸'}</span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-text-primary">Auto-Poller</p>
                    <span className={`admin-badge text-[10px] border font-semibold ${
                      isRunning
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {isRunning ? '● RUNNING' : '○ STOPPED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {isRunning
                      ? 'Fetches all enabled feeds automatically. Turn off to stop.'
                      : 'No automatic fetching. Turn on to run every 2 hours.'}
                  </p>
                </div>
              </div>

              {/* Centre — stats row (only when running) */}
              {isRunning && poller && (
                <div className="flex items-center gap-5 flex-wrap">
                  <div className="text-center">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Next poll in</p>
                    <Countdown nextPollAt={poller.nextPollAt} />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Last poll</p>
                    <span className="font-mono text-xs text-text-secondary">{timeAgo(poller.lastPollAt)}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Runs</p>
                    <span className="font-mono text-xs text-text-secondary">{poller.totalRuns}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Started</p>
                    <span className="font-mono text-xs text-text-secondary">{timeAgo(poller.startedAt)}</span>
                  </div>
                </div>
              )}

              {/* Right — big toggle button */}
              <button
                onClick={handlePollerToggle}
                disabled={pollerLoading}
                className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm flex-shrink-0 ${
                  pollerLoading
                    ? 'opacity-60 cursor-not-allowed bg-background-elevated text-text-muted border border-border'
                    : isRunning
                    ? 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 hover:border-red-500/50'
                    : 'bg-emerald-500 text-white border border-emerald-600 hover:bg-emerald-400 shadow-emerald-500/20'
                }`}
              >
                {pollerLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Please wait…
                  </>
                ) : isRunning ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" rx="1"/>
                      <rect x="14" y="4" width="4" height="16" rx="1"/>
                    </svg>
                    Stop Poller
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Start Auto-Poll
                  </>
                )}
              </button>
            </div>

            {/* Info footer strip */}
            <div className="mt-3 pt-3 border-t border-border/60 flex items-center gap-3 flex-wrap">
              <span className="text-[10px] text-text-muted">
                🕐 Interval: every 2 hours
              </span>
              <span className="text-[10px] text-text-muted">·</span>
              <span className="text-[10px] text-text-muted">
                🔴 Stops if server restarts — you must re-activate manually
              </span>
              <span className="text-[10px] text-text-muted">·</span>
              <span className="text-[10px] text-text-muted">
                🔄 Use "Fetch All" below for a one-time manual fetch anytime
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Feeds',    value: feeds.length,                                    icon: '📡' },
              { label: 'Active',         value: feeds.filter(f => f.enabled).length,             icon: '✅' },
              { label: 'Top Companies',  value: companyFeeds.length,                             icon: '🏢' },
              { label: 'Error Feeds',    value: feeds.filter(f => f.last_status === 'error').length, icon: '⚠️' },
            ].map(stat => (
              <div key={stat.label} className="admin-card py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{stat.icon}</span>
                  <div>
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className="text-[10px] text-text-muted">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Feed Form */}
          {showForm && (
            <form onSubmit={handleAddFeed} className="admin-card space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">➕ Add New Feed</h3>
                <span className="text-[10px] text-text-muted bg-background-elevated px-2 py-1 rounded-full">
                  💡 Works with RSS urls or blog pages (we'll try to scrape)
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Feed Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. OpenAI Blog" className="admin-input text-xs" required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">URL * <span className="text-text-muted">(RSS feed or blog page)</span></label>
                  <input type="url" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://example.com/feed.xml" className="admin-input text-xs" required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Priority Tier</label>
                  <select value={form.priority_tier} onChange={e => setForm(f => ({ ...f, priority_tier: parseInt(e.target.value) as 1|2|3 }))} className="admin-input text-xs">
                    <option value={1}>⭐ Tier 1 – Top Companies</option>
                    <option value={2}>🔷 Tier 2 – Publications</option>
                    <option value={3}>⬛ Tier 3 – Community</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Fetch Every (minutes)</label>
                  <input type="number" value={form.fetch_frequency} onChange={e => setForm(f => ({ ...f, fetch_frequency: parseInt(e.target.value) }))} min="30" max="1440" className="admin-input text-xs" />
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <input type="checkbox" id="auto_approve" checked={form.auto_approve} onChange={e => setForm(f => ({ ...f, auto_approve: e.target.checked }))} className="accent-primary" />
                  <label htmlFor="auto_approve" className="text-xs">Auto-publish articles from this feed (skip pending queue)</label>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="admin-btn-primary text-xs">{saving ? 'Adding…' : '✅ Add Feed'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="admin-btn-ghost text-xs">Cancel</button>
              </div>
            </form>
          )}

          {/* Tab switcher + view mode */}
          <div className="flex items-center justify-between">
            <div className="flex bg-background-elevated rounded-lg p-0.5 gap-0.5">
              <button onClick={() => setTab('companies')} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${tab === 'companies' ? 'bg-primary text-white shadow' : 'text-text-secondary hover:text-white'}`}>
                🏢 Top Companies <span className="ml-1.5 text-[9px] opacity-75">({companyFeeds.length})</span>
              </button>
              <button onClick={() => setTab('feeds')} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${tab === 'feeds' ? 'bg-primary text-white shadow' : 'text-text-secondary hover:text-white'}`}>
                📰 RSS Feeds <span className="ml-1.5 text-[9px] opacity-75">({otherFeeds.length})</span>
              </button>
            </div>
            <div className="flex bg-background-elevated rounded-lg p-0.5 gap-0.5">
              <button onClick={() => setViewMode('cards')} className={`px-3 py-1.5 rounded-md text-xs transition-all ${viewMode === 'cards' ? 'bg-background-card text-white' : 'text-text-muted'}`}>⊞ Cards</button>
              <button onClick={() => setViewMode('table')} className={`px-3 py-1.5 rounded-md text-xs transition-all ${viewMode === 'table' ? 'bg-background-card text-white' : 'text-text-muted'}`}>≡ Table</button>
            </div>
          </div>

          {/* Error alert */}
          {feeds.filter(f => f.last_status === 'error').length > 0 && (
            <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/20 rounded-lg px-4 py-2.5 text-xs text-red-400">
              ⚠️ <span>{feeds.filter(f => f.last_status === 'error').length} feeds have errors. Check URLs or click Fetch to retry.</span>
            </div>
          )}

          {/* Loading skeleton */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array(6).fill(null).map((_, i) => <div key={i} className="admin-card animate-pulse h-28" />)}
            </div>
          ) : viewMode === 'cards' ? (

            /* ─── CARD VIEW ─────────────────────────────────────────────────── */
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {currentFeeds.map(feed => (
                <div key={feed.id} className={`admin-card p-4 flex flex-col gap-3 transition-all hover:border-primary/30 ${!feed.enabled ? 'opacity-50' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl">{getCompanyIcon(feed.name)}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{feed.name}</p>
                        <a href={feed.url} target="_blank" rel="noopener noreferrer" className="text-[9px] text-text-muted hover:text-primary truncate block max-w-[160px]" title={feed.url}>
                          {feed.url.replace(/^https?:\/\//, '').substring(0, 40)}
                        </a>
                      </div>
                    </div>
                    <span className={`admin-badge text-[9px] border shrink-0 ${statusColor(feed.last_status)}`}>{feed.last_status || 'pending'}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] text-text-muted bg-background-elevated px-1.5 py-0.5 rounded">{tierLabel[feed.priority_tier]}</span>
                    <span className="text-[9px] text-text-muted">🕐 {timeAgo(feed.last_fetched)}</span>
                    <span className="text-[9px] text-text-muted">⏱ {feed.fetch_frequency}m</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap mt-auto pt-2 border-t border-border">
                    <button onClick={() => fetchFeed(feed)} disabled={fetching === feed.id} className="admin-btn-ghost text-[10px] py-0.5 px-2 flex-1">
                      {fetching === feed.id ? '⏳' : '🔄 Fetch'}
                    </button>
                    <button onClick={() => { setEditingFeed(feed); setEditModal(true); }} className="admin-btn-primary text-[10px] py-0.5 px-2">✏️</button>
                    <button onClick={() => toggleEnabled(feed)} className={`text-[10px] py-0.5 px-2 admin-btn ${feed.enabled ? 'admin-btn-warning' : 'admin-btn-success'}`}>
                      {feed.enabled ? '⏸' : '▶'}
                    </button>
                    <button onClick={() => deleteFeed(feed.id)} className="admin-btn-danger text-[10px] py-0.5 px-2">🗑️</button>
                  </div>
                </div>
              ))}
            </div>

          ) : (

            /* ─── TABLE VIEW ────────────────────────────────────────────────── */
            <div className="admin-card p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-background-elevated">
                    <th className="text-left px-4 py-3 text-xs text-text-muted font-medium">Feed</th>
                    <th className="text-left px-4 py-3 text-xs text-text-muted font-medium hidden md:table-cell">Tier</th>
                    <th className="text-left px-4 py-3 text-xs text-text-muted font-medium hidden lg:table-cell">Last Fetch</th>
                    <th className="text-left px-4 py-3 text-xs text-text-muted font-medium hidden lg:table-cell">Status</th>
                    <th className="text-right px-4 py-3 text-xs text-text-muted font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentFeeds.map(feed => (
                    <tr key={feed.id} className={`table-row border-b border-border/50 last:border-0 ${!feed.enabled ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span>{getCompanyIcon(feed.name)}</span>
                          <div>
                            <p className="text-xs font-medium">{feed.name}</p>
                            <a href={feed.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline truncate max-w-[200px] block" title={feed.url}>
                              {feed.url.substring(0, 50)}{feed.url.length > 50 ? '…' : ''}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-text-secondary">{tierLabel[feed.priority_tier]}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-text-muted">{timeAgo(feed.last_fetched)}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className={`admin-badge text-[10px] border ${statusColor(feed.last_status)}`}>{feed.last_status || 'pending'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 justify-end">
                          <button onClick={() => toggleEnabled(feed)} className={`admin-btn text-[10px] py-0.5 px-2 ${feed.enabled ? 'admin-btn-warning' : 'admin-btn-success'}`}>
                            {feed.enabled ? '⏸ Disable' : '▶ Enable'}
                          </button>
                          <button onClick={() => fetchFeed(feed)} disabled={fetching === feed.id} className="admin-btn-ghost text-[10px] py-0.5 px-2">
                            {fetching === feed.id ? '⏳' : '🔄 Fetch'}
                          </button>
                          <button onClick={() => { setEditingFeed(feed); setEditModal(true); }} className="admin-btn-primary text-[10px] py-0.5 px-2">✏️ Edit</button>
                          <button onClick={() => deleteFeed(feed.id)} className="admin-btn-danger text-[10px] py-0.5 px-2">Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ─── Recent Articles Modal ─────────────────────────────────────────── */}
        {recentModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={e => { if (e.target === e.currentTarget) setRecentModal(false); }}>
            <div className="admin-card w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col animate-fade-in">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                <div>
                  <h2 className="font-bold text-sm">📊 Recent Articles — Past 2 Hours</h2>
                  <p className="text-xs text-text-muted">{recentArticles.length} total fetched</p>
                </div>
                <button onClick={() => setRecentModal(false)} className="text-text-muted hover:text-white text-xl leading-none">×</button>
              </div>
              <div className="flex gap-2 mb-4">
                <input type="text" value={recentSearch} onChange={e => setRecentSearch(e.target.value)} placeholder="Search titles…" className="admin-input text-xs flex-1" />
                <select value={recentSource} onChange={e => setRecentSource(e.target.value)} className="admin-input text-xs">
                  {uniqueSources.map(s => <option key={s} value={s}>{s === 'all' ? 'All Sources' : s}</option>)}
                </select>
              </div>
              <div className="overflow-y-auto flex-1">
                {loadingRecent ? (
                  <div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="skeleton-line h-14 rounded" />)}</div>
                ) : filteredRecent.length === 0 ? (
                  <div className="text-center py-10 text-text-muted">
                    <p className="text-2xl mb-2">📭</p>
                    <p className="text-sm">No articles fetched in the past 2 hours</p>
                    <p className="text-xs mt-1">Click "Fetch All" or start the Auto-Poller</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[10px] text-text-muted mb-2">Showing {filteredRecent.length} articles</p>
                    {filteredRecent.map((article: any) => (
                      <div key={article.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-background-elevated border border-border/50 hover:border-primary/30 transition-all">
                        <span className="text-base shrink-0 mt-0.5">{getCompanyIcon(article.source_name || '')}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium line-clamp-2">{article.title}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-[9px] text-primary">{article.source_name}</span>
                            <span className="text-[9px] text-text-muted">·</span>
                            <span className="text-[9px] text-text-muted">{timeAgo(article.fetched_at || article.created_at)}</span>
                            <span className={`admin-badge text-[9px] border ${article.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                              {article.status}
                            </span>
                          </div>
                        </div>
                        {article.source_url && (
                          <a href={article.source_url} target="_blank" rel="noopener noreferrer" className="text-[9px] text-text-muted hover:text-primary shrink-0">↗</a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── Edit Feed Modal ───────────────────────────────────────────────── */}
        {editModal && editingFeed && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={e => { if (e.target === e.currentTarget) { setEditModal(false); setEditingFeed(null); } }}>
            <div className="admin-card w-full max-w-xl animate-fade-in">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getCompanyIcon(editingFeed.name)}</span>
                  <div>
                    <h2 className="font-bold text-sm">Edit Feed</h2>
                    <p className="text-xs text-text-muted">{editingFeed.name}</p>
                  </div>
                </div>
                <button onClick={() => { setEditModal(false); setEditingFeed(null); }} className="text-text-muted hover:text-white text-xl leading-none">×</button>
              </div>
              <form onSubmit={handleEditFeed} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Feed Name *</label>
                    <input type="text" value={editingFeed.name} onChange={e => setEditingFeed({ ...editingFeed, name: e.target.value })} className="admin-input text-xs" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">URL * <span className="text-text-muted text-[9px]">(RSS or blog page)</span></label>
                    <input type="url" value={editingFeed.url} onChange={e => setEditingFeed({ ...editingFeed, url: e.target.value })} className="admin-input text-xs" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Priority Tier</label>
                    <select value={editingFeed.priority_tier} onChange={e => setEditingFeed({ ...editingFeed, priority_tier: parseInt(e.target.value) as 1|2|3 })} className="admin-input text-xs">
                      <option value={1}>⭐ Tier 1 – Top Companies</option>
                      <option value={2}>🔷 Tier 2 – Publications</option>
                      <option value={3}>⬛ Tier 3 – Community</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Fetch Every (minutes)</label>
                    <input type="number" value={editingFeed.fetch_frequency} onChange={e => setEditingFeed({ ...editingFeed, fetch_frequency: parseInt(e.target.value) })} min="30" max="1440" className="admin-input text-xs" />
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-2">
                    <input type="checkbox" id="edit_auto_approve" checked={editingFeed.auto_approve} onChange={e => setEditingFeed({ ...editingFeed, auto_approve: e.target.checked })} className="accent-primary" />
                    <label htmlFor="edit_auto_approve" className="text-xs">Auto-publish articles (skip pending queue)</label>
                  </div>
                </div>
                <div className="bg-background-elevated border border-border rounded-lg p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Last fetched</span>
                    <span>{timeAgo(editingFeed.last_fetched)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Last status</span>
                    <span className={`admin-badge text-[9px] border ${statusColor(editingFeed.last_status)}`}>{editingFeed.last_status || 'never'}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="submit" disabled={saving} className="admin-btn-primary text-xs">{saving ? 'Saving…' : '✅ Save Changes'}</button>
                  <button type="button" onClick={() => { setEditModal(false); setEditingFeed(null); }} className="admin-btn-ghost text-xs">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
