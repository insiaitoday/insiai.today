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
          <h3 className="text-xl font-bold mb-2">Join the World's Largest AI Community</h3>
          <p className="text-text-secondary text-sm mb-4">
            Connect with thousands of AI enthusiasts, researchers, and professionals. Stay ahead with real-time AI news and discussions.
          </p>
          <a
            href="https://chat.whatsapp.com/I9km0y6OJSxAW06X72PHbm"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', border: 'none' }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Join WhatsApp Community
          </a>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-3 group">
              <img
                src="/logo.png"
                alt="INSI AI Today"
                className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="block">
                <span className="font-bold text-base gradient-text tracking-tight">INSI AI</span>
                <span className="text-text-secondary text-sm ml-1">Today</span>
              </div>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-3">
              Your daily source for AI news, research, and insights. Curated with care.
            </p>
            <div className="relative mt-4 mb-4 p-3 rounded-xl bg-background-elevated/60 border border-border/80 shadow-sm overflow-hidden group/brand">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary to-accent opacity-70 group-hover/brand:opacity-100 transition-opacity duration-300" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-text-primary tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  INSI = <span className="gradient-text font-extrabold">Intelligence Signals</span>
                </p>
                <p className="text-xs text-text-secondary italic pl-3 leading-relaxed border-l border-primary/20">
                  “Where signals become intelligence.”
                </p>
              </div>
            </div>
            {/* Social links */}
            <div className="flex gap-2">
              <a
                href="https://www.linkedin.com/company/insiai/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-xs text-text-secondary hover:text-primary hover:border-primary transition-all font-bold"
              >
                in
              </a>
              <a
                href="https://chat.whatsapp.com/I9km0y6OJSxAW06X72PHbm"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Community"
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-secondary transition-all hover:border-green-500"
                style={{ color: '#25D366' }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
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
          <p>© {year} INSI AI Today. All rights reserved.</p>
          <p className="text-center sm:text-right leading-relaxed">
            Built for the AI community • <span className="text-text-secondary font-medium">INSI: Intelligence Signals</span> • Powered by RSS & curation
          </p>
        </div>
      </div>
    </footer>
  );
}
