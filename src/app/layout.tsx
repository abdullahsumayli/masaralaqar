import type { Metadata } from 'next'
import './globals.css'

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
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: 'en_US',
    url: 'https://masaralaqar.com',
    siteName: 'مسار العقار',
    title: 'مسار العقار — حلول الذكاء الاصطناعي للمكاتب العقارية',
    description: 'منصة سعودية متخصصة في تقديم حلول تقنية متطورة للقطاع العقاري. نظام صقر للرد الآلي الذكي، الوساطة العقارية، والتدريب الاحترافي.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'مسار العقار',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مسار العقار — حلول الذكاء الاصطناعي للمكاتب العقارية',
    description: 'منصة سعودية متخصصة في تقديم حلول تقنية متطورة للقطاع العقاري.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
  alternates: {
    languages: {
      'ar': 'https://masaralaqar.com',
      'en': 'https://masaralaqar.com/en',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  )
}
