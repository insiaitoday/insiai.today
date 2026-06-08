import type { Metadata } from 'next';
import { ContactForm } from './ContactForm';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insiai.today';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export const metadata: Metadata = {
  title: 'Contact INSI AI Today — Story Tips, Partnerships & Press',
  description: 'Get in touch with the INSI AI Today team. Submit story tips, report corrections, inquire about partnerships, or reach us for press inquiries. We respond within 1–2 business days.',
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    title: 'Contact INSI AI Today',
    description: 'Reach out with story tips, corrections, partnership inquiries, or press requests. We read every message.',
    url: `${siteUrl}/contact`,
    images: [{ url: `${siteUrl}/og-default.png`, width: 1200, height: 630, alt: 'Contact INSI AI Today' }],
  },
};

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact INSI AI Today',
  url: `${siteUrl}/contact`,
  description: 'Contact the INSI AI Today editorial team for story tips, corrections, press inquiries, and advertising.',
  publisher: {
    '@type': 'Organization',
    name: 'INSI AI Today',
    url: siteUrl,
    email: 'insiai.today@gmail.com',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'insiai.today@gmail.com',
      contactType: 'editorial',
      availableLanguage: 'English',
    },
  },
};

const CONTACT_REASONS = [
  {
    icon: '📰',
    title: 'Story Tips',
    desc: 'Found a breaking AI story, a noteworthy research paper, or a product launch we should cover? Send us the link and a brief note about why it matters.',
  },
  {
    icon: '✏️',
    title: 'Corrections',
    desc: 'If you spot an error in our reporting or believe a fact needs updating, please let us know. We take accuracy seriously and publish corrections promptly.',
  },
  {
    icon: '🤝',
    title: 'Partnerships & Advertising',
    desc: 'Interested in sponsored content, newsletter placement, or direct advertising on INSI AI Today? Tell us about your brand and goals.',
  },
  {
    icon: '📢',
    title: 'Press Inquiries',
    desc: 'Media outlets and journalists needing a statement, background information, or an interview with our editorial team are welcome to reach out.',
  },
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Page header */}
        <div className="mb-8">
          <span className="badge bg-primary/15 border border-primary/30 text-primary text-xs mb-4 inline-block">Contact</span>
          <h1 className="text-3xl font-bold mb-2">Get In Touch</h1>
          <p className="text-text-secondary leading-relaxed">
            We are a small editorial team that cares a lot about the AI community. Every message we receive
            is read by a human. We aim to respond within 1–2 business days.
          </p>
        </div>

        {/* Direct email banner */}
        <div className="card p-4 mb-6 flex items-center gap-4 bg-background-elevated">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-muted mb-0.5">Prefer email? Write to us directly:</p>
            <a href="mailto:insiai.today@gmail.com" className="font-semibold text-primary hover:underline text-sm">
              insiai.today@gmail.com
            </a>
          </div>
        </div>

        {/* Why people contact us */}
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {CONTACT_REASONS.map((reason) => (
            <div key={reason.title} className="card p-4">
              <div className="text-xl mb-2">{reason.icon}</div>
              <p className="font-semibold text-sm mb-1">{reason.title}</p>
              <p className="text-text-secondary text-xs leading-relaxed">{reason.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="card p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Send Us a Message</h2>
          <ContactForm apiUrl={apiUrl} />
        </div>

        {/* Additional contact methods */}
        <div className="space-y-3">
          <h2 className="text-base font-bold">Other Ways to Reach Us</h2>

          {/* WhatsApp community */}
          <a
            href="https://chat.whatsapp.com/I9km0y6OJSxAW06X72PHbm"
            target="_blank"
            rel="noopener noreferrer"
            className="card p-4 flex items-center gap-4 hover:border-green-500/30 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-text-muted mb-0.5">Join the Community</p>
              <p className="font-semibold text-sm group-hover:text-green-600 transition-colors">WhatsApp AI Community</p>
              <p className="text-xs text-text-muted mt-0.5">Instant AI news updates — no spam, just signal</p>
            </div>
            <svg className="w-4 h-4 text-text-muted group-hover:text-green-500 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/company/insiai/"
            target="_blank"
            rel="noopener noreferrer"
            className="card p-4 flex items-center gap-4 hover:border-primary/30 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-[#0A66C2]/10 border border-[#0A66C2]/20">
              <span className="font-bold text-[#0A66C2] text-sm">in</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-text-muted mb-0.5">Follow Us</p>
              <p className="font-semibold text-sm group-hover:text-primary transition-colors">LinkedIn — INSI AI Today</p>
              <p className="text-xs text-text-muted mt-0.5">Company updates and industry insights</p>
            </div>
            <svg className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Response time note */}
        <div className="mt-8 text-center p-5 rounded-xl bg-background-elevated border border-border">
          <p className="text-sm text-text-secondary">
            <strong className="text-text-primary">Our response time:</strong> We typically reply to all
            messages within 1–2 business days. For urgent matters such as copyright issues or factual
            corrections, we prioritize those and aim to respond within 24 hours.
          </p>
        </div>
      </div>
    </>
  );
}
