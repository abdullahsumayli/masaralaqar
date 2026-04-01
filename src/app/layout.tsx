import type { Metadata, Viewport } from 'next'
import {
  Cairo,
  IBM_Plex_Sans,
  IBM_Plex_Sans_Arabic,
  JetBrains_Mono,
  Sora,
} from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { ReferralCookieHandler } from '@/components/affiliate/ReferralCookieHandler'
import { ScrollToTop } from '@/components/ScrollToTop'
import { AppBranding } from '@/components/AppBranding'
import { WhatsAppButton } from '@/components/WhatsAppButton'

const fontCairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
})

const fontIbmArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-arabic',
  display: 'swap',
})

const fontIbm = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm',
  display: 'swap',
})

const fontSora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
})

const fontJetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const fontVariables = [
  fontCairo.variable,
  fontIbmArabic.variable,
  fontIbm.variable,
  fontSora.variable,
  fontJetbrains.variable,
].join(' ')

export const viewport: Viewport = {
  themeColor: '#F1F5F9',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: {
    default: 'MQ — حلول الذكاء الاصطناعي للمكاتب العقارية',
    template: '%s | MQ',
  },
  description: 'منصة سعودية متخصصة في تقديم حلول تقنية متطورة للقطاع العقاري. نظام MQ للرد الآلي الذكي، الوساطة العقارية، والتدريب الاحترافي.',
  keywords: ['MQ','نظام MQ','واتساب عقاري','رد آلي عقار','ذكاء اصطناعي عقاري','وسيط عقاري','تدريب عقاري','أكاديمية عقارية','سوق العقار السعودي'],
  authors: [{ name: 'MQ' }],
  creator: 'MQ',
  publisher: 'MQ',
  metadataBase: new URL('https://masaralaqar.com'),
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: 'en_US',
    url: 'https://masaralaqar.com',
    siteName: 'MQ',
    title: 'MQ — حلول الذكاء الاصطناعي للمكاتب العقارية',
    description: 'منصة سعودية متخصصة في تقديم حلول تقنية متطورة للقطاع العقاري. نظام MQ للرد الآلي الذكي، الوساطة العقارية، والتدريب الاحترافي.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MQ — نظام MQ الذكي',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MQ — حلول الذكاء الاصطناعي للمكاتب العقارية',
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
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
    apple: '/logo.svg',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://masaralaqar.com/#organization',
      name: 'MQ',
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
      name: 'MQ',
      publisher: { '@id': 'https://masaralaqar.com/#organization' },
      inLanguage: 'ar',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`dark ${fontVariables}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <AppBranding />
        <Suspense fallback={null}>
          <ReferralCookieHandler />
        </Suspense>
        {children}
        <ScrollToTop />
        <WhatsAppButton />
      </body>
    </html>
  )
}
