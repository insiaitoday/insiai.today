'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES } from '@/types';
import { getCategoryClass } from '@/lib/utils';

interface CategoryFilterProps {
  activeCategory: string;
}

export function CategoryFilter({ activeCategory }: CategoryFilterProps) {
  const router = useRouter();
  const params = useSearchParams();

  const setCategory = (cat: string) => {
    const p = new URLSearchParams(params.toString());
    if (cat === 'All') p.delete('category');
    else p.set('category', cat);
    p.delete('page');
    router.push(`/?${p.toString()}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {CATEGORIES.map((cat) => {
        const isActive = cat === 'All' ? activeCategory === 'All' : activeCategory === cat;
        
        let buttonClass = 'bg-transparent border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300';
        
        if (isActive) {
          if (cat === 'All') {
            buttonClass = 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm border-[1.5px]';
          } else {
            // Re-use the existing colors but ensure they clearly look active
            buttonClass = `${getCategoryClass(cat)} shadow-sm border-[1.5px] font-medium`;
          }
        } else {
          // If inactive, ensure it doesn't get .cat-* classes blending in weirdly
          buttonClass = 'bg-white border-border text-text-muted hover:text-text-primary hover:border-border-strong';
        }

        return (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 rounded-full border text-xs px-4 py-1.5 transition-all duration-200 ${buttonClass}`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
