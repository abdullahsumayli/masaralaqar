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

      {/* Dashboard Preview Mockup */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mt-20 px-4 container mx-auto"
      >
        <div className="relative rounded-2xl border border-border bg-surface/50 backdrop-blur-xl p-2 shadow-2xl mx-auto max-w-5xl overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          <div className="rounded-xl overflow-hidden bg-background border border-border/50 aspect-[16/9] relative flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-br from-surface to-background flex flex-col items-center justify-center text-text-secondary/20">
                <LayoutGrid className="w-24 h-24 mb-4 opacity-10" />
                <p className="font-mono text-sm opacity-50">DASHBOARD PREVIEW</p>
             </div>
             {/* Mock UI Elements */}
             <div className="absolute top-4 left-4 right-4 flex gap-4">
                <div className="w-64 h-[400px] bg-surface border border-border rounded-lg p-4 space-y-4">
                  <div className="w-full h-8 bg-border/20 rounded-md" />
                  <div className="space-y-2">
                    <div className="w-[80%] h-4 bg-border/20 rounded-sm" />
                    <div className="w-[60%] h-4 bg-border/20 rounded-sm" />
                  </div>
                </div>
                <div className="flex-1 h-[400px] bg-surface border border-border rounded-lg p-6 space-y-6">
                   <div className="flex justify-between items-center">
                     <div className="w-32 h-8 bg-border/20 rounded-md" />
                     <div className="w-24 h-8 bg-primary/20 rounded-full" />
                   </div>
                   <div className="grid grid-cols-3 gap-4">
                      <div className="h-32 bg-border/10 rounded-lg border border-border/30" />
                      <div className="h-32 bg-border/10 rounded-lg border border-border/30" />
                      <div className="h-32 bg-border/10 rounded-lg border border-border/30" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
