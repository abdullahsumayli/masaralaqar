'use client'

import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 -z-10" />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center bg-surface border border-border rounded-3xl p-12 md:p-20 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
          
          <h2 className="text-4xl md:text-5xl font-black mb-8">
            جاهز لمضاعفة مبيعاتك العقارية؟
          </h2>
          <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
            انضم لأكثر من 500 مكتب عقاري يستخدمون تقنياتنا اليوم. ابدأ فترتك التجريبية المجانية وبدون أي التزام.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2"
            >
              ابدأ الآن مجاناً
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </Link>
            <Link 
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-border hover:bg-surface text-text-primary font-bold rounded-xl transition-all"
            >
              تحدث مع المبيعات
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
