// All API calls to the backend

// Use server-relative URL for server components (SSR), fallback to localhost
const API = (typeof window === 'undefined')
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002');

async function fetchAPI<T>(path: string, options?: RequestInit & { next?: { revalidate?: number; tags?: string[] } }): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    // Don't cache public feeds — always fresh data (fixes approved posts not showing)
    cache: 'no-store',
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ── Posts ────────────────────────────────────────────────────
export const api = {
  posts: {
    list: (params: Record<string, string | number>) => {
      const qs = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();
      return fetchAPI<{ posts: import('@/types').Post[]; pagination: import('@/types').Pagination }>(`/api/posts?${qs}`);
    },
    get: (slug: string) =>
      fetchAPI<import('@/types').Post>(`/api/posts/${slug}`),

    related: (id: string) =>
      fetchAPI<import('@/types').Post[]>(`/api/posts/related/${id}`),

    byCompany: (company: string, page = 1) => {
      const qs = new URLSearchParams({
        sort: 'new',
        limit: '20',
        status: 'published',
        page: String(page),
        search: company,
      }).toString();
      return fetchAPI<{ posts: import('@/types').Post[]; pagination: import('@/types').Pagination }>(`/api/posts?${qs}`);
    },
  },

  votes: {
    cast: (postId: string, type: 'up' | 'down') =>
      fetchAPI<{ action: string; type: string }>(`/api/posts/${postId}/vote`, {
        method: 'POST',
        body: JSON.stringify({ type }),
        cache: 'no-store',
      }),

    myVote: (postId: string) =>
      fetchAPI<{ vote: 'up' | 'down' | null }>(`/api/posts/${postId}/my-vote`),
  },

  comments: {
    list: (postId: string) =>
      fetchAPI<import('@/types').Comment[]>(`/api/posts/${postId}/comments`),

    create: (postId: string, comment: { author_name: string; author_email: string; content: string; parent_id?: string }) =>
      fetchAPI<import('@/types').Comment>(`/api/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify(comment),
        cache: 'no-store',
      }),
  },

  search: {
    query: (q: string, page = 1) =>
      fetchAPI<import('@/types').SearchResponse>(`/api/search?q=${encodeURIComponent(q)}&page=${page}`),
  },

  newsletter: {
    subscribe: (email: string, frequency: 'daily' | 'weekly' = 'weekly') =>
      fetchAPI<{ success: boolean; message: string }>('/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email, frequency }),
        cache: 'no-store',
      }),
  },
};
