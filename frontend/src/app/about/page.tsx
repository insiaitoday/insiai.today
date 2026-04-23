import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About LeviAI Today',
  description: 'Learn about LeviAI Today — your daily source for curated AI news, research, and insights.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <span className="badge bg-primary/15 border border-primary/30 text-primary text-xs mb-4 inline-block">About Us</span>
        <h1 className="text-3xl font-bold mb-4">About <span className="gradient-text">LeviAI Today</span></h1>
        <p className="text-text-secondary text-lg leading-relaxed">
          Your daily source for everything happening in the world of artificial intelligence.
        </p>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold mb-3">Our Mission</h2>
        <p className="text-text-secondary leading-relaxed">
          LeviAI Today was created to solve a simple problem: there's too much AI news, and not enough curation.
          We automatically aggregate the most important stories from 30+ top AI sources — then our editors
          add context, commentary, and insights to help you actually understand what matters.
        </p>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold mb-3">How It Works</h2>
        <div className="space-y-4 text-text-secondary">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text-primary mb-1">Automated Collection</p>
              <p className="text-sm">Our system monitors 30+ RSS feeds from top AI labs, research institutions, and tech publications — updated every 2 hours.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text-primary mb-1">Editorial Curation</p>
              <p className="text-sm">Every story passes through our human editors who review, categorize, and add commentary before publishing.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text-primary mb-1">Community Engagement</p>
              <p className="text-sm">Upvote, comment, and discuss the most important AI developments. No registration required.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold mb-3">What We Cover</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: 'Breaking News', desc: 'Real-time AI developments' },
            { label: 'Product Launches', desc: 'New tools and models' },
            { label: 'Research Papers', desc: 'Academic breakthroughs' },
            { label: 'Funding Rounds', desc: 'Investment and VC news' },
            { label: 'Tools & APIs', desc: 'Developer resources' },
            { label: 'Tutorials', desc: 'Learning resources' },
          ].map((c) => (
            <div key={c.label} className="p-3 rounded-lg bg-background-elevated border border-border">
              <p className="text-sm font-semibold mb-1">{c.label}</p>
              <p className="text-xs text-text-muted">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center p-8">
        <p className="text-text-secondary mb-4">Have a story tip or want to get in touch?</p>
        <a href="/contact" className="btn-primary">Contact Us</a>
      </div>
    </div>
  );
}
