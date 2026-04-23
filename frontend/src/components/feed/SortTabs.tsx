'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface SortTabsProps {
  activeSort: string;
}

const SORTS = [
  { id: 'new',  label: 'Latest',  title: 'Latest published posts' },
  { id: 'top',  label: 'Top',  title: 'All-time most upvoted' },
];

export function SortTabs({ activeSort }: SortTabsProps) {
  const router = useRouter();
  const params = useSearchParams();

  const setSort = (sort: string) => {
    const p = new URLSearchParams(params.toString());
    p.set('sort', sort);
    p.delete('page');
    router.push(`/?${p.toString()}`);
  };

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-background-surface border border-border w-fit">
      {SORTS.map((s) => (
        <button
          key={s.id}
          onClick={() => setSort(s.id)}
          title={s.title}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
            activeSort === s.id
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:text-text-primary hover:bg-background-elevated'
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
