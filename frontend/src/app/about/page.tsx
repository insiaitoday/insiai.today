import type { Metadata } from 'next';
import Link from 'next/link';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insiai.today';

export const metadata: Metadata = {
  title: 'About INSI AI Today — Our Story, Mission & Editorial Values',
  description: 'Learn about INSI AI Today, the team behind it, and why we built the most trusted daily source for curated artificial intelligence news, research, and insights.',
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: 'About INSI AI Today — Our Story, Mission & Editorial Values',
    description: 'INSI stands for Intelligence Signals. We built this platform because the AI industry moves faster than any human can track alone. Here is our story.',
    url: `${siteUrl}/about`,
    images: [{ url: `${siteUrl}/og-default.png`, width: 1200, height: 630, alt: 'About INSI AI Today' }],
  },
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About INSI AI Today',
  url: `${siteUrl}/about`,
  description: 'INSI AI Today is a curated artificial intelligence news platform built to help people stay informed without information overload.',
  publisher: {
    '@type': 'Organization',
    name: 'INSI AI Today',
    url: siteUrl,
    logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
    sameAs: ['https://www.linkedin.com/company/insiai/', 'https://chat.whatsapp.com/I9km0y6OJSxAW06X72PHbm'],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is INSI AI Today?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'INSI AI Today is a curated artificial intelligence news platform that monitors 30+ top AI sources and delivers the most important stories to you — updated every 2 hours, seven days a week.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does INSI stand for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'INSI stands for Intelligence Signals. Our tagline is "Where signals become intelligence" — reflecting our belief that raw information only becomes valuable when it is filtered, contextualized, and understood.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is INSI AI Today free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, INSI AI Today is completely free to read. We are supported by display advertising, which means you never need to pay, subscribe, or create an account to access our content. You can also join our free WhatsApp community for instant updates.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you select which AI news to publish?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our automated system monitors 30+ RSS feeds from top AI labs, research institutions, and tech publications. Every 2 hours, fresh stories are pulled in. Human editors then review, categorize, and add editorial commentary before publishing.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I submit a story or tip?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. We welcome story tips, research paper recommendations, and news leads from the community. Use the Contact page to send us your submissions.',
      },
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

        {/* Page header */}
        <div className="mb-10">
          <span className="badge bg-primary/15 border border-primary/30 text-primary text-xs mb-4 inline-block">About Us</span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            About <span className="gradient-text">INSI AI Today</span>
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed">
            We built INSI AI Today because artificial intelligence is moving too fast for anyone to keep up alone.
            Every single day, hundreds of research papers land on arXiv, dozens of product launches hit the web,
            and three or four genuinely significant breakthroughs get buried under a flood of noise.
            We created this platform to fix that.
          </p>
        </div>

        {/* Origin story */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold mb-3">Why We Built This</h2>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              The idea for INSI AI Today came from a simple frustration: our team spent hours every week
              stitching together AI news from newsletters, Twitter threads, Reddit posts, and academic
              pre-print servers. Even then, we would miss things. Important things. A new model from a
              European lab. A funding round that signaled where the industry was heading. A paper that
              quietly redefined what we thought was possible with language models.
            </p>
            <p>
              We knew other people felt the same way. AI researchers, product managers, developers, investors,
              students, and curious minds — everyone needed a single, trusted place where the signal was
              already separated from the noise. So we built it.
            </p>
            <p>
              We launched INSI AI Today as a curated intelligence layer on top of the AI industry. Our system
              runs continuously, pulling from more than 30 of the most respected AI sources on the internet.
              Then our editorial team reviews what matters, adds context, and publishes it in a format that
              respects your time and intelligence.
            </p>
          </div>
        </div>

        {/* What INSI means */}
        <div className="card p-6 mb-6" style={{ borderLeft: '3px solid var(--primary)' }}>
          <h2 className="text-xl font-bold mb-3">What Does INSI Mean?</h2>
          <p className="text-text-secondary leading-relaxed mb-3">
            <strong className="text-text-primary">INSI stands for Intelligence Signals.</strong> It reflects
            our core belief: raw data is everywhere, but intelligence is earned. There is a fundamental
            difference between consuming information and actually understanding it.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Our tagline — <em>"Where signals become intelligence"</em> — captures our promise to you.
            We do the monitoring, filtering, and contextualizing so that what reaches you is already
            meaningful. Not just another headline. Not another link dump. Something you can actually
            use to think more clearly about where AI is going.
          </p>
        </div>

        {/* How it works */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">How We Work</h2>
          <div className="space-y-5 text-text-secondary">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-text-primary mb-1">Step 1 — Continuous Monitoring</p>
                <p className="text-sm">
                  Our backend infrastructure monitors more than 30 RSS feeds from sources including OpenAI,
                  Google DeepMind, Anthropic, Meta AI, Hugging Face, MIT Technology Review, VentureBeat,
                  The Verge, TechCrunch, arXiv, and many more. This runs every 2 hours, 24 hours a day,
                  365 days a year. No story slips through unnoticed.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-text-primary mb-1">Step 2 — Editorial Review</p>
                <p className="text-sm">
                  Every story passes through human review before it goes live. Our editors verify the source,
                  categorize the post (Breaking News, Research Papers, Product Launches, Funding, Tools, or
                  Tutorials), and often add an editorial commentary explaining why a story matters. We check
                  facts, remove duplicates, and flag misleading content before it ever reaches our readers.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-text-primary mb-1">Step 3 — Community Engagement</p>
                <p className="text-sm">
                  We believe great journalism is a conversation, not a monologue. Every post on INSI AI Today
                  allows comments, upvotes, and downvotes — no account required. Our readers routinely surface
                  important context, corrections, and follow-up links in the comments. Our WhatsApp community
                  has grown into one of the most active AI discussion groups online.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What we cover */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">What We Cover</h2>
          <p className="text-text-secondary mb-4 leading-relaxed">
            We cover the full breadth of the artificial intelligence industry — from fundamental research to
            the tools developers use every day. Our six content categories are designed to serve different
            kinds of readers with different needs:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                label: 'Breaking News',
                desc: 'Time-sensitive AI developments requiring immediate attention. Model launches, policy decisions, major announcements from leading labs.',
              },
              {
                label: 'Product Launches',
                desc: 'New AI tools, APIs, platforms, and services entering the market. What is shipping, what it does, and who it is for.',
              },
              {
                label: 'Research Papers',
                desc: 'Peer-reviewed studies, pre-prints, and academic breakthroughs from top AI institutions. Made accessible to a general audience.',
              },
              {
                label: 'Funding',
                desc: 'Venture capital deals, Series rounds, acquisitions, and IPOs across the AI sector. Follow the money to understand where the industry is heading.',
              },
              {
                label: 'Tools & APIs',
                desc: 'Open-source libraries, developer tools, no-code platforms, and productivity AI software. Curated resources for builders and makers.',
              },
              {
                label: 'Tutorials',
                desc: 'Step-by-step guides, walkthroughs, and learning resources. From prompt engineering basics to fine-tuning large language models.',
              },
            ].map((c) => (
              <div key={c.label} className="p-4 rounded-lg bg-background-elevated border border-border">
                <p className="text-sm font-semibold mb-1">{c.label}</p>
                <p className="text-xs text-text-muted leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our editorial values */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Our Editorial Values</h2>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <div>
              <p className="font-semibold text-text-primary mb-1">Accuracy over speed</p>
              <p className="text-sm">
                We would rather be second with the right information than first with the wrong one.
                Every story we publish is verified against the original source before it goes live.
                When we make mistakes — and we are human, so it happens — we correct them visibly
                and promptly.
              </p>
            </div>
            <div>
              <p className="font-semibold text-text-primary mb-1">Transparency about sources</p>
              <p className="text-sm">
                Every news post links directly to the original reporting. We believe in giving full
                credit to the journalists, researchers, and publications doing the primary work.
                We are curators and contextualizers, not original reporters — and we are clear about that.
              </p>
            </div>
            <div>
              <p className="font-semibold text-text-primary mb-1">Independence from AI companies</p>
              <p className="text-sm">
                We are not sponsored by, affiliated with, or funded by any AI lab or technology company.
                Our revenue comes from advertising. This independence means we can cover AI developments
                critically, praise what deserves praise, and raise concerns where they exist — without
                pressure from any corporate agenda.
              </p>
            </div>
            <div>
              <p className="font-semibold text-text-primary mb-1">Respect for your time</p>
              <p className="text-sm">
                We write for intelligent adults who are busy. Our summaries are designed to give you
                everything you need in 60 seconds, with the option to dive deeper if you want to.
                We never pad content for SEO, and we never publish stories just to fill a quota.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">INSI AI Today by the Numbers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { stat: '30+', label: 'AI sources monitored' },
              { stat: '2hrs', label: 'Update frequency' },
              { stat: '6', label: 'Content categories' },
              { stat: '100%', label: 'Human-reviewed' },
            ].map((item) => (
              <div key={item.label} className="text-center p-3 rounded-lg bg-background-elevated">
                <p className="text-2xl font-bold gradient-text mb-1">{item.stat}</p>
                <p className="text-xs text-text-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {[
              {
                q: 'What does INSI stand for?',
                a: 'INSI stands for Intelligence Signals. Our tagline is "Where signals become intelligence" — reflecting our belief that raw information only becomes valuable when it is filtered, contextualized, and made useful.',
              },
              {
                q: 'Is INSI AI Today free to read?',
                a: 'Yes, completely free. We are supported by display advertising, which keeps the platform running at no cost to our readers. You never need to create an account, subscribe to a paywall, or pay anything to read our content.',
              },
              {
                q: 'How do I submit a story or tip?',
                a: 'We love story tips from the community. Head to our Contact page and choose "Story tip or news submission" as your subject. Our editors review every submission and respond as quickly as possible.',
              },
              {
                q: 'Can I comment or vote without creating an account?',
                a: 'Absolutely. Upvoting, downvoting, and commenting on posts do not require any registration. We want as low a barrier to participation as possible.',
              },
              {
                q: 'Do you cover AI news from outside the United States?',
                a: 'Yes. We actively monitor sources from Europe, Asia, Canada, and beyond. AI is a global industry and we aim to reflect that. If you notice we are missing an important regional source, let us know.',
              },
              {
                q: 'How can I advertise on INSI AI Today?',
                a: 'We welcome advertising partnerships, sponsorships, and newsletter placements. Please reach out through our Contact page with the subject "Advertising / Partnership" and our team will get back to you within 48 hours.',
              },
            ].map((item) => (
              <details key={item.q} className="group">
                <summary className="font-semibold text-sm cursor-pointer list-none flex items-center justify-between gap-2 py-1">
                  {item.q}
                  <svg className="w-4 h-4 text-text-muted transition-transform group-open:rotate-180 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="text-text-secondary text-sm mt-2 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Join community / contact CTA */}
        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          <div className="card p-6 text-center">
            <p className="font-bold mb-2">Have a Story Tip?</p>
            <p className="text-text-secondary text-sm mb-4">
              Our editors read every submission. Reach out and let us know what we should be covering.
            </p>
            <Link href="/contact" className="btn-primary inline-flex">
              Contact the Team →
            </Link>
          </div>
          <div className="card p-6 text-center" style={{ background: 'linear-gradient(135deg, rgba(37,211,102,0.06) 0%, rgba(18,140,126,0.08) 100%)' }}>
            <p className="font-bold mb-2">Join Our Community</p>
            <p className="text-text-secondary text-sm mb-4">
              Thousands of AI enthusiasts discuss the day&apos;s biggest stories in real time.
            </p>
            <a
              href="https://chat.whatsapp.com/I9km0y6OJSxAW06X72PHbm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
            >
              Join WhatsApp →
            </a>
          </div>
        </div>

      </div>
    </>
  );
}
