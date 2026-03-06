'use client'

import { useState } from 'react'
import { 
  Building2, 
  Bell, 
  Lock, 
  CreditCard, 
  Users,
  Globe,
  Mail,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'

const tabs = [
  { id: 'general', label: 'عام', icon: Building2 },
  { id: 'notifications', label: 'الإشعارات', icon: Bell },
  { id: 'security', label: 'الأمان', icon: Lock },
  { id: 'billing', label: 'الفوترة', icon: CreditCard },
  { id: 'team', label: 'الفريق', icon: Users },
]

const teamMembers = [
  { name: 'أحمد السعيد', email: 'ahmed@masaralaqar.com', role: 'مدير', status: 'active' },
  { name: 'سارة العتيبي', email: 'sara@masaralaqar.com', role: 'دعم فني', status: 'active' },
  { name: 'خالد المالكي', email: 'khalid@masaralaqar.com', role: 'مبيعات', status: 'active' },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-cairo">الإعدادات</h1>
        <p className="text-gray-400 mt-1">إدارة إعدادات لوحة الإدارة</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-4 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-gray-400 hover:bg-[#21262d] hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white mb-4">الإعدادات العامة</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">اسم الشركة</label>
                  <input
                    type="text"
                    defaultValue="مسار العقار"
                    className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    defaultValue="info@masaralaqar.com"
                    className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">رقم الهاتف</label>
                  <input
                    type="tel"
                    defaultValue="+966545374069"
                    className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">الموقع الإلكتروني</label>
                  <input
                    type="url"
                    defaultValue="https://masaralaqar.com"
                    className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">وصف الشركة</label>
                <textarea
                  rows={4}
                  defaultValue="نقدم حلول ذكاء اصطناعي متقدمة للقطاع العقاري"
                  className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <button className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all">
                <Save className="w-5 h-5" />
                حفظ التغييرات
              </button>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white mb-4">إعدادات الإشعارات</h2>
              
              <div className="space-y-4">
                {[
                  { title: 'طلبات التجربة الجديدة', desc: 'إشعار عند استلام طلب تجربة جديد' },
                  { title: 'اشتراكات جديدة', desc: 'إشعار عند اشتراك عميل جديد' },
                  { title: 'تذاكر الدعم', desc: 'إشعار عند فتح تذكرة دعم جديدة' },
                  { title: 'انتهاء الاشتراكات', desc: 'تنبيه قبل انتهاء اشتراك بـ 7 أيام' },
                  { title: 'تقارير أسبوعية', desc: 'استلام تقرير أسبوعي بالأداء' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[#161b22] rounded-xl">
                    <div>
                      <p className="text-white font-medium">{item.title}</p>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-[#21262d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>

              <button className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all">
                <Save className="w-5 h-5" />
                حفظ التغييرات
              </button>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white mb-4">إعدادات الأمان</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">كلمة المرور الحالية</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="أدخل كلمة المرور الحالية"
                      className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 pl-12 text-white focus:outline-none focus:border-primary"
                    />
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    placeholder="أدخل كلمة المرور الجديدة"
                    className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">تأكيد كلمة المرور</label>
                  <input
                    type="password"
                    placeholder="أعد إدخال كلمة المرور الجديدة"
                    className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <p className="text-yellow-500 text-sm">تأكد من اختيار كلمة مرور قوية تحتوي على 8 أحرف على الأقل مع أرقام ورموز</p>
              </div>

              <button className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all">
                <Lock className="w-5 h-5" />
                تحديث كلمة المرور
              </button>
            </div>
          )}

          {/* Billing */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white mb-4">الفوترة والمدفوعات</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#161b22] rounded-xl">
                  <p className="text-gray-400 text-sm">الخطة الحالية</p>
                  <p className="text-xl font-bold text-white mt-1">Enterprise</p>
                </div>
                <div className="p-4 bg-[#161b22] rounded-xl">
                  <p className="text-gray-400 text-sm">تاريخ الفاتورة القادمة</p>
                  <p className="text-xl font-bold text-white mt-1">١ أبريل ٢٠٢٤</p>
                </div>
              </div>

              <div className="p-4 bg-[#161b22] rounded-xl">
                <h3 className="text-white font-medium mb-4">آخر الفواتير</h3>
                <div className="space-y-3">
                  {[
                    { date: '١ مارس ٢٠٢٤', amount: '٤,٩٠٠ ر.س', status: 'مدفوعة' },
                    { date: '١ فبراير ٢٠٢٤', amount: '٤,٩٠٠ ر.س', status: 'مدفوعة' },
                    { date: '١ يناير ٢٠٢٤', amount: '٤,٩٠٠ ر.س', status: 'مدفوعة' },
                  ].map((invoice, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#0D1117] rounded-lg">
                      <span className="text-gray-400">{invoice.date}</span>
                      <span className="text-white">{invoice.amount}</span>
                      <span className="text-green-500 text-sm">{invoice.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Team */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">أعضاء الفريق</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium transition-all">
                  <Users className="w-4 h-4" />
                  إضافة عضو
                </button>
              </div>
              
              <div className="space-y-3">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[#161b22] rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-orange-600/20 flex items-center justify-center">
                        <span className="text-primary font-bold">{member.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-gray-500 text-sm">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-[#21262d] rounded-full text-gray-400 text-sm">{member.role}</span>
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
