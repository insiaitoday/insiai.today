'use client';

import { useEffect, useState } from 'react';
import { requireSession } from '@/lib/auth';
import { adminApi } from '@/lib/api';
import { AdminSidebar } from '@/components/shell/AdminSidebar';
import { AdminTopBar } from '@/components/shell/AdminTopBar';
import type { Post } from '@/types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

function formatNumber(n: number) { return n >= 1000 ? `${(n/1000).toFixed(1)}k` : String(n); }

export default function AnalyticsPage() {
  const [series, setSeries] = useState<{ date: string; views: number; upvotes: number; comments?: number }[]>([]);
  const [top,    setTop]    = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadData = async () => {
    try {
      const [an, tp] = await Promise.all([adminApi.analytics.summary(), adminApi.analytics.topPosts()]);
      setSeries(an.slice(-30));
      setTop(tp);
      setLastUpdate(new Date());
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requireSession().then(async (s) => {
      if (!s) return;
      await loadData();
    });
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadData();
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const totalViews    = series.reduce((s, r) => s + r.views, 0);
  const totalUpvotes  = series.reduce((s, r) => s + r.upvotes, 0);
  const totalComments = series.reduce((s, r) => s + (r.comments || 0), 0);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 lg:ml-56 p-3 lg:p-6 w-full max-w-[100vw] lg:max-w-none overflow-y-auto">
        <AdminTopBar
          title="Analytics"
          subtitle={`Last 30 days • Updated ${lastUpdate.toLocaleTimeString()}`}
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

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Views',    value: formatNumber(totalViews),    icon: '👁', color: 'text-primary' },
            { label: 'Total Upvotes',  value: formatNumber(totalUpvotes),  icon: '▲',  color: 'text-success' },
            { label: 'Total Comments', value: formatNumber(totalComments), icon: '💬', color: 'text-accent' },
          ].map((c) => (
            <div key={c.label} className="admin-card text-center relative overflow-hidden">
              {autoRefresh && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                </div>
              )}
              <div className="text-2xl mb-1">{c.icon}</div>
              <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
              <p className="text-text-secondary text-xs">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="admin-card">
            <h2 className="font-semibold text-sm mb-4">📈 Daily Views</h2>
            {loading ? <div className="h-48 skeleton-line rounded-xl" /> : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={series}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8B949E' }} tickFormatter={(v)=>v.slice(5)} />
                  <YAxis tick={{ fontSize: 10, fill: '#8B949E' }} tickFormatter={formatNumber} />
                  <Tooltip contentStyle={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: 8, fontSize: 11 }} />
                  <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="admin-card">
            <h2 className="font-semibold text-sm mb-4">▲ Daily Upvotes</h2>
            {loading ? <div className="h-48 skeleton-line rounded-xl" /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={series}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8B949E' }} tickFormatter={(v)=>v.slice(5)} />
                  <YAxis tick={{ fontSize: 10, fill: '#8B949E' }} />
                  <Tooltip contentStyle={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="upvotes" fill="#10B981" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top posts table */}
        <div className="admin-card p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="font-semibold text-sm">🏆 Top Posts by Views</h2>
          </div>
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
                <tr key={p.id} className="table-row">
                  <td className="px-4 py-2.5 text-xs text-text-muted">{i + 1}</td>
                  <td className="px-4 py-2.5">
                    <p className="text-xs font-medium line-clamp-1">{p.title}</p>
                    <p className="text-[10px] text-text-muted">{p.category} • {p.type}</p>
                  </td>
                  <td className="px-4 py-2.5 text-right text-xs font-medium text-primary">{formatNumber(p.view_count)}</td>
                  <td className="px-4 py-2.5 text-right text-xs font-medium text-success">▲ {p.upvotes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
