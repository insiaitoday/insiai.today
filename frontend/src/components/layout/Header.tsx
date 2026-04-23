'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function Header() {
  const [scrolled, setScrolled]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router   = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length < 2) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const navLinks = [
    { href: '/?sort=new',  label: 'Latest' },
    { href: '/?sort=top',  label: 'Top' },
    { href: '/articles',   label: 'Articles' },
    { href: '/about',      label: 'About' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-border shadow-sm' : 'bg-background-surface'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 h-16 flex items-center justify-between gap-1 sm:gap-4 overflow-hidden">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
            <span className="text-white font-black text-sm">L</span>
          </div>
          <div className="block">
            <span className="font-bold text-base gradient-text">LeviAI</span>
            <span className="text-text-secondary text-sm ml-1">Today</span>
          </div>
        </Link>

        {/* Main Nav */}
        <nav className="flex items-center gap-1 sm:gap-2 flex-1 justify-end md:justify-center overflow-x-auto no-scrollbar mask-edges px-2">
          {navLinks.filter(l => l.label !== 'About').map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm text-text-secondary hover:text-text-primary hover:bg-background-elevated transition-all duration-200 whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
          {/* About link desktop only */}
          {navLinks.filter(l => l.label === 'About').map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hidden md:flex px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-background-elevated transition-all duration-200"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Search toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-elevated transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Newsletter CTA */}
          <Link href="/#newsletter" className="hidden sm:flex btn-primary text-xs px-3 py-1.5">
            Subscribe
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-lg text-text-secondary hover:bg-background-elevated transition-all"
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Search bar dropdown */}
      {searchOpen && (
        <div className="border-t border-border bg-background-surface px-4 py-3 animate-fade-in">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AI news, articles, topics…"
              className="input flex-1"
            />
            <button type="submit" className="btn-primary px-4">
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="btn-ghost px-3"
            >
              ✕
            </button>
          </form>
        </div>
      )}

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background-surface animate-slide-up">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {navLinks.filter(l => l.label === 'About').map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-background-elevated transition-all"
              >
                {l.label}
              </Link>
            ))}
            <div className="border-t border-border mt-2 pt-2">
              <Link
                href="/#newsletter"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full justify-center text-sm"
              >
                Subscribe to Newsletter
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
