'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Eye, Loader, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, getUserProfile } from '@/lib/auth'
import type { Invoice } from '@/lib/payments'

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return

        const profile = await getUserProfile(currentUser.id)
        if (profile?.role !== 'admin') return

        setUser(currentUser)

        // Load invoices
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .order('issued_at', { ascending: false })

        if (error) throw error
        setInvoices(data || [])
      } catch (error) {
        console.error('Error loading invoices:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredInvoices = invoices.filter(i =>
    i.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const statusBadges = {
    draft: { bg: 'bg-gray-500/20', border: 'border-gray-500', text: 'text-gray-400', label: 'مسودة' },
    issued: { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400', label: 'صادرة' },
    paid: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400', label: 'مدفوعة' },
    overdue: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', label: 'متأخرة' },
  }

  const generatePDF = (invoice: Invoice) => {
    // Simple PDF generation (can be enhanced with a library like jsPDF)
    const content = `
      مسار العقار - فاتورة
      ========================
      رقم الفاتورة: ${invoice.invoice_number}
      التاريخ: ${new Date(invoice.issued_at).toLocaleDateString('ar-SA')}
      المبلغ: ${invoice.amount_sar} ريال سعودي
      الوصف: ${invoice.description || 'اشتراك في الخطة'}
      الحالة: ${statusBadges[invoice.status as keyof typeof statusBadges].label}
    `
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', `${invoice.invoice_number}.txt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white font-cairo mb-2">إدارة الفواتير</h1>
        <p className="text-gray-400">عرض وإدارة فواتير المشتركين</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'إجمالي الفواتير', value: invoices.length, color: 'bg-blue-500/20 border-blue-500' },
          { label: 'مدفوعة', value: invoices.filter(i => i.status === 'paid').length, color: 'bg-green-500/20 border-green-500' },
          { label: 'صادرة', value: invoices.filter(i => i.status === 'issued').length, color: 'bg-yellow-500/20 border-yellow-500' },
          { label: 'متأخرة', value: invoices.filter(i => i.status === 'overdue').length, color: 'bg-red-500/20 border-red-500' },
        ].map((stat, idx) => (
          <div key={idx} className={`border rounded-lg p-4 ${stat.color}`}>
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="ابحث برقم الفاتورة أو معرف المستخدم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg pr-10 pl-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Invoices Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">لا توجد فواتير</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => {
            const badge = statusBadges[invoice.status as keyof typeof statusBadges]
            return (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-lg p-6 bg-surface ${badge.border} transition-all hover:shadow-lg`}
              >
                <div className="grid md:grid-cols-5 gap-4 items-center">
                  {/* Invoice Number */}
                  <div>
                    <p className="text-gray-400 text-sm">رقم الفاتورة</p>
                    <p className="text-white font-mono font-bold">{invoice.invoice_number}</p>
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="text-gray-400 text-sm">المبلغ</p>
                    <p className="text-lg font-bold text-primary">{invoice.amount_sar} ر.س</p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-gray-400 text-sm">تاريخ الإصدار</p>
                    <p className="text-white">{new Date(invoice.issued_at).toLocaleDateString('ar-SA')}</p>
                  </div>

                  {/* Due Date */}
                  <div>
                    <p className="text-gray-400 text-sm">تاريخ الاستحقاق</p>
                    <p className="text-white">
                      {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('ar-SA') : 'غير محدد'}
                    </p>
                  </div>

                  {/* Status */}
                  <div className={`px-3 py-1 rounded-lg ${badge.bg} border ${badge.border} text-center`}>
                    <p className={`text-xs font-semibold ${badge.text}`}>{badge.label}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setSelectedInvoice(invoice)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary rounded-lg transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    عرض التفاصيل
                  </button>
                  <button
                    onClick={() => generatePDF(invoice)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500 rounded-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    تحميل
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-border rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="mb-6 pb-6 border-b border-border">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-white font-cairo">فاتورة</h2>
                  <p className="text-gray-400 text-lg">{selectedInvoice.invoice_number}</p>
                </div>
                <div className={`px-4 py-2 rounded-lg ${statusBadges[selectedInvoice.status as keyof typeof statusBadges].bg} border ${statusBadges[selectedInvoice.status as keyof typeof statusBadges].border}`}>
                  <p className={`${statusBadges[selectedInvoice.status as keyof typeof statusBadges].text} font-semibold`}>
                    {statusBadges[selectedInvoice.status as keyof typeof statusBadges].label}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Company Info */}
              <div>
                <h3 className="text-white font-semibold mb-2">شركتنا</h3>
                <div className="text-gray-400 text-sm">
                  <p>مسار العقار</p>
                  <p>نظام إدارة العقارات الحديث</p>
                  <p>المملكة العربية السعودية</p>
                </div>
              </div>

              {/* Details */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-white font-semibold mb-3">تفاصيل الفاتورة</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">رقم الفاتورة:</span>
                      <p className="text-white font-mono">{selectedInvoice.invoice_number}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">تاريخ الإصدار:</span>
                      <p className="text-white">{new Date(selectedInvoice.issued_at).toLocaleDateString('ar-SA')}</p>
                    </div>
                    {selectedInvoice.due_date && (
                      <div>
                        <span className="text-gray-400">تاريخ الاستحقاق:</span>
                        <p className="text-white">{new Date(selectedInvoice.due_date).toLocaleDateString('ar-SA')}</p>
                      </div>
                    )}
                    {selectedInvoice.paid_at && (
                      <div>
                        <span className="text-gray-400">تاريخ السداد:</span>
                        <p className="text-white">{new Date(selectedInvoice.paid_at).toLocaleDateString('ar-SA')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">المبلغ المستحق</p>
                  <p className="text-4xl font-bold text-primary">{selectedInvoice.amount_sar}</p>
                  <p className="text-gray-400 text-sm mt-2">ريال سعودي</p>
                </div>
              </div>

              {/* Description */}
              {selectedInvoice.description && (
                <div>
                  <h3 className="text-white font-semibold mb-3">الوصف</h3>
                  <p className="text-gray-400">{selectedInvoice.description}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => generatePDF(selectedInvoice)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all"
                >
                  <Download className="w-5 h-5" />
                  تحميل PDF
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="flex-1 bg-surface border border-border text-white font-bold py-3 rounded-lg transition-all hover:border-gray-500"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
