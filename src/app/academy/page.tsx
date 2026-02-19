'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Building2,
  Phone,
  Play,
  Clock,
  Users,
  Star,
  CheckCircle,
  GraduationCap,
  BookOpen,
  Trophy,
  ArrowLeft,
  Quote,
} from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const learningPaths = [
  {
    level: 'مبتدئ',
    title: 'أساسيات الوساطة العقارية',
    description: 'ابدأ رحلتك في عالم العقار بأساسيات متينة',
    courses: 8,
    hours: 24,
    students: 1250,
    color: 'from-green-500 to-green-600',
    topics: ['مقدمة في العقار', 'أنواع العقارات', 'التسويق الأساسي', 'خدمة العملاء'],
  },
  {
    level: 'متوسط',
    title: 'احتراف التسويق والمبيعات',
    description: 'طوّر مهاراتك في التسويق والتفاوض وإغلاق الصفقات',
    courses: 12,
    hours: 40,
    students: 890,
    color: 'from-primary to-primary-dark',
    topics: ['التسويق الرقمي', 'فن التفاوض', 'إدارة العلاقات', 'إغلاق الصفقات'],
  },
  {
    level: 'متقدم',
    title: 'التقنية والأتمتة',
    description: 'استخدم الذكاء الاصطناعي والأتمتة لتتفوق على المنافسين',
    courses: 6,
    hours: 18,
    students: 420,
    color: 'from-secondary to-secondary-dark',
    topics: ['الذكاء الاصطناعي', 'أتمتة العمليات', 'تحليل البيانات', 'أنظمة CRM'],
  },
]

const featuredCourses = [
  {
    title: 'دورة التسويق العقاري الرقمي',
    instructor: 'أ. محمد الشهري',
    duration: '8 ساعات',
    lessons: 24,
    students: 450,
    rating: 4.9,
    price: 299,
    level: 'متوسط',
  },
  {
    title: 'إتقان فن التفاوض العقاري',
    instructor: 'أ. عبدالله القحطاني',
    duration: '6 ساعات',
    lessons: 18,
    students: 380,
    rating: 4.8,
    price: 249,
    level: 'متقدم',
  },
  {
    title: 'أساسيات الوساطة العقارية',
    instructor: 'أ. سارة الدوسري',
    duration: '10 ساعات',
    lessons: 30,
    students: 720,
    rating: 4.9,
    price: 199,
    level: 'مبتدئ',
  },
  {
    title: 'استخدام الذكاء الاصطناعي في العقار',
    instructor: 'م. خالد العتيبي',
    duration: '5 ساعات',
    lessons: 15,
    students: 280,
    rating: 4.7,
    price: 349,
    level: 'متقدم',
  },
]

const testimonials = [
  {
    name: 'فهد المطيري',
    role: 'وسيط عقاري',
    content: 'بعد إكمال مسار المبتدئين، تضاعفت صفقاتي خلال 3 أشهر. المحتوى عملي جداً.',
    rating: 5,
  },
  {
    name: 'نورة الزهراني',
    role: 'مسوقة عقارية',
    content: 'دورة التسويق الرقمي غيرت طريقة عملي بالكامل. ممتازة للمحترفين.',
    rating: 5,
  },
  {
    name: 'سعود الحربي',
    role: 'مدير مبيعات',
    content: 'محتوى الأكاديمية مميز ومحدث باستمرار. استثمار يستحق.',
    rating: 5,
  },
]

const benefits = [
  {
    icon: GraduationCap,
    title: 'شهادات معتمدة',
    description: 'احصل على شهادات إتمام معتمدة لكل دورة',
  },
  {
    icon: BookOpen,
    title: 'محتوى عملي',
    description: 'تعلم من خلال أمثلة وحالات حقيقية من السوق السعودي',
  },
  {
    icon: Users,
    title: 'مجتمع داعم',
    description: 'انضم لمجتمع من الوسطاء للتواصل وتبادل الخبرات',
  },
  {
    icon: Trophy,
    title: 'تحديث مستمر',
    description: 'محتوى يتم تحديثه باستمرار ليواكب تطورات السوق',
  },
]

export default function AcademyPage() {
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
            <Link href="/" className="text-text-secondary hover:text-primary transition-colors">الرئيسية</Link>
            <Link href="/blog" className="text-text-secondary hover:text-primary transition-colors">المدونة</Link>
            <Link href="/library" className="text-text-secondary hover:text-primary transition-colors">المكتبة</Link>
            <Link href="/academy" className="text-primary font-medium">الأكاديمية</Link>
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
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center"
          >
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              🎓 أكاديمية مسار العقار
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              حوّل شغفك بالعقار إلى
              <br />
              <span className="text-primary">مهنة ناجحة</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
              دورات تدريبية متخصصة في الوساطة العقارية — من الأساسيات إلى الاحتراف، 
              بواسطة خبراء السوق السعودي
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#paths"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors text-lg"
              >
                استكشف المسارات
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <button className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary/5 transition-colors text-lg">
                <Play className="w-5 h-5" />
                شاهد فيديو تعريفي
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-12 mt-16">
              {[
                { value: '+2,500', label: 'متدرب' },
                { value: '+26', label: 'دورة' },
                { value: '4.9', label: 'تقييم' },
                { value: '+80', label: 'ساعة محتوى' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Learning Paths */}
      <section id="paths" className="py-20 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">اختر مسارك التعليمي</h2>
            <p className="text-text-secondary text-lg">
              ثلاث مسارات مصممة حسب مستواك وأهدافك
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {learningPaths.map((path, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className={`h-3 bg-gradient-to-l ${path.color}`}></div>
                <div className="p-8">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 bg-gradient-to-l ${path.color} text-white`}>
                    {path.level}
                  </span>
                  <h3 className="font-bold text-xl mb-3">{path.title}</h3>
                  <p className="text-text-secondary mb-6">{path.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-text-muted mb-6">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {path.courses} دورات
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {path.hours} ساعة
                    </span>
                  </div>

                  <div className="space-y-2 mb-6">
                    {path.topics.map((topic, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-sm text-text-muted flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {path.students.toLocaleString('ar-SA')} متدرب
                    </span>
                    <Link
                      href="#"
                      className="text-primary font-medium hover:underline flex items-center gap-1"
                    >
                      ابدأ المسار
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">الدورات المميزة</h2>
              <p className="text-text-secondary">أكثر الدورات طلباً من متدربينا</p>
            </div>
            <Link
              href="#"
              className="hidden md:inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              عرض جميع الدورات
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredCourses.map((course, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative flex items-center justify-center">
                  <Play className="w-12 h-12 text-primary/50" />
                  <span className="absolute top-3 right-3 px-2 py-1 bg-white/90 rounded-full text-xs font-medium">
                    {course.level}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-text-muted text-sm mb-3">{course.instructor}</p>
                  
                  <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </span>
                    <span>{course.lessons} درس</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{course.rating}</span>
                      <span className="text-text-muted text-xs">({course.students})</span>
                    </div>
                    <span className="font-bold text-primary">ر.س {course.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">لماذا أكاديمية مسار العقار؟</h2>
            <p className="text-text-secondary text-lg">
              مزايا تجعل تجربتك التعليمية فريدة
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-text-secondary text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">ماذا يقول متدربونا؟</h2>
            <p className="text-text-secondary text-lg">
              قصص نجاح من مجتمع مسار العقار
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white border border-border rounded-2xl p-8 relative"
              >
                <Quote className="w-10 h-10 text-primary/20 absolute top-6 left-6" />
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-text-secondary mb-6">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-text-muted text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ابدأ رحلتك التعليمية اليوم
            </h2>
            <p className="text-white/80 text-lg mb-10">
              انضم إلى أكثر من 2,500 وسيط عقاري طوّروا مهاراتهم معنا
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#paths"
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-white rounded-xl font-bold hover:bg-secondary-dark transition-colors"
              >
                ابدأ التعلم مجاناً
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-colors"
              >
                تواصل معنا
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
  )
}
