import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'نظام صقر — الرد الآلي الذكي للمكاتب العقارية',
    template: '%s | نظام صقر',
  },
  description: 'يرد على عملاءك فوراً على واتساب، يصفي الجادين، ويجدول المعاينات - أنت نايم. تجربة مجانية 14 يوم.',
  keywords: ['نظام صقر','واتساب عقاري','رد آلي عقار','ذكاء اصطناعي عقاري','وسيط عقاري سعودي','أتمتة عقارية'],
  authors: [{ name: 'مسار العقار' }],
  creator: 'مسار العقار',
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://masaralaqar.com',
    siteName: 'نظام صقر',
    title: 'نظام صقر — ما تخسر عميل بسبب رد متأخر',
    description: 'يرد على عملاءك فوراً على واتساب، يصفي الجادين، ويجدول المعاينات - أنت نايم.',
  },
  robots: { index: true, follow: true },
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
