'use client'

import { motion } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  TrendingUp,
  ArrowUpLeft,
  ArrowDownLeft,
  Eye,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

const stats = [
  {
    title: 'إجمالي العملاء',
    value: '1,245',
    change: '+12%',
    changeType: 'positive',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    title: 'المعاينات اليوم',
    value: '23',
    change: '+5',
    changeType: 'positive',
    icon: Calendar,
    color: 'bg-green-500',
  },
  {
    title: 'الرسائل الجديدة',
    value: '156',
    change: '-8%',
    changeType: 'negative',
    icon: MessageSquare,
    color: 'bg-purple-500',
  },
  {
    title: 'معدل التحويل',
    value: '24.5%',
    change: '+2.3%',
    changeType: 'positive',
    icon: TrendingUp,
    color: 'bg-primary',
  },
]

const recentClients = [
  { name: 'محمد أحمد العتيبي', phone: '0501234567', status: 'جاد', time: 'منذ 5 دقائق', interest: 'شقة في الملقا' },
  { name: 'سارة علي المطيري', phone: '0559876543', status: 'متابعة', time: 'منذ 15 دقيقة', interest: 'فيلا في النرجس' },
  { name: 'فهد خالد السبيعي', phone: '0541112233', status: 'جديد', time: 'منذ 30 دقيقة', interest: 'أرض تجارية' },
  { name: 'نورة محمد الدوسري', phone: '0567778899', status: 'جاد', time: 'منذ ساعة', interest: 'دوبلكس في الياسمين' },
  { name: 'عبدالرحمن سعد', phone: '0533445566', status: 'بارد', time: 'منذ ساعتين', interest: 'شقة مفروشة' },
]

const upcomingAppointments = [
  { client: 'محمد أحمد', property: 'شقة 3 غرف - الملقا', time: '10:00 ص', date: 'اليوم' },
  { client: 'سارة علي', property: 'فيلا دوبلكس - النرجس', time: '02:00 م', date: 'اليوم' },
  { client: 'فهد خالد', property: 'أرض 500م - العارض', time: '11:30 ص', date: 'غداً' },
  { client: 'نورة محمد', property: 'دوبلكس - الياسمين', time: '04:00 م', date: 'غداً' },
]

const recentMessages = [
  { name: 'أحمد محمد', message: 'هل الشقة متاحة للمعاينة غداً؟', time: '10:30 ص', unread: true },
  { name: 'فاطمة علي', message: 'شكراً لكم، سأتواصل معكم قريباً', time: '10:15 ص', unread: true },
  { name: 'خالد سعود', message: 'ما هو السعر النهائي للفيلا؟', time: '09:45 ص', unread: false },
  { name: 'منى أحمد', message: 'تم الاتفاق، متى نوقع العقد؟', time: '09:30 ص', unread: false },
]

function getStatusColor(status: string) {
  switch (status) {
    case 'جاد': return 'bg-green-500/10 text-green-500 border-green-500/20'
    case 'متابعة': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    case 'جديد': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    case 'بارد': return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  }
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">مرحباً، عبدالله 👋</h1>
          <p className="text-text-secondary mt-1">إليك نظرة عامة على أداء مكتبك اليوم</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary">
            <option>آخر 7 أيام</option>
            <option>آخر 30 يوم</option>
            <option>آخر 3 أشهر</option>
            <option>هذا العام</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.changeType === 'positive' ? (
                  <ArrowUpLeft className="w-4 h-4" />
                ) : (
                  <ArrowDownLeft className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-text-secondary text-sm mt-1">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Clients */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-text-primary">آخر العملاء</h2>
            <Link href="/dashboard/clients" className="text-primary text-sm hover:underline">
              عرض الكل
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right px-6 py-3 text-xs font-medium text-text-muted">العميل</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-text-muted">الاهتمام</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-text-muted">الحالة</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-text-muted">الوقت</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-text-muted">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {recentClients.map((client, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-text-primary text-sm">{client.name}</p>
                          <p className="text-text-muted text-xs">{client.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary text-sm">{client.interest}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-muted text-sm">{client.time}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center hover:bg-green-500/20 transition-colors">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500/20 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Appointments & Messages */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-bold text-text-primary">المعاينات القادمة</h2>
              <Link href="/dashboard/appointments" className="text-primary text-sm hover:underline">
                عرض الكل
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {upcomingAppointments.map((apt, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-background rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary text-sm truncate">{apt.property}</p>
                    <p className="text-text-muted text-xs">{apt.client}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-primary text-sm font-medium">{apt.time}</p>
                    <p className="text-text-muted text-xs">{apt.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-bold text-text-primary">آخر الرسائل</h2>
              <Link href="/dashboard/messages" className="text-primary text-sm hover:underline">
                عرض الكل
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {recentMessages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${msg.unread ? 'bg-primary/5' : 'bg-background'}`}>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {msg.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-text-primary text-sm">{msg.name}</p>
                      {msg.unread && <span className="w-2 h-2 rounded-full bg-primary"></span>}
                    </div>
                    <p className="text-text-secondary text-xs mt-1 truncate">{msg.message}</p>
                  </div>
                  <span className="text-text-muted text-xs whitespace-nowrap">{msg.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-2xl font-bold text-green-500">45</p>
            <p className="text-green-500/70 text-sm">صفقات مغلقة</p>
          </div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center gap-4">
          <AlertCircle className="w-8 h-8 text-yellow-500" />
          <div>
            <p className="text-2xl font-bold text-yellow-500">12</p>
            <p className="text-yellow-500/70 text-sm">قيد التفاوض</p>
          </div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center gap-4">
          <Eye className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-2xl font-bold text-blue-500">89</p>
            <p className="text-blue-500/70 text-sm">معاينات الشهر</p>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-4">
          <XCircle className="w-8 h-8 text-red-500" />
          <div>
            <p className="text-2xl font-bold text-red-500">8</p>
            <p className="text-red-500/70 text-sm">فرص ضائعة</p>
          </div>
        </div>
      </div>
    </div>
  )
}
