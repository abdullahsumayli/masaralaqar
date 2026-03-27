"use client";

import { motion } from "framer-motion";
import {
    BarChart3,
    BookOpen,
    Check,
    Download,
    FileText,
    Lock,
    Mail,
    PenTool,
    Phone,
    Search
} from "lucide-react";
import Link from "next/link";
import { MqLogo } from "@/components/mq/MqLogo";
import { useState } from "react";

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

const typeFilters = [
  { id: "all", label: "الكل", icon: null },
  { id: "ebook", label: "كتب إلكترونية", icon: BookOpen },
  { id: "guide", label: "أدلة إرشادية", icon: FileText },
  { id: "template", label: "نماذج وقوالب", icon: PenTool },
  { id: "infographic", label: "إنفوجرافيك", icon: BarChart3 },
];

const priceFilters = [
  { id: "all", label: "الكل" },
  { id: "free", label: "مجاني" },
  { id: "premium", label: "مدفوع" },
];

const resources = [
  {
    title: "دليل الوسيط العقاري الشامل 2026",
    description: "كل ما تحتاج معرفته للنجاح في الوساطة العقارية",
    type: "ebook",
    price: "premium",
    priceValue: 199,
    pages: 85,
    downloads: 1200,
  },
  {
    title: "قائمة تدقيق إغلاق الصفقات",
    description: "قائمة شاملة لضمان عدم نسيان أي خطوة",
    type: "template",
    price: "free",
    priceValue: 0,
    pages: 5,
    downloads: 3500,
  },
  {
    title: "كيف تكتب إعلاناً عقارياً جذاباً",
    description: "دليل خطوة بخطوة لكتابة إعلانات عقارية فعّالة",
    type: "guide",
    price: "free",
    priceValue: 0,
    pages: 12,
    downloads: 2800,
  },
  {
    title: "إنفوجرافيك: رحلة العميل العقاري",
    description: "تصور بصري لمراحل تعامل العميل مع الوسيط",
    type: "infographic",
    price: "free",
    priceValue: 0,
    pages: 1,
    downloads: 4200,
  },
  {
    title: "نموذج عقد وساطة عقارية",
    description: "نموذج عقد وساطة قابل للتعديل ومتوافق مع النظام",
    type: "template",
    price: "premium",
    priceValue: 49,
    pages: 8,
    downloads: 980,
  },
  {
    title: "دليل التسويق الرقمي للعقارات",
    description: "استراتيجيات التسويق العقاري على المنصات الرقمية",
    type: "guide",
    price: "premium",
    priceValue: 149,
    pages: 45,
    downloads: 650,
  },
  {
    title: "كتاب أساسيات التثمين العقاري",
    description: "مبادئ وأسس تقييم العقارات للمبتدئين",
    type: "ebook",
    price: "premium",
    priceValue: 249,
    pages: 120,
    downloads: 450,
  },
  {
    title: "إنفوجرافيك: أنواع العقارات في السعودية",
    description: "تصنيف شامل لأنواع العقارات المختلفة",
    type: "infographic",
    price: "free",
    priceValue: 0,
    pages: 1,
    downloads: 5600,
  },
  {
    title: "نموذج خطة تسويقية لعقار",
    description: "خطة جاهزة للتعديل لتسويق أي عقار",
    type: "template",
    price: "free",
    priceValue: 0,
    pages: 10,
    downloads: 2100,
  },
];

const typeIcons: Record<string, any> = {
  ebook: BookOpen,
  guide: FileText,
  template: PenTool,
  infographic: BarChart3,
};

const typeLabels: Record<string, string> = {
  ebook: "كتاب إلكتروني",
  guide: "دليل إرشادي",
  template: "نموذج",
  infographic: "إنفوجرافيك",
};

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [activePrice, setActivePrice] = useState("all");
  const [email, setEmail] = useState("");

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.includes(searchQuery) ||
      resource.description.includes(searchQuery);
    const matchesType = activeType === "all" || resource.type === activeType;
    const matchesPrice =
      activePrice === "all" || resource.price === activePrice;
    return matchesSearch && matchesType && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0B1528]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-md shadow-primary/30">
              <MqLogo onPrimary className="h-[70%] w-[70%]" />
            </div>
            <div>
              <span className="font-cairo text-primary block text-xl font-bold leading-tight">
                MQ
              </span>
              <span className="font-sora text-xs font-medium text-slate-400">
                masaralaqar.com
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="font-ibm-arabic text-sm font-medium text-slate-300 transition-colors hover:text-primary"
            >
              الرئيسية
            </Link>
            <Link
              href="/blog"
              className="font-ibm-arabic text-sm font-medium text-slate-300 transition-colors hover:text-primary"
            >
              المدونة
            </Link>
            <Link href="/library" className="font-ibm-arabic text-sm font-semibold text-primary">
              المكتبة
            </Link>

            <Link
              href="/services"
              className="font-ibm-arabic text-sm font-medium text-slate-300 transition-colors hover:text-primary"
            >
              الخدمات
            </Link>
            <Link
              href="/contact"
              className="font-ibm-arabic text-sm font-medium text-slate-300 transition-colors hover:text-primary"
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

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-surface to-background">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              📂 المكتبة العقارية
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              مصادر ومراجع تساعدك على
              <span className="text-primary"> النجاح في العقار</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
              كتب إلكترونية، أدلة، نماذج، وإنفوجرافيك — كلها مصممة خصيصاً للوسيط
              العقاري السعودي
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 px-4 border-b border-border sticky top-20 bg-[#070B14]/95 backdrop-blur-sm z-40">
        <div className="max-w-6xl mx-auto">
          {/* Search */}
          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="ابحث عن مورد..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {typeFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveType(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeType === filter.id
                    ? "bg-primary text-white"
                    : "bg-surface text-text-secondary hover:bg-primary/10"
                }`}
              >
                {filter.icon && <filter.icon className="w-4 h-4" />}
                {filter.label}
              </button>
            ))}
          </div>

          {/* Price Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {priceFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActivePrice(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activePrice === filter.id
                    ? "bg-secondary text-white"
                    : "bg-surface text-text-secondary hover:bg-secondary/10"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredResources.map((resource, index) => {
              const TypeIcon = typeIcons[resource.type];
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-[#111E35] border border-[rgba(37,211,102,0.12)] rounded-2xl overflow-hidden hover:shadow-xl hover:bg-[#162444] transition-all group"
                >
                  {/* Preview */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 relative flex items-center justify-center">
                    <TypeIcon className="w-16 h-16 text-primary/30" />
                    {resource.price === "premium" && (
                      <div className="absolute top-3 left-3 bg-secondary text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        مدفوع
                      </div>
                    )}
                    {resource.price === "free" && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        مجاني
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <TypeIcon className="w-4 h-4 text-primary" />
                      <span className="text-sm text-primary">
                        {typeLabels[resource.type]}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                      {resource.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-text-muted mb-4">
                      <span>{resource.pages} صفحة</span>
                      <span>
                        {resource.downloads.toLocaleString("ar-SA")} تحميل
                      </span>
                    </div>

                    {resource.price === "free" ? (
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
                        <Download className="w-4 h-4" />
                        تحميل مجاني
                      </button>
                    ) : (
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-white rounded-lg font-medium hover:bg-secondary-dark transition-colors">
                        شراء (ر.س {resource.priceValue})
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {filteredResources.length === 0 && (
            <div className="text-center py-16">
              <p className="text-text-muted text-lg">
                لا توجد موارد مطابقة للفلتر
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Mail className="w-16 h-16 mx-auto mb-6 text-secondary" />
            <h2 className="text-3xl font-bold mb-4">
              احصل على موارد حصرية في بريدك
            </h2>
            <p className="text-white/80 text-lg mb-8">
              اشترك في نشرتنا البريدية واحصل على كتب وأدلة حصرية مجاناً
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-secondary"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-secondary text-white rounded-xl font-medium hover:bg-secondary-dark transition-colors"
              >
                اشترك الآن
              </button>
            </form>
            <p className="text-white/60 text-sm mt-4">
              لن نرسل لك إلا محتوى قيّم — بدون إزعاج
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-cairo text-3xl font-bold mb-4 text-text-primary">
              لماذا مكتبة MQ؟
            </h2>
            <p className="text-text-secondary text-lg">
              موارد مصممة خصيصاً للسوق السعودي
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "محتوى محلي",
                description:
                  "جميع الموارد مكتوبة بواسطة خبراء سعوديين يفهمون السوق المحلي",
              },
              {
                title: "تحديث مستمر",
                description:
                  "نحدث مواردنا باستمرار لتواكب تطورات السوق والأنظمة",
              },
              {
                title: "تطبيق عملي",
                description:
                  "كل مورد يحتوي على خطوات عملية قابلة للتطبيق فوراً",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="text-center p-8 bg-surface rounded-2xl"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3">{benefit.title}</h3>
                <p className="text-text-secondary">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-primary text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
              <MqLogo onPrimary className="h-[72%] w-[72%]" />
            </div>
            <span className="font-cairo text-lg font-bold text-white">MQ</span>
          </div>
          <p className="font-ibm-arabic text-sm text-white/85">
            © 2026 MQ — masaralaqar.com
          </p>
        </div>
      </footer>
    </div>
  );
}
