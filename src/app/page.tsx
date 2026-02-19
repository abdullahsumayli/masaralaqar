'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Building2,
  Brain,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  CheckCircle,
  MessageSquare,
  BarChart3,
  Zap,
  Users,
  Rocket,
} from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
}

export default function HomePage() {
  const services = [
    {
      icon: Brain,
      title: 'حلول الذكاء الاصطناعي والأتمتة',
      description: 'أتمتة الردود، روبوتات تسويق ذكية، تحليل بيانات السوق العقاري وربط الأنظمة.',
      href: '/services#ai',
    },
    {
      icon: Building2,
      title: 'الوساطة العقارية',
      description: 'بيع وشراء العقارات، تأجير العقارات، واستشارات عقارية متخصصة.',
      href: '/services#brokerage',
    },
    {
      icon: GraduationCap,
      title: 'التدريب والاستشارات',
      description: 'تدريب الوسطاء العقاريين، ورش عمل للشركات، واستشارات في التحول الرقمي.',
      href: '/services#training',
    },
  ]

  const saqrFeatures = [
    { icon: MessageSquare, text: 'رد آلي ذكي 24/7' },
    { icon: Users, text: 'إدارة علاقات العملاء' },
    { icon: BarChart3, text: 'تقارير وتحليلات' },
    { icon: Zap, text: 'أتمتة التسويق' },
  ]

  const latestArticles = [
    {
      title: 'كيف يغير الذكاء الاصطناعي قطاع العقارات؟',
      excerpt: 'نظرة شاملة على تأثير التقنيات الحديثة في سوق العقار السعودي.',
      category: 'ذكاء اصطناعي',
      date: '15 فبراير 2026',
      slug: 'ai-in-real-estate',
    },
    {
      title: 'أفضل استراتيجيات التسويق العقاري',
      excerpt: 'تعرف على أحدث طرق التسويق العقاري الفعالة في السوق السعودي.',
      category: 'تسويق',
      date: '12 فبراير 2026',
      slug: 'real-estate-marketing',
    },
    {
      title: 'دليل الوسيط العقاري المبتدئ',
      excerpt: 'كل ما تحتاج معرفته لبدء مسيرتك في الوساطة العقارية.',
      category: 'نصائح للوسطاء',
      date: '10 فبراير 2026',
      slug: 'beginner-broker-guide',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-primary font-bold text-xl block leading-tight">مسار العقار</span>
              <span className="text-text-secondary text-xs">Masar Al-Aqar</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-primary font-medium">الرئيسية</Link>
            <Link href="/blog" className="text-text-secondary hover:text-primary transition-colors">المدونة</Link>
            <Link href="/library" className="text-text-secondary hover:text-primary transition-colors">المكتبة</Link>
            <Link href="/academy" className="text-text-secondary hover:text-primary transition-colors">الأكاديمية</Link>
            <Link href="/services" className="text-text-secondary hover:text-primary transition-colors">الخدمات</Link>
            <Link href="/contact" className="text-text-secondary hover:text-primary transition-colors">تواصل معنا</Link>
          </nav>

          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-white rounded-lg font-medium hover:bg-secondary-dark transition-colors"
          >
            <Phone className="w-4 h-4" />
            تواصل معنا
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold leading-tight mb-6"
            >
              مسارك نحو
              <span className="text-primary"> احتراف العقار</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-text-secondary mb-10 max-w-3xl mx-auto"
            >
              منصة متكاملة تجمع بين التقنية والعقار لتقديم حلول الذكاء الاصطناعي والأتمتة
              للمسوقين العقاريين وشركات العقار في السعودية
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary-dark transition-colors"
              >
                استكشف خدماتنا
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary text-lg font-bold rounded-xl hover:bg-primary hover:text-white transition-colors"
              >
                تواصل معنا
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
                من نحن
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                نجمع بين <span className="text-primary">التقنية</span> و<span className="text-secondary">العقار</span>
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                مسار العقار منصة سعودية متخصصة في تقديم حلول تقنية متطورة للقطاع العقاري.
                نؤمن بأن مستقبل العقار يكمن في دمج الذكاء الاصطناعي مع الخبرة العقارية
                لتمكين الوسطاء والشركات من تحقيق نتائج استثنائية.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                  <span className="text-text-secondary">خبرة عقارية</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                  <span className="text-text-secondary">تقنية متطورة</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                  <span className="text-text-secondary">دعم مستمر</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                  <span className="text-text-secondary">حلول مخصصة</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="relative">
              <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-4xl font-bold mb-2">500+</div>
                    <div className="text-white/80">عميل سعيد</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">50+</div>
                    <div className="text-white/80">دورة تدريبية</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">1000+</div>
                    <div className="text-white/80">صفقة ناجحة</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">5</div>
                    <div className="text-white/80">سنوات خبرة</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.span variants={fadeInUp} className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              خدماتنا
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
              حلول متكاملة للقطاع العقاري
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-text-secondary text-lg max-w-2xl mx-auto">
              نقدم مجموعة شاملة من الخدمات المصممة لتلبية احتياجات السوق العقاري السعودي
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white border border-border rounded-2xl p-8 hover:shadow-xl transition-shadow group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-text-secondary mb-6">{service.description}</p>
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                >
                  اعرف المزيد
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Saqr System Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-4">
                منتجنا الرئيسي
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                نظام صقر - إدارة عقارية ذكية
              </h2>
              <p className="text-white/90 text-lg leading-relaxed mb-8">
                نظام متكامل لإدارة العقارات والعملاء مدعوم بالذكاء الاصطناعي.
                يساعدك في أتمتة الردود، إدارة العملاء، وتحليل أداء مبيعاتك.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {saqrFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-secondary" />
                    </div>
                    <span className="text-white/90">{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products/saqr"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-white font-bold rounded-xl hover:bg-secondary-dark transition-colors"
                >
                  جرب صقر مجاناً
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <Link
                  href="/products/saqr"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white/50 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                >
                  شاهد العرض
                </Link>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="bg-white rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <Rocket className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-text-primary">نظام صقر</div>
                      <div className="text-sm text-text-secondary">إدارة ذكية</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-100 rounded-full w-full"></div>
                    <div className="h-3 bg-gray-100 rounded-full w-3/4"></div>
                    <div className="h-3 bg-secondary/30 rounded-full w-1/2"></div>
                  </div>
                </div>
                <div className="text-center text-white/80 text-sm">
                  لوحة تحكم ذكية لإدارة عملك العقاري
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row items-center justify-between mb-12"
          >
            <div>
              <motion.span variants={fadeInUp} className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
                المدونة
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold">
                آخر المقالات
              </motion.h2>
            </div>
            <motion.div variants={fadeInUp}>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
              >
                عرض جميع المقالات
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {latestArticles.map((article, index) => (
              <motion.article
                key={index}
                variants={fadeInUp}
                className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                      {article.category}
                    </span>
                    <span className="text-text-muted text-sm">{article.date}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4">{article.excerpt}</p>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all"
                  >
                    اقرأ المزيد
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
              ابدأ مسارك الآن
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-text-secondary text-lg mb-8">
              تواصل معنا اليوم واكتشف كيف يمكننا مساعدتك في تحقيق أهدافك العقارية
            </motion.p>
            <motion.div variants={fadeInUp}>
              <a
                href="https://wa.me/966501234567"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white text-lg font-bold rounded-xl hover:bg-[#128C7E] transition-colors"
              >
                <MessageSquare className="w-6 h-6" />
                تواصل عبر واتساب
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-primary text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-lg">مسار العقار</span>
              </div>
              <p className="text-white/80 text-sm">
                منصة متكاملة تجمع بين التقنية والعقار لخدمة السوق السعودي.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-white/80">
                <li><Link href="/blog" className="hover:text-white transition-colors">المدونة</Link></li>
                <li><Link href="/library" className="hover:text-white transition-colors">المكتبة</Link></li>
                <li><Link href="/academy" className="hover:text-white transition-colors">الأكاديمية</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">الخدمات</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">خدماتنا</h4>
              <ul className="space-y-2 text-white/80">
                <li><Link href="/services#ai" className="hover:text-white transition-colors">حلول الذكاء الاصطناعي</Link></li>
                <li><Link href="/services#brokerage" className="hover:text-white transition-colors">الوساطة العقارية</Link></li>
                <li><Link href="/services#training" className="hover:text-white transition-colors">التدريب والاستشارات</Link></li>
                <li><Link href="/products/saqr" className="hover:text-white transition-colors">نظام صقر</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">تواصل معنا</h4>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span dir="ltr">+966 50 123 4567</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@masaralaqar.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>جدة، المملكة العربية السعودية</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm">
              © 2026 مسار العقار. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
