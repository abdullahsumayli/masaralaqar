'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Users,
  Key,
  Save,
  Camera
} from 'lucide-react'

const tabs = [
  { id: 'profile', label: 'الملف الشخصي', icon: User },
  { id: 'company', label: 'بيانات المكتب', icon: Building2 },
  { id: 'notifications', label: 'الإشعارات', icon: Bell },
  { id: 'security', label: 'الأمان', icon: Shield },
  { id: 'team', label: 'فريق العمل', icon: Users },
  { id: 'billing', label: 'الاشتراك والفوترة', icon: CreditCard },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">الإعدادات</h1>
        <p className="text-text-secondary mt-1">إدارة إعدادات حسابك ومكتبك</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 bg-surface border border-border rounded-2xl p-4 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-right ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-text-secondary hover:bg-background hover:text-text-primary'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-surface border border-border rounded-2xl p-8">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-6">الملف الشخصي</h2>
                
                {/* Avatar */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                      ع
                    </div>
                    <button className="absolute -bottom-2 -left-2 w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary">عبدالله السميلي</h3>
                    <p className="text-text-secondary text-sm">مدير المكتب</p>
                    <button className="text-primary text-sm mt-2 hover:underline">تغيير الصورة</button>
                  </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">الاسم الأول</label>
                    <input
                      type="text"
                      defaultValue="عبدالله"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">اسم العائلة</label>
                    <input
                      type="text"
                      defaultValue="السميلي"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      defaultValue="abdullah@masaralaqar.com"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">رقم الهاتف</label>
                    <input
                      type="tel"
                      defaultValue="+966545374069"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-border">
                <button className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-xl transition-all flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  حفظ التغييرات
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'company' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-6">بيانات المكتب</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">اسم المكتب</label>
                    <input
                      type="text"
                      defaultValue="مسار العقار"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">رقم السجل التجاري</label>
                    <input
                      type="text"
                      defaultValue="1010XXXXXX"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">العنوان</label>
                    <input
                      type="text"
                      defaultValue="الرياض، المملكة العربية السعودية"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">وصف المكتب</label>
                    <textarea
                      rows={4}
                      defaultValue="مكتب عقاري متخصص في بيع وتأجير العقارات السكنية والتجارية في مدينة الرياض"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-border">
                <button className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-xl transition-all flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  حفظ التغييرات
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-6">إعدادات الإشعارات</h2>
                
                <div className="space-y-6">
                  {[
                    { title: 'عميل جديد', desc: 'إشعار عند تسجيل عميل جديد', enabled: true },
                    { title: 'رسالة جديدة', desc: 'إشعار عند استلام رسالة من عميل', enabled: true },
                    { title: 'معاينة قادمة', desc: 'تذكير قبل موعد المعاينة بساعة', enabled: true },
                    { title: 'تقرير يومي', desc: 'ملخص يومي للنشاط', enabled: false },
                    { title: 'تقرير أسبوعي', desc: 'ملخص أسبوعي للأداء', enabled: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-background rounded-xl">
                      <div>
                        <h3 className="font-medium text-text-primary">{item.title}</h3>
                        <p className="text-text-secondary text-sm">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-border rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-6">الأمان وكلمة المرور</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">كلمة المرور الحالية</label>
                    <input
                      type="password"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">تأكيد كلمة المرور</label>
                    <input
                      type="password"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Key className="w-5 h-5 text-yellow-500 mt-1" />
                    <div>
                      <h3 className="font-medium text-yellow-500">المصادقة الثنائية</h3>
                      <p className="text-text-secondary text-sm mt-1">أضف طبقة حماية إضافية لحسابك</p>
                      <button className="text-yellow-500 text-sm mt-2 hover:underline">تفعيل الآن</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-border">
                <button className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-xl transition-all flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  تحديث كلمة المرور
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-primary">فريق العمل</h2>
                <button className="bg-primary hover:bg-primary-dark text-white font-medium px-4 py-2 rounded-xl transition-all text-sm">
                  + إضافة عضو
                </button>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: 'عبدالله السميلي', role: 'مدير', email: 'abdullah@masaralaqar.com', status: 'نشط' },
                  { name: 'محمد أحمد', role: 'موظف مبيعات', email: 'mohammed@masaralaqar.com', status: 'نشط' },
                  { name: 'سارة علي', role: 'موظف مبيعات', email: 'sara@masaralaqar.com', status: 'نشط' },
                ].map((member, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-background rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-text-primary">{member.name}</h3>
                        <p className="text-text-secondary text-sm">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-surface border border-border rounded-full text-sm text-text-secondary">
                        {member.role}
                      </span>
                      <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm">
                        {member.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'billing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-6">الاشتراك والفوترة</h2>
                
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-primary text-sm font-medium">الباقة الحالية</span>
                      <h3 className="text-2xl font-bold text-text-primary mt-1">الباقة الاحترافية</h3>
                      <p className="text-text-secondary mt-2">الفترة: 1 مارس 2025 - 1 مارس 2026</p>
                    </div>
                    <div className="text-left">
                      <p className="text-3xl font-bold text-primary">499</p>
                      <p className="text-text-secondary">ريال/شهر</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-text-primary">سجل الفواتير</h3>
                  {[
                    { date: '1 فبراير 2026', amount: '499 ريال', status: 'مدفوع' },
                    { date: '1 يناير 2026', amount: '499 ريال', status: 'مدفوع' },
                    { date: '1 ديسمبر 2025', amount: '499 ريال', status: 'مدفوع' },
                  ].map((invoice, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-background rounded-xl">
                      <div>
                        <p className="font-medium text-text-primary">{invoice.date}</p>
                        <p className="text-text-secondary text-sm">{invoice.amount}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm">{invoice.status}</span>
                        <button className="text-primary text-sm hover:underline">تحميل</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
