'use client'

import { motion } from 'framer-motion'
import { ProductCard } from '@/components/product-card'

const products = [
  {
    icon: '🦅',
    title: 'نظام صقر',
    description: 'نظام الرد الآلي الذكي للمكاتب العقارية. يرد على العملاء فوراً على واتساب ويُصفّي الجادين ويُجدول المعاينات تلقائياً.',
    features: [
      'رد فوري 24/7 على واتساب',
      'تصفية العملاء الجادين بالذكاء الاصطناعي',
      'جدولة المعاينات تلقائياً',
      'ربط مع أنظمة إدارة العقارات',
      'تقارير وتحليلات مفصلة',
      'دعم فني متواصل',
    ],
    price: 'ابتداءً من 500 ريال/شهر',
    href: '/products/saqr',
  },
  {
    icon: '🎯',
    title: 'منصة إغلاق',
    description: 'أتمتة متابعة العملاء وإغلاق الصفقات. نظام متكامل لإدارة دورة البيع العقاري من البداية للنهاية.',
    features: [
      'متابعة تلقائية للعملاء',
      'تذكيرات ذكية بالمواعيد',
      'إدارة العملاء المحتملين',
      'تتبع مراحل الصفقات',
      'تقارير أداء المبيعات',
      'تكامل مع نظام صقر',
    ],
    price: 'ابتداءً من 400 ريال/شهر',
    href: '/products/eghlaq',
  },
]

export default function ProductsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-cairo font-bold text-text-primary mb-4">
            منتجاتنا التقنية
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            حلول ذكية مصممة خصيصاً للمكاتب العقارية السعودية لتحويل عملك رقمياً
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard {...product} className="h-full" />
            </motion.div>
          ))}
        </div>

        {/* Comparison Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <h2 className="text-3xl font-cairo font-bold text-text-primary text-center mb-12">
            مقارنة المنتجات
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full bg-surface border border-border rounded-2xl overflow-hidden">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-right text-text-primary font-cairo">الميزة</th>
                  <th className="p-4 text-center text-primary font-cairo">نظام صقر 🦅</th>
                  <th className="p-4 text-center text-primary font-cairo">منصة إغلاق 🎯</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-4 text-text-secondary">الرد الآلي على واتساب</td>
                  <td className="p-4 text-center text-green-500">✓</td>
                  <td className="p-4 text-center text-text-muted">-</td>
                </tr>
                <tr>
                  <td className="p-4 text-text-secondary">تصفية العملاء بـ AI</td>
                  <td className="p-4 text-center text-green-500">✓</td>
                  <td className="p-4 text-center text-text-muted">-</td>
                </tr>
                <tr>
                  <td className="p-4 text-text-secondary">جدولة المعاينات</td>
                  <td className="p-4 text-center text-green-500">✓</td>
                  <td className="p-4 text-center text-green-500">✓</td>
                </tr>
                <tr>
                  <td className="p-4 text-text-secondary">متابعة العملاء التلقائية</td>
                  <td className="p-4 text-center text-text-muted">-</td>
                  <td className="p-4 text-center text-green-500">✓</td>
                </tr>
                <tr>
                  <td className="p-4 text-text-secondary">تتبع الصفقات</td>
                  <td className="p-4 text-center text-text-muted">-</td>
                  <td className="p-4 text-center text-green-500">✓</td>
                </tr>
                <tr>
                  <td className="p-4 text-text-secondary">تقارير وتحليلات</td>
                  <td className="p-4 text-center text-green-500">✓</td>
                  <td className="p-4 text-center text-green-500">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <h2 className="text-3xl font-cairo font-bold text-text-primary text-center mb-12">
            الأسئلة الشائعة
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'هل أحتاج خبرة تقنية لاستخدام المنتجات؟',
                a: 'لا، منتجاتنا مصممة لتكون سهلة الاستخدام. فريقنا يقوم بالإعداد الكامل وتدريب فريقك.',
              },
              {
                q: 'هل يمكن استخدام المنتجين معاً؟',
                a: 'نعم، المنتجان متكاملان ويعملان بشكل أفضل معاً. نظام صقر يجلب العملاء ومنصة إغلاق تتابعهم.',
              },
              {
                q: 'ما هي فترة التجربة المجانية؟',
                a: 'نوفر 14 يوماً تجربة مجانية لكلا المنتجين مع دعم فني كامل.',
              },
              {
                q: 'هل البيانات آمنة؟',
                a: 'نستخدم أعلى معايير الأمان والتشفير. بياناتك محمية وخاصة 100%.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-surface border border-border rounded-xl p-6"
              >
                <h3 className="font-cairo font-bold text-text-primary mb-2">
                  {faq.q}
                </h3>
                <p className="text-text-secondary">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
