import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — LeviAI Today',
  description: 'Get in touch with LeviAI Today editorial team.',
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <span className="badge bg-primary/15 border border-primary/30 text-primary text-xs mb-4 inline-block">Contact</span>
        <h1 className="text-3xl font-bold mb-2">Get In Touch</h1>
        <p className="text-text-secondary">Have a story, feedback, or partnership inquiry? We'd love to hear from you.</p>
      </div>

      <div className="card p-6 mb-6">
        <form className="space-y-4" action="mailto:contact@leviai.today" method="get">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="name">Name</label>
              <input type="text" id="name" name="name" placeholder="Your name" className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="your@email.com" className="input" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="subject">Subject</label>
            <select id="subject" name="subject" className="input">
              <option>Story tip or news submission</option>
              <option>Advertising / Partnership</option>
              <option>Press inquiry</option>
              <option>Technical issue</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="message">Message</label>
            <textarea id="message" name="body" rows={5} placeholder="Tell us more…" className="input resize-none w-full" required />
          </div>
          <button type="submit" className="btn-primary w-full justify-center">
            Send Message
          </button>
        </form>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, label: 'Email', value: 'contact@leviai.today', href: 'mailto:contact@leviai.today' },
          { icon: <span className="font-bold">𝕏</span>, label: 'Twitter', value: '@leviai_today', href: 'https://twitter.com' },
        ].map((c) => (
          <a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="card p-4 flex items-center gap-3 hover:border-primary/30 transition-colors group"
          >
            <div className="text-text-secondary group-hover:text-primary transition-colors">{c.icon}</div>
            <div>
              <p className="text-xs text-text-muted">{c.label}</p>
              <p className="text-sm font-medium group-hover:text-primary transition-colors">{c.value}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
