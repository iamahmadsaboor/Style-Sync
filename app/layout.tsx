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
  description: 'Next-generation virtual try-on technology for fashion forward individuals. Experience clothes before you buy them with AI-powered virtual fitting.',
  keywords: ['virtual try-on', 'AI fashion', 'clothing visualization', 'fashion tech', 'StyleSync'],
  authors: [{ name: 'Ahmad Saboor', url: 'https://github.com/iamahmadsaboor' }],
  creator: 'Ahmad Saboor (@iamahmadsaboor)',
  publisher: 'StyleSync',
  metadataBase: new URL('https://stylesync.vercel.app'),
  openGraph: {
    title: 'StyleSync | Virtual Try-On Platform',
    description: 'Experience clothes before you buy them with AI-powered virtual fitting.',
    url: 'https://stylesync.vercel.app',
    siteName: 'StyleSync',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'StyleSync Virtual Try-On Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StyleSync | Virtual Try-On Platform',
    description: 'Experience clothes before you buy them with AI-powered virtual fitting.',
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
  verification: {
    google: 'your-google-verification-code',
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