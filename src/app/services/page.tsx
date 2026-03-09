"use client";

import { motion } from "framer-motion";
import {
    ArrowLeft,
    BarChart3,
    Bot,
    Building2,
    Clock,
    FileText,
    GraduationCap,
    Headphones,
    Home,
    MessageSquare,
    Phone,
    Presentation,
    Shield,
    Target,
    Users,
    Zap
} from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const services = [
  {
    id: "tech",
    title: "حلول الذكاء الاصطناعي والأتمتة",
    subtitle: "وفّر وقتك وركز على الصفقات",
    description: "نظام صقر وحلول أتمتة متكاملة للوسطاء العقاريين",
    color: "from-primary to-primary-dark",
    icon: Bot,
    features: [
      {
        icon: MessageSquare,
        title: "رد آلي ذكي",
        description: "ردود تلقائية على رسائل واتساب تفهم احتياجات العميل",
      },
      {
        icon: Target,
        title: "تصفية العملاء",
        description: "فلترة العملاء المحتملين وتصنيفهم حسب الجدية",
      },
      {
        icon: Clock,
        title: "جدولة المعاينات",
        description: "حجز مواعيد المعاينات تلقائياً دون تدخل منك",
      },
      {
        icon: BarChart3,
        title: "تقارير أداء",
        description: "لوحة تحكم شاملة لمتابعة أدائك وتحليل النتائج",
      },
    ],
    cta: "جرب نظام صقر مجاناً",
    ctaLink: "/products/saqr",
  },
  {
    id: "brokerage",
    title: "الوساطة العقارية",
    subtitle: "شراكة عقارية موثوقة",
    description: "خدمات وساطة عقارية احترافية للأفراد والشركات",
    color: "from-secondary to-secondary-dark",
    icon: Home,
    features: [
      {
        icon: Home,
        title: "تسويق العقارات",
        description: "تسويق عقارك على أوسع نطاق باستخدام التقنيات الحديثة",
      },
      {
        icon: Users,
        title: "البحث عن عقارات",
        description: "نجد لك العقار المناسب حسب احتياجاتك وميزانيتك",
      },
      {
        icon: FileText,
        title: "إدارة العقود",
        description: "إعداد ومراجعة العقود العقارية بشكل احترافي",
      },
      {
        icon: Shield,
        title: "استشارات عقارية",
        description: "نصائح واستشارات من خبراء السوق العقاري",
      },
    ],
    cta: "احجز استشارة مجانية",
    ctaLink: "/contact",
  },
  {
    id: "training",
    title: "التدريب والاستشارات",
    subtitle: "طوّر مهاراتك واحترف",
    description: "برامج تدريبية متخصصة للوسطاء العقاريين والشركات",
    color: "from-green-500 to-green-600",
    icon: GraduationCap,
    features: [
      {
        icon: GraduationCap,
        title: "دورات تدريبية",
        description: "برامج شاملة من المبتدئ إلى المحترف في الوساطة العقارية",
      },
      {
        icon: Presentation,
        title: "ورش عمل",
        description: "ورش عمل تفاعلية لتطوير مهارات البيع والتفاوض",
      },
      {
        icon: Headphones,
        title: "استشارات فردية",
        description: "جلسات استشارية خاصة لتطوير عملك العقاري",
      },
      {
        icon: Users,
        title: "تدريب الفرق",
        description: "برامج تدريب مخصصة للشركات والمكاتب العقارية",
      },
    ],
    cta: "تواصل معنا",
    ctaLink: "/contact",
  },
];

const stats = [
  { value: "+500", label: "عميل", description: "خدمناهم بنجاح" },
  { value: "+2,500", label: "متدرب", description: "في أكاديميتنا" },
  { value: "+1,000", label: "صفقة", description: "أُغلقت بمساعدتنا" },
  { value: "5", label: "سنوات", description: "خبرة في السوق" },
];

const whyUs = [
  {
    icon: Zap,
    title: "سرعة التنفيذ",
    description: "نلتزم بالمواعيد ونقدم خدماتنا بأسرع وقت ممكن",
  },
  {
    icon: Target,
    title: "تركيز على النتائج",
    description: "هدفنا الوحيد هو تحقيق نتائج ملموسة لعملائنا",
  },
  {
    icon: Shield,
    title: "موثوقية عالية",
    description: "نعمل بشفافية تامة ونحافظ على ثقة عملائنا",
  },
  {
    icon: Users,
    title: "فريق متخصص",
    description: "خبراء في العقار والتقنية يعملون معاً لخدمتك",
  },
];

export default function ServicesPage() {
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
              <span className="text-primary font-bold text-xl block leading-tight">
                مسار العقار
              </span>
              <span className="text-text-secondary text-xs">Masar Al-Aqar</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-text-secondary hover:text-primary transition-colors"
            >
              الرئيسية
            </Link>
            <Link
              href="/blog"
              className="text-text-secondary hover:text-primary transition-colors"
            >
              المدونة
            </Link>
            <Link
              href="/library"
              className="text-text-secondary hover:text-primary transition-colors"
            >
              المكتبة
            </Link>

            <Link href="/services" className="text-primary font-medium">
              الخدمات
            </Link>
            <Link
              href="/contact"
              className="text-text-secondary hover:text-primary transition-colors"
            >
              تواصل معنا
            </Link>
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

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-surface to-background">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              🛠️ خدماتنا
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              حلول متكاملة لنجاحك في
              <span className="text-primary"> السوق العقاري</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              من الأتمتة الذكية إلى التدريب الاحترافي — كل ما تحتاجه تحت سقف
              واحد
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      {services.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className={`py-20 px-4 ${index % 2 === 1 ? "bg-surface" : ""}`}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mb-12"
            >
              <div
                className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-l ${service.color} text-white mb-4`}
              >
                <service.icon className="w-5 h-5" />
                <span className="font-medium">{service.title}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {service.subtitle}
              </h2>
              <p className="text-text-secondary text-lg max-w-2xl">
                {service.description}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {service.features.map((feature, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="bg-[#111E35] border border-[rgba(79,142,247,0.12)] rounded-2xl p-6 hover:shadow-lg hover:bg-[#162444] transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-text-secondary text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <div className="text-center">
              <Link
                href={service.ctaLink}
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-l ${service.color} hover:opacity-90 transition-opacity`}
              >
                {service.cta}
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* Stats */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              أرقام تتحدث عنا
            </h2>
            <p className="text-white/70 text-lg">
              نتائج حقيقية حققناها مع عملائنا
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">
                  {stat.value}
                </div>
                <div className="text-xl font-medium mb-1">{stat.label}</div>
                <div className="text-white/60 text-sm">{stat.description}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              لماذا مسار العقار؟
            </h2>
            <p className="text-text-secondary text-lg">ما يميزنا عن غيرنا</p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {whyUs.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center p-6"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-secondary to-secondary-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              جاهز للانطلاق؟
            </h2>
            <p className="text-white/80 text-lg mb-10">
              تواصل معنا اليوم واحصل على استشارة مجانية لاختيار الخدمة المناسبة
              لك
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#F0F4FF] text-[#070B14] rounded-xl font-bold hover:bg-white transition-colors"
              >
                <Phone className="w-5 h-5" />
                تواصل معنا الآن
              </Link>
              <Link
                href="/products/saqr"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-colors"
              >
                جرب نظام صقر
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-primary text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg">مسار العقار</span>
          </div>
          <p className="text-white/60 text-sm">
            © 2026 مسار العقار. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
