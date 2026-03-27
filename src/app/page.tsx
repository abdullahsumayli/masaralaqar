'use client'

import { motion } from 'framer-motion'
import {
  ArrowLeft, BarChart3, BookOpen, Brain, CheckCircle2, ChevronLeft,
  Clock, FileText, Megaphone, MessageSquare, Rocket, Shield, Sparkles, Star,
  Target, Users, Zap,
} from 'lucide-react'
import Link from 'next/link'
import { ScrollToHashOnMount } from '@/components/ScrollToHashOnMount'
import { Navbar } from '@/components/navbar'
import { AffiliateCTASection } from '@/components/affiliate/AffiliateCTASection'
import { KnowledgeCard } from '@/components/knowledge/KnowledgeCard'
import { ProductCard } from '@/components/product/ProductCard'
import { SectionTitle } from '@/components/brand/SectionTitle'
import { PageContainer } from '@/components/layout/PageContainer'

/* ─── Animation variants ─────────────────────────── */
const fadeUp = {
  hidden:   { opacity: 0, y: 28 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
}

/* ─── Data ───────────────────────────────────────── */
const features = [
  { icon: MessageSquare, title: 'رد آلي 24/7',     desc: 'يرد على عملاءك على واتساب فوراً دون تأخير حتى وأنت نائم', color: '#25D366' },
  { icon: Users,         title: 'إدارة العملاء CRM', desc: 'نظام ذكي يصنّف الجادّين تلقائياً ويجدول المتابعة لك',    color: '#E5B84A' },
  { icon: BarChart3,     title: 'تحليلات متقدمة',  desc: 'لوحة بيانات لحظية تُظهر أداء مبيعاتك وأفضل الفرص',       color: '#34D399' },
  { icon: Zap,           title: 'أتمتة التسويق',   desc: 'حملات تلقائية موجّهة تُرسَل في الوقت المثالي',             color: '#a78bfa' },
]

const whyUs = [
  { icon: Zap,     title: 'رد فوري دون انتظار',     desc: 'لا تخسر عميلاً بسبب تأخر الرد — MQ يعمل بدلك على مدار الساعة' },
  { icon: Target,  title: 'تصفية ذكية للعملاء',     desc: 'يُحدّد الجادّين من المستفسرين تلقائياً لتركّز على من يشتري فعلاً' },
  { icon: Brain,   title: 'ذكاء اصطناعي محلّي',    desc: 'مدرّب على السوق العقاري السعودي بلهجة وأسلوب مناسب' },
  { icon: Shield,  title: 'دعم سعودي متكامل',       desc: 'فريق دعم محلي متاح، تدريب مستمر وتحديثات مجانية' },
]

const testimonials = [
  { name: 'أحمد محمد',  role: 'مدير مكتب عقاري', company: 'مكتب الأهلي للعقار', avatar: 'أح', text: 'نظام MQ وفّر علي أكثر من 5 ساعات يومياً. الرد على العملاء بات فورياً وتصنيفهم يتم تلقائياً.', rating: 5 },
  { name: 'سارة علي',   role: 'وسيط عقاري',       company: 'سارة للعقارات',       avatar: 'سع', text: 'نسبة تحويل العميل زادت 40% في أول شهرين. أفضل استثمار قدمته لمكتبي حتى الآن.', rating: 5 },
  { name: 'خالد عمر',   role: 'مالك شركة',         company: 'شركة عمر العقارية',   avatar: 'خع', text: 'الفريق محترف جداً والدعم الفني متوفر دائماً. الخدمة تفوق كل توقعاتي.', rating: 5 },
]

/* ─── Page ───────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-text-primary overflow-x-hidden">
      <ScrollToHashOnMount />
      <Navbar />

      {/* ════════════════════════════════════════════
          HERO
          ════════════════════════════════════════════ */}
      <section className="relative min-h-[100svh] flex items-center pt-20 pb-16 px-4 overflow-hidden">

        {/* Background layers */}
        <div className="absolute inset-0 bg-background" />
        {/* Dot pattern */}
        <div className="absolute inset-0 bg-dot-pattern opacity-100" />
        {/* Gradient radial from center */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/[0.07] via-transparent to-transparent" />

        {/* Ambient orbs */}
        <div className="orb w-[700px] h-[700px] -top-40 -right-60 bg-primary/[0.06]" />
        <div className="orb w-[500px] h-[500px] -bottom-20 -left-40 bg-accent/[0.05]" />
        <div className="orb w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#a78bfa]/[0.04]" />

        <div className="relative max-w-7xl mx-auto w-full">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center text-center max-w-5xl mx-auto">

            {/* Badge — Platform identity */}
            <motion.div variants={fadeUp} className="mb-8">
              <span className="badge-blue text-xs md:text-sm">
                <Sparkles className="w-3.5 h-3.5" />
                MQ — AI tools for modern real estate teams
              </span>
            </motion.div>

            {/* Headline — MQ product entry */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.15] mb-6 tracking-tight text-balance"
            >
              لا تخسر عميل بسبب{' '}
              <span className="text-mq-green">تأخر الرد</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
              MQ يرد على عملائك ويحوّلهم إلى معاينات تلقائيًا — بواجهة واتساب مألوفة ومستوى SaaS احترافي.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link href="/auth/signup" className="btn-mq-cta text-base px-8 py-4 group">
                جرب MQ مجاناً
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/demo"
                className="btn-mq-secondary text-base px-8 py-4 inline-flex items-center justify-center gap-2"
              >
                <Rocket className="w-5 h-5 text-mq-blue shrink-0" />
                شاهد كيف يعمل
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-5 text-text-muted text-sm">
              {[
                { icon: CheckCircle2, text: 'تجربة مجانية 14 يوم' },
                { icon: CheckCircle2, text: 'بدون بطاقة ائتمان' },
                { icon: CheckCircle2, text: 'إلغاء في أي وقت' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon className="w-4 h-4 text-mq-green flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Dashboard mockup */}
          <motion.div
            id="mq-how"
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-20 max-w-4xl mx-auto scroll-mt-24"
          >
            {/* Glow behind mock */}
            <div className="absolute -inset-8 bg-gradient-radial from-[#25D366]/15 via-transparent to-transparent" />
            {/* Browser frame */}
            <div className="relative card-glass rounded-2xl overflow-hidden border border-primary/15 shadow-xl shadow-slate-900/10">
              {/* Browser chrome */}
              <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border bg-slate-100/80">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                <div className="flex-1 mx-4 h-7 bg-white/[0.06] rounded-lg flex items-center justify-center px-3 gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#34D399]" />
                  <span className="text-text-muted text-xs">dashboard.masaralaqar.com</span>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="bg-slate-50 p-6">
                {/* Header row */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-text-primary font-bold text-base">لوحة MQ الذكية</h3>
                    <p className="text-text-muted text-xs mt-0.5">الثلاثاء، ٨ مارس ٢٠٢٦</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#34D399]/10 border border-[#34D399]/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                    <span className="text-[#34D399] text-xs font-medium">متصل ونشط</span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-3 mb-5">
                  {[
                    { label: 'عملاء اليوم', val: '28', delta: '+12%', color: '#25D366', bg: 'rgba(37,211,102,0.12)' },
                    { label: 'ردود آلية',   val: '156', delta: '+8%',  color: '#34D399', bg: 'rgba(52,211,153,0.08)' },
                    { label: 'صفقات مفتوحة', val: '14',  delta: '+3%',  color: '#E5B84A', bg: 'rgba(229,184,74,0.08)' },
                    { label: 'معدل التحويل', val: '32%', delta: '+5%',  color: '#a78bfa', bg: 'rgba(167,139,250,0.08)' },
                  ].map((s, i) => (
                    <div key={i} className="rounded-xl p-3 border border-border" style={{ background: s.bg }}>
                      <div className="text-xl font-black mb-0.5" style={{ color: s.color }}>{s.val}</div>
                      <div className="text-text-muted text-[10px]">{s.label}</div>
                      <div className="text-[#34D399] text-[10px] font-semibold mt-1">{s.delta}</div>
                    </div>
                  ))}
                </div>

                {/* Activity feed */}
                <div className="space-y-2">
                  {[
                    { text: 'رد تلقائي على أحمد محمد — طلب معاينة شقة في الرياض', time: 'الآن',     dot: '#34D399' },
                    { text: 'عميل جديد — سارة علي تسأل عن فيلا في جدة',          time: 'منذ 3 د', dot: '#25D366' },
                    { text: 'تذكير: موعد معاينة مع خالد عمر — غداً الساعة 4م',  time: 'منذ 8 د', dot: '#E5B84A' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-border">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.dot, boxShadow: `0 0 8px ${item.dot}` }} />
                      <span className="text-text-secondary text-xs flex-1">{item.text}</span>
                      <span className="text-text-muted text-[10px] flex-shrink-0">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FEATURES
          ════════════════════════════════════════════ */}
      <section className="section-padding px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger} className="text-center mb-16">
            <motion.div variants={fadeUp} className="mb-4">
              <span className="badge-gold">المميزات الرئيسية</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
              كل ما تحتاجه في{' '}
              <span className="gradient-text-blue">منصة واحدة</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-text-secondary text-lg max-w-2xl mx-auto">
              صُمّمت كل ميزة لتوفير وقتك وزيادة إيراداتك في السوق العقاري السعودي
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} className="card p-7 group cursor-default">
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}
                >
                  <f.icon className="w-7 h-7" style={{ color: f.color }} />
                </div>

                {/* Glow dot */}
                <div className="w-1.5 h-1.5 rounded-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: f.color, boxShadow: `0 0 10px ${f.color}` }} />

                <h3 className="text-text-primary font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          WHY US
          ════════════════════════════════════════════ */}
      <section className="section-padding px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-200/40" />
        <div className="absolute inset-0 bg-grid-pattern opacity-100" />
        {/* Border lines */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#25D366]/20 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#25D366]/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: text */}
            <motion.div variants={fadeUp}>
              <span className="badge-blue mb-6">لماذا MQ؟</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-5 leading-tight">
                مميزات لن تجدها{' '}
                <span className="gradient-text-gold">في مكان آخر</span>
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-8">
                صُمّم نظام MQ خصيصاً للسوق العقاري السعودي، بفهم عميق للتحديات اليومية التي يواجهها الوسطاء العقاريون.
              </p>
              <Link href="/products/saqr" className="btn-primary inline-flex">
                اكتشف نظام MQ
                <ArrowLeft className="w-4.5 h-4.5" />
              </Link>
            </motion.div>

            {/* Right: feature cards */}
            <motion.div variants={stagger} className="grid sm:grid-cols-2 gap-4">
              {whyUs.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="card p-6 group cursor-default"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#25D366]/10 border border-[#25D366]/15 flex items-center justify-center mb-4 group-hover:border-[#25D366]/30 transition-colors">
                    <item.icon className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <h4 className="font-bold text-text-primary mb-2 text-sm">{item.title}</h4>
                  <p className="text-text-muted text-xs leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          PRODUCTS SECTION — highlight Saqr + link to /products
          ════════════════════════════════════════════ */}
      <section className="section-padding px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-surface/40" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.div variants={fadeUp} className="mb-4">
              <span className="badge-blue">المنتجات</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black mb-4">
              حلول <span className="gradient-text-blue">MQ</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">
              أدوات مصممة لرفع كفاءة المكاتب العقارية
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/products/saqr" className="card p-6 flex items-center gap-4 max-w-md mx-auto group cursor-pointer hover:border-primary/30 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/25 flex items-center justify-center">
                  <MessageSquare className="w-7 h-7 text-[#25D366]" />
                </div>
                <div className="text-right">
                  <h3 className="text-text-primary font-bold text-lg mb-1">MQ</h3>
                  <p className="text-text-muted text-sm">رد آلي ذكي عبر واتساب — تجربة مجانية 14 يوم</p>
                </div>
                <ArrowLeft className="w-5 h-5 text-primary mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link href="/products" className="text-primary font-medium text-sm hover:underline">
                عرض كل المنتجات ←
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          TOOLS INSIDE THE PLATFORM
          ════════════════════════════════════════════ */}
      <section className="section-padding px-4 relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 bg-surface/30" />
        <PageContainer className="relative">
          <SectionTitle
            label="المنصة"
            title="أدوات ضمن منصة MQ"
            description="منتجنا الحالي وأدوات قادمة ضمن نفس المنصة."
            align="center"
          />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto"
          >
            <motion.div variants={fadeUp}>
              <Link
                href="/products/saqr"
                className="card p-6 flex items-center gap-4 group cursor-pointer hover:border-primary/30 transition-colors block"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center">
                  <MessageSquare className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="text-text-primary font-bold text-lg mb-1">MQ</h3>
                  <p className="text-text-secondary text-sm mb-2">أتمتة واتساب بالذكاء الاصطناعي للعقار</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#34D399]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                    متاح الآن
                  </span>
                </div>
                <ArrowLeft className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </Link>
            </motion.div>
            <motion.div variants={fadeUp}>
              <div className="card p-6 flex items-center gap-4 opacity-80 cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-border flex items-center justify-center">
                  <Rocket className="w-7 h-7 text-text-secondary" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="text-text-primary font-bold text-lg mb-1">أدوات قادمة</h3>
                  <p className="text-text-secondary text-sm mb-2">CRM، أتمتة تسويق، تحليلات — قريباً</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B7280]">
                    قريباً
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </PageContainer>
      </section>

      {/* ════════════════════════════════════════════
          KNOWLEDGE SECTION — Blog + Library
          ════════════════════════════════════════════ */}
      <section className="section-padding px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-200/30" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.div variants={fadeUp} className="mb-4">
              <span className="badge-gold">المعرفة</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black mb-4">
              مدونة <span className="gradient-text-gold">ومكتبة</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-text-secondary text-lg max-w-2xl mx-auto mb-4">
              مقالات، أدلة وموارد لمساعدتك في تطوير عملك العقاري
            </motion.p>
            <motion.p variants={fadeUp} className="text-[#E5B84A]/80 text-sm mb-10">
              نعمل على إضافة محتوى جديد قريباً — تابعنا!
            </motion.p>
            <motion.div variants={stagger} className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <motion.div variants={fadeUp}>
                <KnowledgeCard
                  title="المدونة"
                  description="مقالات متخصصة في العقار، الأتمتة والذكاء الاصطناعي."
                  href="/knowledge/blog"
                  icon={FileText}
                />
              </motion.div>
              <motion.div variants={fadeUp}>
                <KnowledgeCard
                  title="المكتبة"
                  description="كتب إلكترونية، أدلة ونماذج للوسيط العقاري."
                  href="/knowledge/library"
                  icon={BookOpen}
                />
              </motion.div>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-6">
              <Link href="/knowledge" className="text-primary font-medium text-sm hover:underline">
                مركز المعرفة ←
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          AFFILIATE SECTION
          ════════════════════════════════════════════ */}
      <section className="section-padding px-4">
        <div className="max-w-4xl mx-auto">
          <AffiliateCTASection />
        </div>
      </section>

      {/* ════════════════════════════════════════════
          PRODUCT SHOWCASE (Saqr detail)
          ════════════════════════════════════════════ */}
      <section className="section-padding px-4 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-background to-slate-100" />
          <div className="absolute inset-0 bg-dot-pattern opacity-60" />
          {/* Blue radial */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#25D366]/[0.08] rounded-full blur-3xl" />
        </div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#25D366]/30 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E5B84A]/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.div variants={fadeUp} className="mb-4">
              <span className="badge-gold">
                <Rocket className="w-3.5 h-3.5" />
                منتجنا الرئيسي
              </span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
              نظام <span className="gradient-text-blue">MQ</span> لإدارة العمل العقاري
            </motion.h2>
            <motion.p variants={fadeUp} className="text-text-secondary text-lg max-w-2xl mx-auto">
              منصة متكاملة مدعومة بالذكاء الاصطناعي تحوّل مكتبك إلى آلة مبيعات ذكية تعمل دون توقف
            </motion.p>
          </motion.div>

          {/* Product cards — Saqr + placeholders */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <motion.div variants={fadeUp}>
              <ProductCard
                title="MQ"
                description="أتمتة واتساب بالذكاء الاصطناعي — رد فوري وتصنيف العملاء"
                href="/products/saqr"
                icon={MessageSquare}
                available
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <ProductCard
                title="CRM"
                description="إدارة العملاء والعقارات والمتابعة الذكية"
                href="/products"
                icon={Users}
                available={false}
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <ProductCard
                title="أتمتة التسويق"
                description="حملات تلقائية وإعلانات موجّهة"
                href="/products"
                icon={Megaphone}
                available={false}
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <ProductCard
                title="تحليلات السوق"
                description="رؤى السوق والأداء والاتجاهات"
                href="/products"
                icon={BarChart3}
                available={false}
              />
            </motion.div>
          </motion.div>

          {/* Feature grid — 3 cols */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {[
              { icon: MessageSquare, title: 'واتساب ذكي',       desc: 'ربط مباشر مع واتساب — ردود آلية، تصنيف تلقائي، جدولة ذكية',     color: '#25D366' },
              { icon: BarChart3,     title: 'تقارير لحظية',     desc: 'لوحة بيانات تفاعلية توضح أداءك وأفضل المصادر وأعلى الفرص',      color: '#25D366' },
              { icon: Users,         title: 'CRM متكامل',       desc: 'إدارة كاملة للعملاء مع تاريخ التواصل وإمكانية المتابعة الذكية', color: '#E5B84A' },
              { icon: Zap,           title: 'أتمتة الحملات',   desc: 'أرسل رسائل متخصصة للعملاء المناسبين في الوقت المناسب تلقائياً', color: '#a78bfa' },
              { icon: Brain,         title: 'ذكاء اصطناعي',    desc: 'يفهم طلبات العملاء ويقترح العقارات المناسبة من قائمتك فوراً',    color: '#34D399' },
              { icon: Shield,        title: 'أمان وموثوقية',   desc: 'تشفير كامل للبيانات، نسخ احتياطي تلقائي، uptime 99.9%',        color: '#FB923C' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="card p-6 group cursor-default">
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${item.color}15`, border: `1px solid ${item.color}20` }}
                  >
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <h4 className="text-text-primary font-bold mb-1.5">{item.title}</h4>
                    <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Row */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup" className="btn-gold text-base px-8 py-4">
              ابدأ تجربتك المجانية
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link href="/products/saqr#pricing" className="btn-outline text-base px-8 py-4">
              عرض الأسعار
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          TESTIMONIALS
          ════════════════════════════════════════════ */}
      <section className="section-padding px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.div variants={fadeUp} className="mb-4">
              <span className="badge-blue">آراء عملائنا</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
              ماذا يقول{' '}
              <span className="gradient-text-gold">عملاؤنا؟</span>
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="card p-7 flex flex-col"
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-[#E5B84A] fill-[#E5B84A]" />
                  ))}
                </div>

                <blockquote className="text-text-secondary leading-relaxed mb-6 text-sm flex-1">
                  &ldquo;{t.text}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-border">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#25D366]/20 to-[#25D366]/5 border border-[#25D366]/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#25D366] font-bold text-sm">{t.avatar}</span>
                  </div>
                  <div>
                    <div className="text-text-primary font-bold text-sm">{t.name}</div>
                    <div className="text-text-muted text-xs">{t.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CTA SECTION
          ════════════════════════════════════════════ */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-background to-slate-200/80" />
        <div className="absolute inset-0 bg-dot-pattern opacity-60" />
        {/* Glowing orbs */}
        <div className="orb w-[500px] h-[500px] -top-32 right-1/4 bg-[#25D366]/[0.1]" />
        <div className="orb w-[400px] h-[400px] -bottom-24 left-1/4 bg-[#E5B84A]/[0.08]" />
        {/* Border lines */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#25D366]/40 to-transparent" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>

            <motion.div variants={fadeUp} className="mb-6">
              <span className="badge-blue">
                <Clock className="w-3.5 h-3.5" />
                العرض محدود
              </span>
            </motion.div>

            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-black mb-5 leading-tight">
              ابدأ{' '}
              <span className="gradient-text-blue">تحوّلك الرقمي</span>
              {' '}اليوم
            </motion.h2>

            <motion.p variants={fadeUp} className="text-text-secondary text-lg mb-10 max-w-xl mx-auto">
              جرّب نظام MQ مجاناً لمدة 14 يوم — بدون بطاقة ائتمان، إعداد في دقائق.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/966545374069"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold text-base px-8 py-4"
              >
                <MessageSquare className="w-5 h-5" />
                تواصل عبر واتساب
              </a>
              <Link href="/auth/signup" className="btn-primary text-base px-8 py-4">
                جرب MQ مجاناً
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Assurance row */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-6 mt-8 text-text-muted text-xs">
              {['لا حاجة لبطاقة ائتمان', 'إعداد في أقل من 5 دقائق', 'دعم سعودي على مدار الساعة'].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                  {t}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
