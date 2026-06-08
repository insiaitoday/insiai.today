const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

async function getToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('insiai_admin_session');
  if (!raw) return null;
  try {
    const session = JSON.parse(raw);
    return session?.access_token || null;
  } catch { return null; }
}

async function adminFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await getToken();
  const res   = await fetch(`${API}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const adminApi = {
  // Stats
  stats: () => adminFetch<{
    publishedPosts: number;
    pendingPosts: number;
    pendingComments: number;
    activeFeeds: number;
    subscribers: number;
    totalViews: number;
  }>('/api/admin/stats'),

  // Posts
  posts: {
    list: (params: Record<string, string | number>) => {
      const qs = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();
      return adminFetch<{ posts: import('@/types').Post[]; pagination: { total: number; totalPages: number } }>(`/api/posts?${qs}`);
    },
    get:       (slug: string) => adminFetch<import('@/types').Post>(`/api/posts/${slug}`),
    getById:   (id: string)   => adminFetch<import('@/types').Post>(`/api/admin/posts/${id}`),
    create: (data: Partial<import('@/types').Post>) => adminFetch<import('@/types').Post>('/api/posts', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<import('@/types').Post>) => adminFetch<import('@/types').Post>(`/api/posts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => adminFetch<{ success: boolean }>(`/api/posts/${id}`, { method: 'DELETE' }),
    approve: (id: string, extras?: Record<string, string>) =>
      adminFetch<import('@/types').Post>(`/api/admin/posts/${id}/approve`, { method: 'POST', body: JSON.stringify(extras || {}) }),
    skip:    (id: string) => adminFetch<import('@/types').Post>(`/api/admin/posts/${id}/skip`, { method: 'POST' }),
    feature: (id: string) => adminFetch<import('@/types').Post>(`/api/admin/posts/${id}/feature`, { method: 'POST' }),
    bulkApprove: (ids: string[]) => adminFetch<{ success: boolean; approved: number }>('/api/admin/posts/bulk-approve', { method: 'POST', body: JSON.stringify({ ids }) }),
    bulkApproveSource: (feed_id: string) => adminFetch<{ success: boolean; approved: number }>('/api/admin/posts/bulk-approve-source', { method: 'POST', body: JSON.stringify({ feed_id }) }),
    bulkDelete: (ids: string[]) => adminFetch<{ success: boolean; deleted: number }>('/api/posts/bulk-delete', { method: 'POST', body: JSON.stringify({ ids }) }),
  },

  // RSS Feeds
  feeds: {
    list:    () => adminFetch<import('@/types').RssFeed[]>('/api/rss/feeds'),
    create:  (data: Partial<import('@/types').RssFeed>) => adminFetch<import('@/types').RssFeed>('/api/rss/feeds', { method: 'POST', body: JSON.stringify(data) }),
    update:  (id: string, data: Partial<import('@/types').RssFeed>) => adminFetch<import('@/types').RssFeed>(`/api/rss/feeds/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete:  (id: string) => adminFetch<{ success: boolean }>(`/api/rss/feeds/${id}`, { method: 'DELETE' }),
    fetch:   (id: string) => adminFetch<{ success: boolean; newArticles: number }>(`/api/rss/feeds/${id}/fetch`, { method: 'POST' }),
    fetchAll: () => adminFetch<{ success: boolean; total: number }>('/api/rss/fetch-all', { method: 'POST' }),
    recent:  (id: string) => adminFetch<{ articles: any[]; count: number }>(`/api/rss/feeds/${id}/recent`),
  },

  // RSS Auto-Poller
  poller: {
    status: () => adminFetch<{
      running: boolean;
      startedAt: string | null;
      lastPollAt: string | null;
      nextPollAt: string | null;
      intervalMs: number;
      totalRuns: number;
    }>('/api/rss/poller/status'),
    start: () => adminFetch<{ ok: boolean; message: string; status: object }>('/api/rss/poller/start', { method: 'POST' }),
    stop:  () => adminFetch<{ ok: boolean; message: string; status: object }>('/api/rss/poller/stop',  { method: 'POST' }),
  },

  // Comments
  comments: {
    list:    (params: Record<string, string>) => {
      const qs = new URLSearchParams(params).toString();
      return adminFetch<{ comments: import('@/types').Comment[]; total: number }>(`/api/posts/comments/all?${qs}`);
    },
    update:  (id: string, status: string) =>
      adminFetch<import('@/types').Comment>(`/api/posts/comments/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    delete:  (id: string) => adminFetch<{ success: boolean }>(`/api/posts/comments/${id}`, { method: 'DELETE' }),
  },

  // Analytics
  analytics: {
    summary:  () => adminFetch<Array<{ date: string; views: number; upvotes: number; comments?: number }>>('/api/analytics/summary'),
    topPosts: () => adminFetch<import('@/types').Post[]>('/api/analytics/top-posts'),
    totals:   () => adminFetch<{
      totalViews: number;
      totalUpvotes: number;
      totalDownvotes: number;
      totalComments: number;
      publishedPosts: number;
    }>('/api/analytics/totals'),
  },

  // Upload
  upload: async (file: File): Promise<{ url: string }> => {
    const token = await getToken();
    const form  = new FormData();
    form.append('image', file);
    const res = await fetch(`${API}/api/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },
};
