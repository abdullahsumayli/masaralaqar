'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, Clock, TrendingUp, Zap, GraduationCap, Target, MessageCircle } from 'lucide-react'
import { Hero } from '@/components/hero'
import { ProductCard } from '@/components/product-card'
import { BlogCard } from '@/components/blog-card'
import { CTASection } from '@/components/cta-section'

const stats = [
  { number: '+20', label: 'مكتب عقاري', icon: Users },
  { number: '24/7', label: 'نظام يعمل', icon: Clock },
  { number: '3x', label: 'مضاعفة التحويلات', icon: TrendingUp },
  { number: '-60%', label: 'تقليل الجهد', icon: Zap },
]

const products = [
  {
    icon: '🦅',
    title: 'نظام صقر',
    description: 'نظام الرد الآلي الذكي للمكاتب العقارية. يرد على العملاء فوراً ويُصفّي الجادين ويُجدول المعاينات تلقائياً.',
    features: ['رد فوري 24/7', 'تصفية العملاء الجادين', 'جدولة المعاينات تلقائياً', 'تقارير وتحليلات'],
    href: '/products/saqr',
  },
  {
    icon: '🎯',
    title: 'منصة إغلاق',
    description: 'أتمتة متابعة العملاء وإغلاق الصفقات. نظام متكامل لإدارة دورة البيع العقاري من البداية للنهاية.',
    features: ['متابعة تلقائية', 'تذكيرات ذكية', 'إدارة العملاء المحتملين', 'تتبع الصفقات'],
    href: '/products/eghlaq',
  },
]

const blogPosts = [
  {
    slug: 'losing-clients-due-to-late-response',
    title: 'كيف يخسر مكتبك العقاري 60% من عملائه بسبب التأخر في الرد',
    excerpt: 'دراسة تكشف أن 60% من العملاء المحتملين يتحولون للمنافسين خلال ساعة واحدة من عدم الرد. تعرف على الحل.',
    category: 'استراتيجية',
    date: '10 فبراير 2026',
    readingTime: 5,
  },
  {
    slug: 'complete-automation-guide-2026',
    title: 'دليل الأتمتة الكامل للمكاتب العقارية السعودية 2026',
    excerpt: 'كل ما تحتاج معرفته عن أتمتة مكتبك العقاري: من الأدوات إلى الاستراتيجيات والنتائج المتوقعة.',
    category: 'أتمتة',
    date: '5 فبراير 2026',
    readingTime: 8,
  },
  {
    slug: 'ai-in-real-estate-filtering',
    title: 'كيف يعمل الذكاء الاصطناعي في تصفية عملاء العقار',
    excerpt: 'شرح مبسط لكيفية استخدام AI في فرز العملاء الجادين من المتصفحين وتوفير وقتك الثمين.',
    category: 'ذكاء اصطناعي',
    date: '1 فبراير 2026',
    readingTime: 6,
  },
]

const academyServices = [
  { icon: MessageCircle, label: 'استشارات فردية' },
  { icon: Users, label: 'ورش عمل' },
  { icon: Target, label: 'تدريب مكاتب' },
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-surface/50 border-y border-border">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 mb-4">
                  <stat.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-cairo font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-text-secondary text-sm md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-cairo font-bold text-text-primary mb-4">
              منتجاتنا التقنية
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              حلول ذكية مصممة خصيصاً للمكاتب العقارية السعودية
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product.title} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="section-padding bg-surface/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-cairo font-bold text-text-primary mb-4">
                أحدث المقالات
              </h2>
              <p className="text-text-secondary text-lg">
                رؤى واستراتيجيات في التقنية العقارية
              </p>
            </div>
            <Link
              href="/blog"
              className="btn-outline inline-flex items-center gap-2 self-start md:self-auto"
            >
              عرض جميع المقالات
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>
        </div>
      </section>

      {/* Academy Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-medium">التعلم والتدريب</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-cairo font-bold text-text-primary mb-4">
                أكاديمية مسار العقار
              </h2>

              <p className="text-text-secondary text-lg mb-8">
                التدريب الشخصي والاستشارات المتخصصة لتحويل مكتبك العقاري رقمياً.
                نساعدك على فهم وتطبيق أحدث التقنيات في السوق العقاري.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                {academyServices.map((service) => (
                  <div
                    key={service.label}
                    className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg"
                  >
                    <service.icon className="w-5 h-5 text-primary" />
                    <span className="text-text-secondary text-sm">{service.label}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/academy"
                className="btn-primary inline-flex items-center gap-2"
              >
                احجز استشارتك
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square max-w-md mx-auto rounded-3xl bg-surface border border-border p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎓</div>
                  <p className="text-2xl font-cairo font-bold text-text-primary mb-2">
                    العقار علم
                  </p>
                  <p className="text-primary font-semibold">
                    والأتمتة استدامة
                  </p>
                </div>
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="جاهز لتحويل مكتبك رقمياً؟"
        description="ابدأ اليوم وشاهد الفرق في أدائك خلال أسبوع واحد فقط"
        buttonText="ابدأ الآن"
        buttonHref="/contact"
        variant="glow"
      />
    </>
  )
}
