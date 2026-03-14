import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-primary/20 mb-4 font-cairo">404</div>
        <h1 className="text-2xl font-bold text-text-primary mb-3 font-cairo">
          الصفحة غير موجودة
        </h1>
        <p className="text-text-secondary mb-8">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها. تأكد من صحة الرابط.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
          >
            <Home className="w-5 h-5" />
            الصفحة الرئيسية
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-border text-text-secondary rounded-xl font-medium hover:border-primary hover:text-primary transition-colors"
          >
            تواصل معنا
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
