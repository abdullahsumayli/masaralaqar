'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Clock, Loader, Search, Filter } from 'lucide-react'
import { getAllBankTransfers, verifyBankTransfer, type BankTransfer } from '@/lib/payments'
import { getCurrentUser, getUserProfile } from '@/lib/auth'

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<BankTransfer[]>([])
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPayment, setSelectedPayment] = useState<BankTransfer | null>(null)
  const [verifyNotes, setVerifyNotes] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return

        const profile = await getUserProfile(currentUser.id)
        if (profile?.role !== 'admin') return

        setUser(currentUser)

        // Load payments
        const statusFilter = filter === 'all' ? undefined : filter
        const { data } = await getAllBankTransfers(statusFilter, 50)
        setPayments(data)
      } catch (error) {
        console.error('Error loading payments:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [filter])

  const handleVerifyPayment = async (paymentId: string, verified: boolean) => {
    setVerifying(paymentId)
    try {
      await verifyBankTransfer(paymentId, verified, user.id, verifyNotes)

      // Remove from list or update status
      setPayments(prev =>
        prev.map(p =>
          p.id === paymentId
            ? { ...p, status: verified ? 'verified' : 'rejected' }
            : p
        )
      )

      setSelectedPayment(null)
      setVerifyNotes('')
    } catch (error) {
      console.error('Error verifying payment:', error)
    } finally {
      setVerifying(null)
    }
  }

  const filteredPayments = payments.filter(p =>
    p.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const statusBadges = {
    pending: { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400', label: 'قيد الانتظار' },
    verified: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400', label: 'تم التحقق' },
    rejected: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', label: 'مرفوض' },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white font-cairo mb-2">إدارة الدفعات</h1>
        <p className="text-gray-400">التحقق من التحويلات البنكية وتفعيل الاشتراكات</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'إجمالي الدفعات', value: payments.length, color: 'bg-blue-500/20 border-blue-500' },
          { label: 'قيد الانتظار', value: payments.filter(p => p.status === 'pending').length, color: 'bg-yellow-500/20 border-yellow-500' },
          { label: 'تم التحقق', value: payments.filter(p => p.status === 'verified').length, color: 'bg-green-500/20 border-green-500' },
          { label: 'مرفوض', value: payments.filter(p => p.status === 'rejected').length, color: 'bg-red-500/20 border-red-500' },
        ].map((stat, idx) => (
          <div key={idx} className={`border rounded-lg p-4 ${stat.color}`}>
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="ابحث برقم المرجع أو معرف المستخدم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg pr-10 pl-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'pending', 'verified', 'rejected'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-gray-400 hover:border-primary'
              }`}
            >
              {status === 'all' && 'الكل'}
              {status === 'pending' && 'قيد الانتظار'}
              {status === 'verified' && 'موثقة'}
              {status === 'rejected' && 'مرفوضة'}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">لا توجد دفعات</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => {
            const badge = statusBadges[payment.status as keyof typeof statusBadges]
            return (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-lg p-6 bg-surface ${badge.border} transition-all hover:shadow-lg`}
              >
                <div className="grid md:grid-cols-5 gap-4 items-center">
                  {/* Payment Info */}
                  <div>
                    <p className="text-gray-400 text-sm">رقم المرجع</p>
                    <p className="text-white font-mono text-sm">{payment.reference_number}</p>
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="text-gray-400 text-sm">المبلغ</p>
                    <p className="text-lg font-bold text-primary">{payment.amount_sar} ر.س</p>
                  </div>

                  {/* Plan */}
                  <div>
                    <p className="text-gray-400 text-sm">الخطة</p>
                    <p className="text-white font-semibold capitalize">{payment.plan_name}</p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-gray-400 text-sm">تاريخ التحويل</p>
                    <p className="text-white">{payment.transfer_date}</p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <div className={`px-3 py-1 rounded-lg ${badge.bg} border ${badge.border} text-center`}>
                      <p className={`text-xs font-semibold ${badge.text}`}>{badge.label}</p>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="mt-4 pt-4 border-t border-border/50 grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">البنك</p>
                    <p className="text-white">{payment.bank_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">رقم الحساب</p>
                    <p className="text-white font-mono">{payment.account_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">الحالة</p>
                    <p className={`${badge.text} font-semibold`}>{badge.label}</p>
                  </div>
                </div>

                {/* Action */}
                {payment.status === 'pending' && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      تأكيد الدفع
                    </button>
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      رفض
                    </button>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Verification Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-border rounded-2xl p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-white mb-4 font-cairo">
              {selectedPayment.status === 'pending' ? 'التحقق من الدفع' : 'تفاصيل الدفع'}
            </h2>

            {/* Details */}
            <div className="bg-background/50 p-4 rounded-lg mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">المرجع:</span>
                <span className="text-white font-mono">{selectedPayment.reference_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">المبلغ:</span>
                <span className="text-white">{selectedPayment.amount_sar} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">البنك:</span>
                <span className="text-white">{selectedPayment.bank_name}</span>
              </div>
            </div>

            {/* Notes Input */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">ملاحظات (اختياري)</label>
              <textarea
                value={verifyNotes}
                onChange={(e) => setVerifyNotes(e.target.value)}
                placeholder="أضف ملاحظات حول هذا الدفع"
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary resize-none h-20"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => handleVerifyPayment(selectedPayment.id, true)}
                disabled={verifying === selectedPayment.id}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {verifying === selectedPayment.id ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
                تأكيد
              </button>
              <button
                onClick={() => handleVerifyPayment(selectedPayment.id, false)}
                disabled={verifying === selectedPayment.id}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {verifying === selectedPayment.id ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <X className="w-5 h-5" />
                )}
                رفض
              </button>
              <button
                onClick={() => setSelectedPayment(null)}
                disabled={verifying === selectedPayment.id}
                className="flex-1 bg-surface border border-border hover:border-gray-600 text-white font-bold py-3 rounded-lg transition-all"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
