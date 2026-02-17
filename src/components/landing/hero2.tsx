'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, Zap, Shield, Smartphone, Box, LayoutGrid } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32 bg-background">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            الذكاء الاصطناعي للمكاتب العقارية
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
            حوّل مكتبك العقاري إلى <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-yellow-400">
              نظام ذكي يعمل 24/7
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            استقبل الطلبات، رد على العملاء، وجدول المعاينات تلقائياً. 
            <br className="hidden md:block" />
            نظام متكامل يضمن لك عدم ضياع أي عميل محتمل.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/demo"
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] flex items-center justify-center gap-2"
            >
              ابدأ التجربة المجانية
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </Link>
            
            <Link 
              href="/products"
              className="w-full sm:w-auto px-8 py-4 bg-surface hover:bg-border text-text-primary font-medium rounded-xl border border-border transition-all flex items-center justify-center gap-2"
            >
              تعرف على المنتجات
              <LayoutGrid className="w-5 h-5 opacity-60" />
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-text-muted">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>تجربة مجانية 14 يوم</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>لا يتطلب بطاقة ائتمان</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>دعم فني فوري</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Live Dashboard Preview */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mt-20 px-4 container mx-auto"
      >
        <div className="relative rounded-2xl border border-border bg-surface/80 backdrop-blur-xl p-3 shadow-2xl mx-auto max-w-5xl overflow-hidden">
          {/* Window Header */}
          <div className="flex items-center gap-2 mb-3 px-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div className="flex-1 text-center text-xs text-text-muted font-mono">لوحة تحكم نظام صقر</div>
          </div>
          
          <div className="rounded-xl overflow-hidden bg-background border border-border/50 p-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-surface border border-border rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-primary mb-1">156</div>
                <div className="text-xs text-text-muted">عميل جديد اليوم</div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-green-500 mb-1">23</div>
                <div className="text-xs text-text-muted">معاينة مجدولة</div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-blue-500 mb-1">89%</div>
                <div className="text-xs text-text-muted">معدل الرد</div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-yellow-500 mb-1">12</div>
                <div className="text-xs text-text-muted">صفقة قيد الإغلاق</div>
              </div>
            </div>
            
            {/* Chat Preview */}
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">ع</div>
                <div>
                  <div className="font-bold text-sm">عبدالله المحمد</div>
                  <div className="text-xs text-green-500">متصل الآن</div>
                </div>
                <div className="mr-auto px-3 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">عميل جاد</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="bg-border/30 rounded-2xl rounded-br-sm px-4 py-2 max-w-[70%]">
                    <p className="text-sm">السلام عليكم، أبحث عن شقة في حي الملقا</p>
                    <span className="text-[10px] text-text-muted">10:30 ص</span>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-primary/20 rounded-2xl rounded-bl-sm px-4 py-2 max-w-[70%]">
                    <p className="text-sm">وعليكم السلام! لدينا عدة خيارات رائعة. ما المساحة المطلوبة؟</p>
                    <span className="text-[10px] text-text-muted">10:30 ص • رد تلقائي</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
