import type { Metadata } from 'next';
import './globals.css';
import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CompanyTicker } from '@/components/layout/CompanyTicker';
import { ReadingProgressBar } from '@/components/layout/ReadingProgressBar';
import { BackToTop } from '@/components/layout/BackToTop';
import { Toaster } from 'react-hot-toast';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'LeviAI Today';
const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL  || 'https://leviai.today';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — AI News, Research & Insights`,
    template: `%s | ${siteName}`,
  },
  description: 'Your daily source for AI news, research papers, product launches, and deep dives. Stay ahead with curated insights from the world of artificial intelligence.',
  keywords: ['AI news', 'artificial intelligence', 'machine learning', 'deep learning', 'OpenAI', 'Google AI', 'tech news'],
  authors: [{ name: siteName }],
  creator: siteName,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: `${siteName} — AI News, Research & Insights`,
    description: 'Your daily source for AI news, research papers, and product launches.',
    images: [{ url: `${siteUrl}/og-default.png`, width: 1200, height: 630, alt: siteName }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} — AI News`,
    description: 'Your daily source for AI news.',
    images: [`${siteUrl}/og-default.png`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: siteUrl },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#FFFFFF" />
        {/* AdSense — add your publisher ID here after approval */}
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
