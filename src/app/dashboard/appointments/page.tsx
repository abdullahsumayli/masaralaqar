'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  MoreVertical
} from 'lucide-react'

const appointments = [
  { 
    id: 1, 
    client: 'محمد أحمد العتيبي', 
    phone: '0501234567',
    property: 'شقة 3 غرف - الملقا', 
    address: 'حي الملقا، شارع الأمير سلطان',
    date: '17 فبراير 2026',
    time: '10:00 ص',
    status: 'مؤكد',
    notes: 'العميل يفضل الطابق العلوي'
  },
  { 
    id: 2, 
    client: 'سارة علي المطيري', 
    phone: '0559876543',
    property: 'فيلا دوبلكس - النرجس', 
    address: 'حي النرجس، شارع الأمير فيصل',
    date: '17 فبراير 2026',
    time: '02:00 م',
    status: 'مؤكد',
    notes: ''
  },
  { 
    id: 3, 
    client: 'فهد خالد السبيعي', 
    phone: '0541112233',
    property: 'أرض 500م - العارض', 
    address: 'حي العارض، بجوار مسجد الراجحي',
    date: '18 فبراير 2026',
    time: '11:30 ص',
    status: 'قيد الانتظار',
    notes: 'بحاجة لتأكيد من المالك'
  },
  { 
    id: 4, 
    client: 'نورة محمد الدوسري', 
    phone: '0567778899',
    property: 'دوبلكس - الياسمين', 
    address: 'حي الياسمين، شارع العليا',
    date: '18 فبراير 2026',
    time: '04:00 م',
    status: 'مؤكد',
    notes: ''
  },
  { 
    id: 5, 
    client: 'عبدالرحمن سعد', 
    phone: '0533445566',
    property: 'شقة مفروشة - الصحافة', 
    address: 'حي الصحافة، برج المملكة',
    date: '19 فبراير 2026',
    time: '09:00 ص',
    status: 'ملغي',
    notes: 'العميل طلب إلغاء الموعد'
  },
  { 
    id: 6, 
    client: 'ريم عبدالله', 
    phone: '0544556677',
    property: 'فيلا - حطين', 
    address: 'حي حطين، شارع التخصصي',
    date: '19 فبراير 2026',
    time: '03:00 م',
    status: 'مكتمل',
    notes: 'تمت المعاينة بنجاح، العميل مهتم'
  },
]

function getStatusStyle(status: string) {
  switch (status) {
    case 'مؤكد': return { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20', icon: CheckCircle }
    case 'قيد الانتظار': return { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/20', icon: AlertCircle }
    case 'ملغي': return { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20', icon: XCircle }
    case 'مكتمل': return { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', icon: CheckCircle }
    default: return { bg: 'bg-gray-500/10', text: 'text-gray-500', border: 'border-gray-500/20', icon: AlertCircle }
  }
}

export default function AppointmentsPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [showAddModal, setShowAddModal] = useState(false)

  const todayAppointments = appointments.filter(a => a.date === '17 فبراير 2026')
  const upcomingAppointments = appointments.filter(a => a.date !== '17 فبراير 2026' && a.status !== 'ملغي' && a.status !== 'مكتمل')

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">إدارة المعاينات</h1>
          <p className="text-text-secondary mt-1">جدولة ومتابعة معاينات العقارات</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface border border-border rounded-xl p-1">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'list' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'}`}
            >
              قائمة
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'calendar' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'}`}
            >
              تقويم
            </button>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary-dark text-white font-medium px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            جدولة معاينة
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">12</p>
              <p className="text-text-muted text-sm">معاينات اليوم</p>
            </div>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">8</p>
              <p className="text-text-muted text-sm">مؤكدة</p>
            </div>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">3</p>
              <p className="text-text-muted text-sm">قيد الانتظار</p>
            </div>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">45</p>
              <p className="text-text-muted text-sm">هذا الأسبوع</p>
            </div>
          </div>
        </div>
      </div>

      {view === 'list' ? (
        <>
          {/* Today's Appointments */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-primary/5">
              <h2 className="font-bold text-text-primary flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                معاينات اليوم - 17 فبراير 2026
              </h2>
            </div>
            <div className="divide-y divide-border">
              {todayAppointments.map((apt) => {
                const statusStyle = getStatusStyle(apt.status)
                return (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 hover:bg-background/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-primary/10 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold text-primary">{apt.time.split(':')[0]}</span>
                        <span className="text-xs text-primary">{apt.time.includes('ص') ? 'صباحاً' : 'مساءً'}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-text-primary">{apt.property}</h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {apt.client}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {apt.phone}
                              </span>
                            </div>
                            <p className="flex items-center gap-1 mt-2 text-sm text-text-muted">
                              <MapPin className="w-4 h-4" />
                              {apt.address}
                            </p>
                            {apt.notes && (
                              <p className="mt-2 text-sm text-text-secondary bg-background rounded-lg px-3 py-2">
                                📝 {apt.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                              {apt.status}
                            </span>
                            <button className="w-8 h-8 rounded-lg hover:bg-background flex items-center justify-center text-text-secondary">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-bold text-text-primary">المعاينات القادمة</h2>
            </div>
            <div className="divide-y divide-border">
              {upcomingAppointments.map((apt) => {
                const statusStyle = getStatusStyle(apt.status)
                return (
                  <div key={apt.id} className="p-6 hover:bg-background/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-surface border border-border flex flex-col items-center justify-center">
                        <span className="text-sm font-bold text-text-primary">{apt.date.split(' ')[0]}</span>
                        <span className="text-xs text-text-muted">{apt.date.split(' ')[1]}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-text-primary">{apt.property}</h3>
                        <p className="text-sm text-text-secondary">{apt.client} • {apt.time}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        /* Calendar View */
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <button className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-text-primary text-lg">فبراير 2026</h2>
            <button className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-text-muted py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 5 // Start from previous month
                const isCurrentMonth = day > 0 && day <= 28
                const hasAppointment = [17, 18, 19, 20, 22, 25].includes(day)
                const isToday = day === 17
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      isToday 
                        ? 'bg-primary text-white' 
                        : isCurrentMonth 
                          ? 'hover:bg-background text-text-primary' 
                          : 'text-text-muted/30'
                    }`}
                  >
                    <span className="text-sm font-medium">{day > 0 ? (day <= 28 ? day : day - 28) : 28 + day}</span>
                    {hasAppointment && isCurrentMonth && (
                      <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isToday ? 'bg-white' : 'bg-primary'}`}></span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-border rounded-2xl w-full max-w-lg"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-text-primary">جدولة معاينة جديدة</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-background flex items-center justify-center text-text-secondary"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">العميل</label>
                <select className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary">
                  <option>اختر عميل</option>
                  <option>محمد أحمد العتيبي</option>
                  <option>سارة علي المطيري</option>
                  <option>فهد خالد السبيعي</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">العقار</label>
                <input
                  type="text"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
                  placeholder="وصف العقار"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">التاريخ</label>
                  <input
                    type="date"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">الوقت</label>
                  <input
                    type="time"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">العنوان</label>
                <input
                  type="text"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
                  placeholder="عنوان العقار"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">ملاحظات</label>
                <textarea
                  rows={2}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary resize-none"
                  placeholder="أي ملاحظات..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-border flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2.5 border border-border rounded-xl text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors"
              >
                إلغاء
              </button>
              <button className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors">
                جدولة المعاينة
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
