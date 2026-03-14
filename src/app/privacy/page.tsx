import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Eye, Lock, FileText, Users, Mail } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | مسار العقار',
  description: 'سياسة الخصوصية لمنصة مسار العقار - كيف نجمع ونستخدم ونحمي بياناتك الشخصية',
}

export default function PrivacyPage() {
  const sections = [
    {
      icon: FileText,
      title: 'المعلومات التي نجمعها',
      content: [
        'معلومات الحساب: الاسم، البريد الإلكتروني، رقم الجوال عند التسجيل',
        'معلومات المكتب العقاري: اسم المكتب، العنوان، رقم الترخيص',
        'بيانات الاستخدام: كيفية تفاعلك مع خدماتنا',
        'معلومات الجهاز: نوع المتصفح، عنوان IP، نظام التشغيل',
      ]
    },
    {
      icon: Eye,
      title: 'كيف نستخدم معلوماتك',
      content: [
        'تقديم وتحسين خدماتنا',
        'التواصل معك بخصوص حسابك والتحديثات',
        'تحليل الاستخدام لتحسين تجربة المستخدم',
        'إرسال رسائل تسويقية (بموافقتك المسبقة)',
        'الامتثال للمتطلبات القانونية',
      ]
    },
    {
      icon: Users,
      title: 'مشاركة المعلومات',
      content: [
        'لا نبيع معلوماتك الشخصية لأي طرف ثالث',
        'قد نشارك البيانات مع مزودي الخدمات الموثوقين',
        'قد نفصح عن المعلومات عند الضرورة القانونية',
        'في حالة الاندماج أو الاستحواذ، سيتم إعلامك',
      ]
    },
    {
      icon: Lock,
      title: 'حماية البيانات',
      content: [
        'نستخدم تشفير SSL لحماية البيانات أثناء النقل',
        'نخزن البيانات في خوادم آمنة مع تشفير',
        'نقيّد الوصول للبيانات للموظفين المعتمدين فقط',
        'نجري مراجعات أمنية دورية',
      ]
    },
    {
      icon: Shield,
      title: 'حقوقك',
      content: [
        'الوصول إلى بياناتك الشخصية',
        'تصحيح البيانات غير الدقيقة',
        'حذف حسابك وبياناتك',
        'الاعتراض على معالجة البيانات',
        'سحب موافقتك في أي وقت',
      ]
    },
  ]

  return (
    <main className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-surface to-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">حماية خصوصيتك أولويتنا</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              سياسة الخصوصية
            </h1>
            <p className="text-lg text-text-secondary">
              نلتزم بحماية خصوصيتك وبياناتك الشخصية. هذه السياسة توضح كيف نجمع ونستخدم ونحمي معلوماتك.
            </p>
            <p className="text-sm text-text-muted mt-4">
              آخر تحديث: 1 يناير 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-12">
            {sections.map((section, index) => (
              <div key={index} className="bg-surface rounded-2xl p-8 border border-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Cookies */}
            <div className="bg-surface rounded-2xl p-8 border border-border">
              <h2 className="text-xl font-bold text-text-primary mb-4">ملفات تعريف الارتباط (Cookies)</h2>
              <p className="text-text-secondary mb-4">
                نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا. يمكنك التحكم في إعدادات الكوكيز من متصفحك.
              </p>
              <p className="text-text-secondary">
                أنواع الكوكيز المستخدمة: كوكيز ضرورية للتشغيل، كوكيز تحليلية، كوكيز تفضيلات المستخدم.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
              <div className="flex items-center gap-4 mb-4">
                <Mail className="w-8 h-8 text-primary" />
                <h2 className="text-xl font-bold text-text-primary">تواصل معنا</h2>
              </div>
              <p className="text-text-secondary mb-4">
                إذا كان لديك أي أسئلة حول سياسة الخصوصية أو ترغب في ممارسة حقوقك، تواصل معنا:
              </p>
              <div className="space-y-2 text-text-secondary">
                <p>البريد الإلكتروني: privacy@masaralaqar.com</p>
                <p>الهاتف: +966 54 537 4069</p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 btn-primary mt-6"
              >
                تواصل معنا
                <ArrowRight className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
