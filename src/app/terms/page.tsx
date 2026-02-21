import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, FileText, AlertTriangle, CreditCard, Scale, XCircle, RefreshCw, Mail } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'الشروط والأحكام | مسار العقار',
  description: 'الشروط والأحكام لاستخدام منصة مسار العقار ونظام صقر',
}

export default function TermsPage() {
  const sections = [
    {
      icon: FileText,
      title: 'قبول الشروط',
      content: [
        'باستخدامك لمنصة مسار العقار، فإنك توافق على الالتزام بهذه الشروط والأحكام.',
        'إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام خدماتنا.',
        'نحتفظ بالحق في تعديل هذه الشروط في أي وقت، وسيتم إعلامك بالتغييرات.',
        'استمرارك في استخدام الخدمة بعد التعديلات يعني موافقتك عليها.',
      ]
    },
    {
      icon: Scale,
      title: 'استخدام الخدمة',
      content: [
        'يجب أن يكون عمرك 18 عاماً أو أكثر لاستخدام خدماتنا.',
        'أنت مسؤول عن الحفاظ على سرية معلومات حسابك.',
        'يُحظر استخدام الخدمة لأي أغراض غير قانونية.',
        'يجب تقديم معلومات صحيحة ودقيقة عند التسجيل.',
        'لا يجوز مشاركة حسابك مع آخرين أو السماح لهم بالوصول إليه.',
      ]
    },
    {
      icon: CreditCard,
      title: 'الدفع والاشتراكات',
      content: [
        'الأسعار معروضة بالريال السعودي وتشمل ضريبة القيمة المضافة.',
        'يتم تجديد الاشتراكات تلقائياً ما لم يتم إلغاؤها قبل تاريخ التجديد.',
        'الفترة التجريبية المجانية (14 يوماً) لا تتطلب بطاقة ائتمان.',
        'يمكن الدفع عبر التحويل البنكي أو البطاقات الائتمانية.',
        'الفواتير تُرسل إلكترونياً إلى بريدك المسجل.',
      ]
    },
    {
      icon: RefreshCw,
      title: 'سياسة الاسترداد',
      content: [
        'يمكن طلب استرداد المبلغ خلال 7 أيام من تاريخ الاشتراك الأول.',
        'لا يشمل الاسترداد الفترات التي تم استخدام الخدمة فيها بشكل فعلي.',
        'عند الإلغاء، تظل الخدمة متاحة حتى نهاية فترة الفوترة الحالية.',
        'لطلب الاسترداد، تواصل مع فريق الدعم الفني.',
      ]
    },
    {
      icon: AlertTriangle,
      title: 'إخلاء المسؤولية',
      content: [
        'نقدم الخدمة "كما هي" دون ضمانات صريحة أو ضمنية.',
        'لا نضمن أن الخدمة ستكون متاحة بشكل مستمر دون انقطاع.',
        'لسنا مسؤولين عن أي خسائر ناتجة عن استخدام الخدمة.',
        'أنت مسؤول عن التأكد من ملاءمة الخدمة لاحتياجاتك.',
      ]
    },
    {
      icon: XCircle,
      title: 'إنهاء الخدمة',
      content: [
        'يمكنك إلغاء اشتراكك في أي وقت من إعدادات الحساب.',
        'نحتفظ بالحق في تعليق أو إنهاء حسابك في حالة انتهاك الشروط.',
        'عند الإنهاء، قد يتم حذف بياناتك بعد فترة محددة.',
        'بعض الشروط تستمر بعد إنهاء الخدمة (مثل إخلاء المسؤولية).',
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
              <Scale className="w-4 h-4" />
              <span className="text-sm font-medium">اتفاقية الاستخدام</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              الشروط والأحكام
            </h1>
            <p className="text-lg text-text-secondary">
              يرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا. باستخدامك للمنصة، فإنك توافق على الالتزام بها.
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

            {/* Intellectual Property */}
            <div className="bg-surface rounded-2xl p-8 border border-border">
              <h2 className="text-xl font-bold text-text-primary mb-4">الملكية الفكرية</h2>
              <p className="text-text-secondary mb-4">
                جميع المحتويات على المنصة، بما في ذلك النصوص والرسومات والشعارات والبرمجيات، 
                هي ملكية حصرية لمسار العقار ومحمية بموجب قوانين حقوق النشر والملكية الفكرية.
              </p>
              <p className="text-text-secondary">
                لا يجوز نسخ أو توزيع أو تعديل أي محتوى دون إذن كتابي مسبق.
              </p>
            </div>

            {/* Governing Law */}
            <div className="bg-surface rounded-2xl p-8 border border-border">
              <h2 className="text-xl font-bold text-text-primary mb-4">القانون الحاكم</h2>
              <p className="text-text-secondary">
                تخضع هذه الشروط لقوانين المملكة العربية السعودية وتُفسر وفقاً لها. 
                أي نزاعات تنشأ عن استخدام الخدمة تخضع للاختصاص القضائي للمحاكم السعودية.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
              <div className="flex items-center gap-4 mb-4">
                <Mail className="w-8 h-8 text-primary" />
                <h2 className="text-xl font-bold text-text-primary">أسئلة حول الشروط؟</h2>
              </div>
              <p className="text-text-secondary mb-4">
                إذا كان لديك أي استفسارات حول هذه الشروط والأحكام، نحن هنا للمساعدة.
              </p>
              <div className="space-y-2 text-text-secondary">
                <p>البريد الإلكتروني: legal@masaralaqar.com</p>
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
