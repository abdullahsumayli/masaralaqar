import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import './globals.css'
import { ReferralCookieHandler } from '@/components/affiliate/ReferralCookieHandler'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { ScrollToTop } from '@/components/ScrollToTop'
import { ChatWidget } from '@/components/ChatWidget'

export const viewport: Viewport = {
  themeColor: '#070B14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: {
    default: 'مسار العقار — حلول الذكاء الاصطناعي للمكاتب العقارية',
    template: '%s | مسار العقار',
  },
  description: 'منصة سعودية متخصصة في تقديم حلول تقنية متطورة للقطاع العقاري. نظام صقر للرد الآلي الذكي، الوساطة العقارية، والتدريب الاحترافي.',
  keywords: ['مسار العقار','نظام صقر','واتساب عقاري','رد آلي عقار','ذكاء اصطناعي عقاري','وسيط عقاري','تدريب عقاري','أكاديمية عقارية','سوق العقار السعودي'],
  authors: [{ name: 'مسار العقار' }],
  creator: 'مسار العقار',
  publisher: 'مسار العقار',
  metadataBase: new URL('https://masaralaqar.com'),
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: 'en_US',
    url: 'https://masaralaqar.com',
    siteName: 'مسار العقار',
    title: 'مسار العقار — حلول الذكاء الaصطناعي للمكاتب العقارية',
    description: 'منصة سعودية متخصصة في تقديم حلول تقنية متطورة للقطاع العقاري. نظام صقر للرد الآلي الذكي، الوساطة العقارية، والتدريب الاحترافي.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'مسار العقار — نظام صقر الذكي',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مسار العقار — حلول الذكاء الاصطناعي للمكاتب العقارية',
    description: 'منصة سعودية متخصصة في تقديم حلول تقنية متطورة للقطاع العقاري.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: 'https://masaralaqar.com',
    languages: {
      'ar': 'https://masaralaqar.com',
    },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://masaralaqar.com/#organization',
      name: 'مسار العقار',
      url: 'https://masaralaqar.com',
      logo: { '@type': 'ImageObject', url: 'https://masaralaqar.com/logo.svg' },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+966545374069',
        contactType: 'customer service',
        availableLanguage: 'Arabic',
        areaServed: 'SA',
      },
      sameAs: ['https://wa.me/966545374069'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://masaralaqar.com/#website',
      url: 'https://masaralaqar.com',
      name: 'مسار العقار',
      publisher: { '@id': 'https://masaralaqar.com/#organization' },
      inLanguage: 'ar',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <AnnouncementBar />
        <Suspense fallback={null}>
          <ReferralCookieHandler />
        </Suspense>
        {children}
        <ScrollToTop />
        <ChatWidget />
      </body>
    </html>
  )
}
