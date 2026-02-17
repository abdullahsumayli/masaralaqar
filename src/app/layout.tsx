import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: {
    default: 'مسار العقار — تقنيات ذكاء اصطناعي للمكاتب العقارية',
    template: '%s | مسار العقار',
  },
  description: 'حوّل مكتبك العقاري إلى نظام ذكي يعمل 24/7. أتمتة الردود، إدارة العملاء، وإغلاق الصفقات بالذكاء الاصطناعي.',
  keywords: ['عقار', 'ذكاء اصطناعي', 'أتمتة', 'مكاتب عقارية', 'سعودي', 'نظام صقر', 'منصة إغلاق'],
  authors: [{ name: 'مسار العقار' }],
  creator: 'مسار العقار',
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://masaralaqar.com',
    siteName: 'مسار العقار',
    title: 'مسار العقار — تقنيات ذكاء اصطناعي للمكاتب العقارية',
    description: 'حوّل مكتبك العقاري إلى نظام ذكي يعمل 24/7. أتمتة الردود، إدارة العملاء، وإغلاق الصفقات بالذكاء الاصطناعي.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مسار العقار',
    description: 'تقنيات ذكاء اصطناعي للمكاتب العقارية',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
