import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'StyleSync | Virtual Try-On Platform',
  description: 'Next-generation virtual try-on technology powered by RapidAPI. Experience clothes before you buy them with advanced diffusion-based virtual fitting.',
  keywords: ['virtual try-on', 'RapidAPI', 'clothing visualization', 'fashion tech', 'StyleSync', 'Ahmad Saboor'],
  authors: [{ name: 'Ahmad Saboor', url: 'https://github.com/iamahmadsaboor' }],
  creator: 'Ahmad Saboor (@iamahmadsaboor)',
  publisher: 'StyleSync',
  metadataBase: new URL('https://style-sync-kappa.vercel.app'),
  openGraph: {
    title: 'StyleSync | Virtual Try-On Platform',
    description: 'Experience clothes before you buy them with RapidAPI-powered virtual fitting technology.',
    url: 'https://style-sync-kappa.vercel.app',
    siteName: 'StyleSync',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'StyleSync Virtual Try-On Platform by Ahmad Saboor',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StyleSync | Virtual Try-On Platform',
    description: 'Experience clothes before you buy them with RapidAPI-powered virtual fitting technology.',
    images: ['/og-image.jpg'],
    creator: '@iamahmadsaboor',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}