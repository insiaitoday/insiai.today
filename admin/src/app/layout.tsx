import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: { default: 'LeviAI Admin', template: '%s | LeviAI Admin' },
  description: 'LeviAI Today Admin Panel',
  robots: 'noindex, nofollow',
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#0D1117" />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1C2128', color: '#E6EDF3', border: '1px solid #30363D', borderRadius: '8px', fontSize: '13px' },
            success: { iconTheme: { primary: '#10B981', secondary: '#1C2128' } },
            error:   { iconTheme: { primary: '#EF4444', secondary: '#1C2128' } },
          }}
        />
      </body>
    </html>
  );
}
