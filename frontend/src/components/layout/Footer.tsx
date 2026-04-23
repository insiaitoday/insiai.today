import Link from 'next/link';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';

export function Footer() {
  const year = new Date().getFullYear();

  const links = {
    Platform: [
      { label: 'Latest Posts',  href: '/?sort=new' },
      { label: 'Top Posts',  href: '/?sort=top' },
      { label: 'Articles',   href: '/articles' },
    ],
    Categories: [
      { label: 'Breaking News',    href: '/category/breaking-news' },
      { label: 'Product Launches', href: '/category/product-launches' },
      { label: 'Research Papers',  href: '/category/research-papers' },
      { label: 'Funding',          href: '/category/funding' },
      { label: 'Tools',            href: '/category/tools' },
      { label: 'Tutorials',        href: '/category/tutorials' },
    ],
    Legal: [
      { label: 'About',         href: '/about' },
      { label: 'Contact',       href: '/contact' },
      { label: 'Privacy Policy',href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  };

  return (
    <footer className="border-t border-border bg-background-surface mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* Newsletter section */}
        <div className="card gradient-border p-6 mb-12 text-center max-w-2xl mx-auto" id="newsletter">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Stay Ahead of AI</h3>
          <p className="text-text-secondary text-sm mb-4">
            Join thousands of readers getting the best AI news delivered to their inbox.
          </p>
          <NewsletterForm variant="footer" />
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-black text-sm">L</span>
              </div>
              <span className="font-bold gradient-text">LeviAI Today</span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              Your daily source for AI news, research, and insights. Curated with care.
            </p>
            {/* Social links */}
            <div className="flex gap-2">
              {[
                { icon: '𝕏', href: 'https://twitter.com', label: 'Twitter' },
                { icon: 'in', href: 'https://linkedin.com', label: 'LinkedIn' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-xs text-text-secondary hover:text-primary hover:border-primary transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3">{section}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-text-secondary hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
          <p>© {year} LeviAI Today. All rights reserved.</p>
          <p>
            Built for the AI community •{' '}
            <span className="text-text-secondary">Powered by RSS & editorial curation</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
