'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { requireSession } from '@/lib/auth';
import { adminApi } from '@/lib/api';
import { AdminSidebar } from '@/components/shell/AdminSidebar';
import { AdminTopBar } from '@/components/shell/AdminTopBar';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

function formatNumber(n: number) {
  if (n >= 1000) return `${(n/1000).toFixed(1)}k`;
  return String(n);
}

interface Stats {
  publishedPosts: number;
  pendingPosts: number;
  pendingComments: number;
  activeFeeds: number;
  subscribers: number;
  totalViews: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats,  setStats]  = useState<Stats | null>(null);
  const [series, setSeries] = useState<{ date: string; views: number }[]>([]);
  const [top,    setTop]    = useState<import('@/types').Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requireSession().then((s) => {
      if (!s) return;
      Promise.all([
        adminApi.stats(),
        adminApi.analytics.summary(),
        adminApi.analytics.topPosts(),
      ]).then(([s, an, tp]) => {
        setStats(s);
        setSeries(an.slice(-14));
        setTop(tp.slice(0, 5));
      }).catch(() => toast.error('Failed to load dashboard data'))
        .finally(() => setLoading(false));
    });
  }, []);

  const statCards = stats ? [
    { icon: '📝', label: 'Published Posts', value: formatNumber(stats.publishedPosts), color: 'text-primary',  href: '/published' },
    { icon: '⏳', label: 'Pending Review',  value: formatNumber(stats.pendingPosts),   color: 'text-warning',  href: '/pending' },
    { icon: '💬', label: 'Pending Comments', value: formatNumber(stats.pendingComments), color: 'text-accent', href: '/comments' },
    { icon: '📡', label: 'Active Feeds',    value: formatNumber(stats.activeFeeds),    color: 'text-success',  href: '/feeds' },
    { icon: '👁', label: 'Total Views',     value: formatNumber(stats.totalViews),     color: 'text-primary',  href: '/analytics' },
    { icon: '📬', label: 'Subscribers',     value: formatNumber(stats.subscribers),    color: 'text-accent',   href: '/settings' },
  ] : Array(6).fill(null);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar pendingCount={stats?.pendingPosts} />

      <main className="flex-1 lg:ml-56 p-3 lg:p-6 w-full max-w-[100vw] lg:max-w-none overflow-y-auto">
        <AdminTopBar
          title="Dashboard"
          subtitle={`Welcome back — ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
          actions={
            <Link href="/pending" className="admin-btn-primary text-xs">
              ⏳ Review Queue {stats?.pendingPosts ? `(${stats.pendingPosts})` : ''}
            </Link>
          }
        />

        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          {statCards.map((card, i) => (
            card ? (
              <Link key={card.label} href={card.href} className="stat-card group cursor-pointer">
                <div className={`text-3xl group-hover:scale-110 transition-transform`}>{card.icon}</div>
                <div>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                  <p className="text-text-secondary text-xs">{card.label}</p>
                </div>
              </Link>
            ) : (
              <div key={i} className="stat-card">
                <div className="skeleton-line w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton-line w-16 h-6" />
                  <div className="skeleton-line w-24 h-3" />
                </div>
              </div>
            )
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Views chart */}
          <div className="admin-card lg:col-span-2">
            <h2 className="font-semibold mb-4 text-sm">📈 Views — Last 14 Days</h2>
            {series.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={series}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8B949E' }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 10, fill: '#8B949E' }} tickFormatter={formatNumber} />
                  <Tooltip
                    contentStyle={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#E6EDF3' }}
                    itemStyle={{ color: '#60A5FA' }}
                  />
                  <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#3B82F6' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-text-muted text-sm">
                <div className="text-center"><div className="text-3xl mb-2">📊</div>No data yet</div>
              </div>
            )}
          </div>

          {/* Top posts */}
          <div className="admin-card">
            <h2 className="font-semibold mb-4 text-sm">🏆 Top Posts</h2>
            {top.length > 0 ? (
              <div className="space-y-3">
                {top.map((p, i) => (
                  <div key={p.id} className="flex gap-2 items-start">
                    <span className="text-xs text-text-muted font-bold w-4 shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-primary line-clamp-2">{p.title}</p>
                      <div className="flex gap-2 mt-0.5">
                        <span className="text-[10px] text-success">👁 {formatNumber(p.view_count)}</span>
                        <span className="text-[10px] text-primary">▲ {p.upvotes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-xs">No posts yet</p>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="admin-card mt-6">
          <h2 className="font-semibold mb-4 text-sm">⚡ Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/articles/new" className="admin-btn-primary text-xs">✍️ Write Article</Link>
            <Link href="/pending"      className="admin-btn-warning text-xs">⏳ Review Pending Queue</Link>
            <Link href="/feeds"        className="admin-btn-ghost text-xs">📡 Manage RSS Feeds</Link>
            <Link href="/comments"     className="admin-btn-ghost text-xs">💬 Moderate Comments</Link>
            <button
              onClick={async () => { toast.loading('Fetching all feeds…'); await adminApi.feeds.fetchAll(); toast.dismiss(); toast.success('Feed fetch complete!'); }}
              className="admin-btn-success text-xs"
            >
              🔄 Fetch All Feeds Now
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
