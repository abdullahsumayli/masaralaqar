'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Download, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  FileText,
  Filter,
  RefreshCw,
  Copy,
  Check,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface DownloadLead {
  id: string
  name: string
  email: string
  phone: string
  resourceId?: string
  resourceTitle?: string
  downloadedAt: string
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<DownloadLead[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])

  // Load leads from localStorage
  useEffect(() => {
    const savedLeads = localStorage.getItem('downloadLeads')
    if (savedLeads) {
      setLeads(JSON.parse(savedLeads))
    }
  }, [])

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const searchLower = searchQuery.toLowerCase()
    return (
      lead.name.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower) ||
      lead.phone.includes(searchQuery) ||
      (lead.resourceTitle && lead.resourceTitle.includes(searchQuery))
    )
  })

  // Delete lead
  const handleDelete = (id: string) => {
    const newLeads = leads.filter(l => l.id !== id)
    setLeads(newLeads)
    localStorage.setItem('downloadLeads', JSON.stringify(newLeads))
    setShowDeleteConfirm(null)
  }

  // Delete selected leads
  const handleDeleteSelected = () => {
    const newLeads = leads.filter(l => !selectedLeads.includes(l.id))
    setLeads(newLeads)
    localStorage.setItem('downloadLeads', JSON.stringify(newLeads))
    setSelectedLeads([])
  }

  // Copy to clipboard
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['الاسم', 'البريد الإلكتروني', 'رقم الجوال', 'المورد', 'تاريخ التحميل']
    const rows = leads.map(lead => [
      lead.name,
      lead.email,
      lead.phone,
      lead.resourceTitle || '-',
      new Date(lead.downloadedAt).toLocaleDateString('ar-SA')
    ])
    
    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n')
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `leads_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([])
    } else {
      setSelectedLeads(filteredLeads.map(l => l.id))
    }
  }

  // Toggle select lead
  const toggleSelectLead = (id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  // Refresh data
  const handleRefresh = () => {
    const savedLeads = localStorage.getItem('downloadLeads')
    if (savedLeads) {
      setLeads(JSON.parse(savedLeads))
    }
  }

  // Get unique resources
  const uniqueResources = [...new Set(leads.map(l => l.resourceTitle).filter(Boolean))]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-cairo">العملاء المحتملون</h1>
          <p className="text-gray-400 mt-1">قائمة المسجلين لتحميل الموارد المجانية</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border border-[#21262d] text-gray-400 rounded-xl hover:text-white transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            تحديث
          </button>
          <button 
            onClick={handleExportCSV}
            disabled={leads.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white rounded-xl font-medium transition-all"
          >
            <Download className="w-5 h-5" />
            تصدير CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">إجمالي العملاء</p>
              <p className="text-2xl font-bold text-white">{leads.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#0D1117] border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">اليوم</p>
              <p className="text-2xl font-bold text-green-500">
                {leads.filter(l => 
                  new Date(l.downloadedAt).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#0D1117] border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">إيميلات فريدة</p>
              <p className="text-2xl font-bold text-blue-500">
                {new Set(leads.map(l => l.email)).size}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#0D1117] border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">موارد محمّلة</p>
              <p className="text-2xl font-bold text-purple-500">{uniqueResources.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="ابحث بالاسم، الإيميل، أو الجوال..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161b22] border border-[#21262d] rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        
        {selectedLeads.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            حذف المحدد ({selectedLeads.length})
          </button>
        )}
      </div>

      {/* Leads Table */}
      {filteredLeads.length === 0 ? (
        <div className="text-center py-16 bg-[#0D1117] border border-[#21262d] rounded-2xl">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">لا يوجد عملاء محتملون</p>
          <p className="text-gray-500 text-sm">العملاء الذين يسجلون لتحميل الموارد سيظهرون هنا</p>
        </div>
      ) : (
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#21262d]">
                  <th className="text-right px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedLeads.length === filteredLeads.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded bg-[#161b22] border-[#21262d] text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">العميل</th>
                  <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">التواصل</th>
                  <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">المورد</th>
                  <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">التاريخ</th>
                  <th className="text-center px-6 py-4 text-gray-400 text-sm font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="border-b border-[#21262d]/50 hover:bg-[#161b22] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => toggleSelectLead(lead.id)}
                        className="w-4 h-4 rounded bg-[#161b22] border-[#21262d] text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-orange-600/20 flex items-center justify-center">
                          <span className="text-primary font-bold">
                            {lead.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{lead.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <button
                          onClick={() => handleCopy(lead.email, `email-${lead.id}`)}
                          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                        >
                          <Mail className="w-4 h-4" />
                          <span dir="ltr">{lead.email}</span>
                          {copiedId === `email-${lead.id}` ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3 opacity-50" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopy(lead.phone, `phone-${lead.id}`)}
                          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                        >
                          <Phone className="w-4 h-4" />
                          <span dir="ltr">{lead.phone}</span>
                          {copiedId === `phone-${lead.id}` ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3 opacity-50" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {lead.resourceTitle ? (
                        <span className="px-3 py-1 bg-[#21262d] rounded-full text-gray-400 text-xs line-clamp-1">
                          {lead.resourceTitle}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm">{formatDate(lead.downloadedAt)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={`mailto:${lead.email}`}
                          className="w-8 h-8 rounded-lg hover:bg-[#21262d] flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        <a
                          href={`https://wa.me/${lead.phone.replace(/^0/, '966')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg hover:bg-[#21262d] flex items-center justify-center text-gray-400 hover:text-green-500 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => setShowDeleteConfirm(lead.id)}
                          className="w-8 h-8 rounded-lg hover:bg-[#21262d] flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">حذف العميل</h3>
                <p className="text-gray-400 mb-6">هل أنت متأكد من حذف هذا العميل؟</p>
                <div className="flex items-center justify-center gap-3">
                  <button 
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-6 py-2.5 bg-[#161b22] border border-[#21262d] text-gray-400 rounded-xl hover:text-white transition-colors"
                  >
                    إلغاء
                  </button>
                  <button 
                    onClick={() => handleDelete(showDeleteConfirm)}
                    className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
