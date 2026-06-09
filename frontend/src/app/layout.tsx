import type { Metadata } from 'next';
import './globals.css';
import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CompanyTicker } from '@/components/layout/CompanyTicker';
import { ReadingProgressBar } from '@/components/layout/ReadingProgressBar';
import { BackToTop } from '@/components/layout/BackToTop';
import { Toaster } from 'react-hot-toast';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'INSI AI Today';
const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL  || 'https://insiai.today';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — AI News, Research & Insights`,
    template: `%s | ${siteName}`,
  },
  description: 'INSI AI Today is your daily source for curated artificial intelligence news, research breakthroughs, product launches, and expert insights. We monitor 30+ top AI sources so you never miss what matters.',
  keywords: [
    'AI news', 'artificial intelligence news', 'machine learning news', 'deep learning',
    'OpenAI news', 'Google AI', 'Anthropic Claude', 'Meta AI', 'NVIDIA AI', 'Mistral AI',
    'xAI Grok', 'AI research papers', 'AI product launches', 'AI funding',
    'AI tools', 'AI tutorials', 'generative AI', 'large language models', 'LLM news',
    'ChatGPT news', 'Gemini AI', 'AI industry news', 'tech news', 'intelligence signals',
    'INSI AI Today', 'daily AI digest', 'AI community',
  ],
  authors: [{ name: 'INSI AI Today Editorial Team', url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: 'Technology',
  classification: 'Artificial Intelligence News',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: `${siteName} — AI News & Intelligence Signals`,
    description: 'Your daily source for curated AI news, research, and insights. INSI: Intelligence Signals — Where signals become intelligence.',
    images: [
      {
        url: `${siteUrl}/og-default.png`,
        width: 1200,
        height: 630,
        alt: `${siteName} — AI News & Intelligence Signals`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@insiai_today',
    creator: '@insiai_today',
    title: `${siteName} — AI News & Intelligence Signals`,
    description: 'Curated AI news from 30+ sources. Research, product launches, funding, and expert insights. Updated every 2 hours.',
    images: [`${siteUrl}/og-default.png`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
    types: {
      'application/rss+xml': `${siteUrl}/api/rss`,
    },
  },
  verification: {
    // Add your Google Search Console verification code here after claiming your property
    // google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

// WebSite + SearchAction schema — enables Google Sitelinks search box
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: siteUrl,
  description: 'Your daily source for AI news, research, and insights. Intelligence Signals — Where signals become intelligence.',
  inLanguage: 'en-US',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.png`,
      width: 200,
      height: 60,
    },
    sameAs: [
      'https://www.linkedin.com/company/insiai/',
      'https://chat.whatsapp.com/I9km0y6OJSxAW06X72PHbm',
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Merriweather:wght@300;400;700&family=Outfit:wght@400;600;700;800&display=swap" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#0A66C2" />
        <meta name="format-detection" content="telephone=no" />
        {/* WebSite structured data for Google Sitelinks search box */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* AdSense — add your publisher ID below after approval */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous" /> */}
      </head>
      <body>
        {/* Reading progress bar — needs Suspense for usePathname */}
        <Suspense fallback={null}>
          <ReadingProgressBar />
        </Suspense>

        <div className="min-h-screen flex flex-col">
          <Header />
          <Suspense fallback={<div style={{ height: '80px' }} />}>
            <CompanyTicker />
          </Suspense>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>

        {/* Back to top */}
        <BackToTop />

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#1F2937',
              border: '1px solid #E5E7EB',
              borderRadius: '10px',
              fontSize: '14px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            },
            success: { iconTheme: { primary: '#059669', secondary: '#FFFFFF' } },
            error:   { iconTheme: { primary: '#DC2626', secondary: '#FFFFFF' } },
          }}
        />
      </body>
    </html>
  );
}
