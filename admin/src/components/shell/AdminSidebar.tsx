'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { signOut } from '@/lib/auth';

const navItems = [
  { href: '/dashboard',  icon: '📊', label: 'Dashboard' },
  { href: '/pending',    icon: '⏳', label: 'Pending Queue', badge: true },
  { href: '/published',  icon: '✅', label: 'Published Posts' },
  { href: '/articles/new', icon: '✍️', label: 'New Article' },
  { href: '/feeds',      icon: '📡', label: 'RSS Feeds' },
  { href: '/comments',   icon: '💬', label: 'Comments' },
  { href: '/analytics',  icon: '📈', label: 'Analytics' },
  { href: '/settings',   icon: '⚙️', label: 'Settings' },
];

interface AdminSidebarProps {
  pendingCount?: number;
}

export function AdminSidebar({ pendingCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsOpen((prev) => !prev);
    window.addEventListener('toggleSidebar', handler);
    return () => window.removeEventListener('toggleSidebar', handler);
  }, []);

  return (
    <>
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside className={`fixed top-0 left-0 h-screen w-56 flex flex-col border-r border-border bg-background-surface z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-black text-xs">L</span>
          </div>
          <div>
            <span className="text-sm font-bold text-white">LeviAI</span>
            <span className="text-xs text-text-secondary ml-1">Admin</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 group ${
                isActive
                  ? 'bg-primary/15 text-primary font-semibold border border-primary/20'
                  : 'text-text-secondary hover:text-white hover:bg-background-elevated'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && pendingCount > 0 && (
                <span className="bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {pendingCount > 99 ? '99+' : pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-border">
        <a
          href={process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-background-elevated transition-all mb-1"
        >
          <span>🌐</span> View Site
        </a>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-danger hover:bg-danger/10 transition-all"
        >
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
    </>
  );
}
