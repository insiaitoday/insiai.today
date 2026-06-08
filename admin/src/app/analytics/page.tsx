'use client';

import { useEffect, useState, useCallback } from 'react';
import { requireSession } from '@/lib/auth';
import { adminApi } from '@/lib/api';
import { AdminSidebar } from '@/components/shell/AdminSidebar';
import { AdminTopBar } from '@/components/shell/AdminTopBar';
import type { Post } from '@/types';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';

function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

interface Totals {
  totalViews: number;
  totalUpvotes: number;
  totalDownvotes: number;
  totalComments: number;
  publishedPosts: number;
}

export default function AnalyticsPage() {
  const [series,  setSeries]  = useState<{ date: string; views: number; upvotes: number; comments?: number }[]>([]);
  const [top,     setTop]     = useState<Post[]>([]);
  const [totals,  setTotals]  = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate,  setLastUpdate]  = useState<Date>(new Date());

  const loadData = useCallback(async () => {
    try {
      const [an, tp, tot] = await Promise.all([
        adminApi.analytics.summary(),
        adminApi.analytics.topPosts(),
        adminApi.analytics.totals().catch(() => null),
      ]);

      setSeries(an.slice(-30));
      setTop(tp);
      if (tot) setTotals(tot);
      setLastUpdate(new Date());
    } catch {
      // Silent fail — don't crash the page
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    requireSession().then(async (s) => {
      if (!s) return;
      await loadData();
    });
  }, [loadData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(loadData, 30_000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadData]);

  // Use totals from /totals endpoint if available; fall back to summing the 30-day series
  const totalViews    = totals?.totalViews    ?? series.reduce((s, r) => s + r.views, 0);
  const totalUpvotes  = totals?.totalUpvotes  ?? series.reduce((s, r) => s + r.upvotes, 0);
  const totalComments = totals?.totalComments ?? series.reduce((s, r) => s + (r.comments || 0), 0);
  const publishedPosts = totals?.publishedPosts ?? 0;

  const summaryCards = [
    { label: 'Total Views',      value: formatNumber(totalViews),    icon: '👁',  color: 'text-primary'  },
    { label: 'Total Upvotes',    value: formatNumber(totalUpvotes),  icon: '▲',   color: 'text-success'  },
    { label: 'Total Comments',   value: formatNumber(totalComments), icon: '💬',  color: 'text-accent'   },
    { label: 'Published Posts',  value: formatNumber(publishedPosts),icon: '📰',  color: 'text-warning'  },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 lg:ml-56 p-3 lg:p-6 w-full max-w-[100vw] lg:max-w-none overflow-y-auto">
        <AdminTopBar
          title="Analytics"
          subtitle={`Live totals + last 30 days trend • Updated ${lastUpdate.toLocaleTimeString()}`}
          actions={
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`admin-btn text-xs ${autoRefresh ? 'admin-btn-success' : 'admin-btn-ghost'}`}
              >
                {autoRefresh ? '🔄 Auto-refresh ON' : '⏸ Auto-refresh OFF'}
              </button>
              <button
                onClick={loadData}
                disabled={loading}
                className="admin-btn-primary text-xs"
              >
                {loading ? '⏳ Loading...' : '🔄 Refresh Now'}
              </button>
            </div>
          }
        />

        {/* Summary cards — sourced from posts table directly (always accurate) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {summaryCards.map((c) => (
            <div key={c.label} className="admin-card text-center relative overflow-hidden">
              {autoRefresh && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                </div>
              )}
              <div className="text-2xl mb-1">{c.icon}</div>
              {loading ? (
                <div className="h-8 skeleton-line rounded mx-auto w-16 mb-1" />
              ) : (
                <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
              )}
              <p className="text-text-secondary text-xs">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Charts — 30-day trend from analytics table */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="admin-card">
            <h2 className="font-semibold text-sm mb-4">📈 Daily Views (last 30 days)</h2>
            {loading ? (
              <div className="h-48 skeleton-line rounded-xl" />
            ) : series.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-text-muted text-sm">
                No view data yet — views will appear here as articles get read.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={series}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8B949E' }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 10, fill: '#8B949E' }} tickFormatter={formatNumber} />
                  <Tooltip contentStyle={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: 8, fontSize: 11 }} />
                  <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} dot={false} name="Views" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="admin-card">
            <h2 className="font-semibold text-sm mb-4">▲ Daily Upvotes (last 30 days)</h2>
            {loading ? (
              <div className="h-48 skeleton-line rounded-xl" />
            ) : series.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-text-muted text-sm">
                No upvote data yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={series}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8B949E' }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 10, fill: '#8B949E' }} />
                  <Tooltip contentStyle={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="upvotes" fill="#10B981" radius={[3, 3, 0, 0]} name="Upvotes" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top posts table — sorted by view_count from posts table */}
        <div className="admin-card p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-sm">🏆 Top Posts by Views</h2>
            <span className="text-xs text-text-muted">Sorted by all-time views</span>
          </div>
          {loading ? (
            <div className="p-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 skeleton-line rounded mb-3" />
              ))}
            </div>
          ) : top.length === 0 ? (
            <div className="p-6 text-center text-text-muted text-sm">
              No posts with views yet. Visit an article on the frontend to start counting!
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background-elevated">
                  <th className="text-left px-4 py-2 text-xs text-text-secondary font-medium">#</th>
                  <th className="text-left px-4 py-2 text-xs text-text-secondary font-medium">Post</th>
                  <th className="text-right px-4 py-2 text-xs text-text-secondary font-medium">Views</th>
                  <th className="text-right px-4 py-2 text-xs text-text-secondary font-medium">▲ Votes</th>
                </tr>
              </thead>
              <tbody>
                {top.map((p, i) => (
                  <tr key={p.id} className="table-row border-b border-border last:border-0">
                    <td className="px-4 py-2.5 text-xs text-text-muted">{i + 1}</td>
                    <td className="px-4 py-2.5">
                      <p className="text-xs font-medium line-clamp-1">{p.title}</p>
                      <p className="text-[10px] text-text-muted">{p.category} • {p.type}</p>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="text-xs font-bold text-primary">{formatNumber(p.view_count)}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs font-medium text-success">▲ {p.upvotes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
