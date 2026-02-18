'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  HeadphonesIcon,
  ClipboardList,
  Zap,
  FileText,
  BookOpen,
  UserPlus,
  FolderOpen,
  Download
} from 'lucide-react'
import Link from 'next/link'

interface DashboardData {
  blogPosts: number
  libraryResources: number
  downloadLeads: number
  uploadedFiles: number
  newsletterSubscribers: number
  recentLeads: Array<{
    id: string
    name: string
    email: string
    resourceTitle?: string
    downloadedAt: string
  }>
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({
    blogPosts: 0,
    libraryResources: 0,
    downloadLeads: 0,
    uploadedFiles: 0,
    newsletterSubscribers: 0,
    recentLeads: []
  })

  useEffect(() => {
    // Load real data from localStorage
    const blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]')
    const libraryResources = JSON.parse(localStorage.getItem('libraryResources') || '[]')
    const downloadLeads = JSON.parse(localStorage.getItem('downloadLeads') || '[]')
    const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]')
    const newsletterSubscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]')

    setData({
      blogPosts: blogPosts.length,
      libraryResources: libraryResources.length,
      downloadLeads: downloadLeads.length,
      uploadedFiles: uploadedFiles.length,
      newsletterSubscribers: newsletterSubscribers.length,
      recentLeads: downloadLeads.slice(-5).reverse()
    })
  }, [])

  const stats = [
    {
      title: 'العملاء المحتملون',
      value: data.downloadLeads,
      description: 'المسجلين للتحميل',
      icon: UserPlus,
      color: 'from-green-500 to-green-600',
      href: '/admin/leads'
    },
    {
      title: 'مقالات المدونة',
      value: data.blogPosts,
      description: 'مقال منشور',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      href: '/admin/blog'
    },
    {
      title: 'موارد المكتبة',
      value: data.libraryResources,
      description: 'كتاب ودورة وقالب',
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      href: '/admin/library'
    },
    {
      title: 'الملفات المرفوعة',
      value: data.uploadedFiles,
      description: 'ملف في مدير الملفات',
      icon: FolderOpen,
      color: 'from-primary to-orange-600',
      href: '/admin/media'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-cairo">مرحباً، مدير النظام</h1>
          <p className="text-gray-400 mt-1">إليك نظرة عامة على مسار العقار</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Link 
            key={index}
            href={stat.href}
            className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-5 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm">{stat.title}</h3>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            <p className="text-gray-500 text-xs mt-2">{stat.description}</p>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl">
          <div className="flex items-center justify-between p-5 border-b border-[#21262d]">
            <h2 className="text-lg font-bold text-white">أحدث العملاء المحتملين</h2>
            <Link href="/admin/leads" className="text-primary text-sm hover:underline">
              عرض الكل
            </Link>
          </div>
          <div className="p-5">
            {data.recentLeads.length === 0 ? (
              <div className="text-center py-8">
                <UserPlus className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">لا يوجد عملاء بعد</p>
                <p className="text-gray-500 text-sm mt-1">العملاء الذين يسجلون للتحميل سيظهرون هنا</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.recentLeads.map((lead, index) => (
                  <div 
                    key={lead.id || index}
                    className="flex items-center justify-between p-4 bg-[#161b22] rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-orange-600/20 flex items-center justify-center">
                        <span className="text-primary font-bold">{lead.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{lead.name}</h3>
                        <p className="text-gray-500 text-sm">{lead.email}</p>
                      </div>
                    </div>
                    {lead.resourceTitle && (
                      <span className="px-3 py-1 bg-[#21262d] rounded-full text-xs text-gray-400 hidden md:block truncate max-w-[150px]">
                        {lead.resourceTitle}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Newsletter Subscribers */}
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl">
          <div className="flex items-center justify-between p-5 border-b border-[#21262d]">
            <h2 className="text-lg font-bold text-white">مشتركو النشرة البريدية</h2>
          </div>
          <div className="p-5">
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-white mb-2">{data.newsletterSubscribers}</p>
              <p className="text-gray-400">مشترك في النشرة البريدية</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-primary/10 to-orange-600/5 border border-primary/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6 text-primary" />
          <h2 className="text-lg font-bold text-white">إجراءات سريعة</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            href="/admin/blog" 
            className="flex items-center gap-3 p-4 bg-[#0D1117] rounded-xl hover:bg-[#161b22] border border-[#21262d] transition-all"
          >
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-white text-sm">إضافة مقال</span>
          </Link>
          <Link 
            href="/admin/library" 
            className="flex items-center gap-3 p-4 bg-[#0D1117] rounded-xl hover:bg-[#161b22] border border-[#21262d] transition-all"
          >
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-white text-sm">إضافة مورد</span>
          </Link>
          <Link 
            href="/admin/media" 
            className="flex items-center gap-3 p-4 bg-[#0D1117] rounded-xl hover:bg-[#161b22] border border-[#21262d] transition-all"
          >
            <FolderOpen className="w-5 h-5 text-primary" />
            <span className="text-white text-sm">رفع ملف</span>
          </Link>
          <Link 
            href="/admin/leads" 
            className="flex items-center gap-3 p-4 bg-[#0D1117] rounded-xl hover:bg-[#161b22] border border-[#21262d] transition-all"
          >
            <UserPlus className="w-5 h-5 text-primary" />
            <span className="text-white text-sm">العملاء المحتملون</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
