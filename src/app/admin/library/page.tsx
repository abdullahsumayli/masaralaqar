'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Eye,
  BookOpen,
  Video,
  FileSpreadsheet,
  Wrench,
  Save,
  X,
  Download,
  ExternalLink,
  Tag
} from 'lucide-react'
import Link from 'next/link'
import { FileUpload } from '@/components/admin/file-upload'

interface Resource {
  id: string
  title: string
  description: string
  type: 'book' | 'course' | 'template' | 'tool'
  category: string
  downloadUrl?: string
  externalUrl?: string
  published: boolean
  createdAt: string
}

// Initial resources data - empty array (start fresh)
const initialResources: Resource[] = []

const resourceTypes = [
  { value: 'book', label: 'كتاب', icon: BookOpen },
  { value: 'course', label: 'دورة', icon: Video },
  { value: 'template', label: 'قالب', icon: FileSpreadsheet },
  { value: 'tool', label: 'أداة', icon: Wrench },
]

const categories = ['أتمتة', 'ذكاء اصطناعي', 'إدارة', 'أدوات', 'مبيعات', 'تسويق', 'تحليل']

const typeConfig = {
  book: { label: 'كتاب', icon: BookOpen, color: 'bg-blue-500/10 text-blue-500' },
  course: { label: 'دورة', icon: Video, color: 'bg-purple-500/10 text-purple-500' },
  template: { label: 'قالب', icon: FileSpreadsheet, color: 'bg-green-500/10 text-green-500' },
  tool: { label: 'أداة', icon: Wrench, color: 'bg-orange-500/10 text-orange-500' },
}

export default function AdminLibraryPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [showEditor, setShowEditor] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  // Load resources from localStorage or use initial data
  useEffect(() => {
    const savedResources = localStorage.getItem('libraryResources')
    if (savedResources) {
      setResources(JSON.parse(savedResources))
    } else {
      setResources(initialResources)
      localStorage.setItem('libraryResources', JSON.stringify(initialResources))
    }
  }, [])

  // Save resources to localStorage
  const saveResources = (newResources: Resource[]) => {
    setResources(newResources)
    try {
      localStorage.setItem('libraryResources', JSON.stringify(newResources))
    } catch (err) {
      // localStorage full - try saving without large file data
      const lightResources = newResources.map(r => ({
        ...r,
        downloadUrl: r.downloadUrl?.startsWith('data:') ? '#uploaded' : r.downloadUrl
      }))
      try {
        localStorage.setItem('libraryResources', JSON.stringify(lightResources))
      } catch {
        console.warn('Could not save to localStorage')
      }
    }
  }

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.includes(searchQuery) || resource.description.includes(searchQuery)
    const matchesType = filterType === 'all' || resource.type === filterType
    return matchesSearch && matchesType
  })

  // Add new resource
  const handleAddResource = () => {
    setEditingResource({
      id: Date.now().toString(),
      title: '',
      description: '',
      type: 'book',
      category: categories[0],
      downloadUrl: '',
      externalUrl: '',
      published: false,
      createdAt: new Date().toISOString().split('T')[0],
    })
    setShowEditor(true)
  }

  // Edit resource
  const handleEditResource = (resource: Resource) => {
    setEditingResource({ ...resource })
    setShowEditor(true)
  }

  // Save resource
  const handleSaveResource = () => {
    if (!editingResource) return

    const existingIndex = resources.findIndex(r => r.id === editingResource.id)
    let newResources: Resource[]

    if (existingIndex >= 0) {
      newResources = [...resources]
      newResources[existingIndex] = editingResource
    } else {
      newResources = [editingResource, ...resources]
    }

    saveResources(newResources)
    setShowEditor(false)
    setEditingResource(null)
  }

  // Delete resource
  const handleDeleteResource = (id: string) => {
    const newResources = resources.filter(r => r.id !== id)
    saveResources(newResources)
    setShowDeleteConfirm(null)
  }

  // Toggle publish status
  const togglePublish = (id: string) => {
    const newResources = resources.map(r => 
      r.id === id ? { ...r, published: !r.published } : r
    )
    saveResources(newResources)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-cairo">إدارة المكتبة</h1>
          <p className="text-gray-400 mt-1">إضافة وتعديل وحذف موارد المكتبة</p>
        </div>
        <button 
          onClick={handleAddResource}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all"
        >
          <Plus className="w-5 h-5" />
          مورد جديد
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4">
          <p className="text-gray-400 text-sm">إجمالي الموارد</p>
          <p className="text-2xl font-bold text-white mt-1">{resources.length}</p>
        </div>
        <div className="bg-[#0D1117] border border-blue-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">كتب</p>
          <p className="text-2xl font-bold text-blue-500 mt-1">{resources.filter(r => r.type === 'book').length}</p>
        </div>
        <div className="bg-[#0D1117] border border-purple-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">دورات</p>
          <p className="text-2xl font-bold text-purple-500 mt-1">{resources.filter(r => r.type === 'course').length}</p>
        </div>
        <div className="bg-[#0D1117] border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">قوالب</p>
          <p className="text-2xl font-bold text-green-500 mt-1">{resources.filter(r => r.type === 'template').length}</p>
        </div>
        <div className="bg-[#0D1117] border border-orange-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">أدوات</p>
          <p className="text-2xl font-bold text-orange-500 mt-1">{resources.filter(r => r.type === 'tool').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="ابحث في الموارد..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161b22] border border-[#21262d] rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
        >
          <option value="all">جميع الأنواع</option>
          {resourceTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource) => {
          const config = typeConfig[resource.type]
          const TypeIcon = config.icon

          return (
            <div 
              key={resource.id}
              className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-5 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center`}>
                  <TypeIcon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => togglePublish(resource.id)}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      resource.published 
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}
                  >
                    {resource.published ? 'منشور' : 'مسودة'}
                  </button>
                </div>
              </div>

              <h3 className="font-medium text-white mb-2 line-clamp-1">{resource.title}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{resource.description}</p>

              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-[#21262d] rounded-full text-gray-400 text-xs">{config.label}</span>
                <span className="px-2 py-1 bg-[#21262d] rounded-full text-gray-400 text-xs">{resource.category}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#21262d]">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  {resource.downloadUrl ? (
                    <span className="flex items-center gap-1"><Download className="w-3 h-3" /> تحميل</span>
                  ) : (
                    <span className="flex items-center gap-1"><ExternalLink className="w-3 h-3" /> رابط خارجي</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleEditResource(resource)}
                    className="w-8 h-8 rounded-lg hover:bg-[#21262d] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(resource.id)}
                    className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">لا توجد موارد</p>
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && editingResource && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D1117] border-b border-[#21262d] p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {resources.find(r => r.id === editingResource.id) ? 'تعديل المورد' : 'مورد جديد'}
              </h2>
              <button 
                onClick={() => { setShowEditor(false); setEditingResource(null); }}
                className="w-8 h-8 rounded-lg hover:bg-[#21262d] flex items-center justify-center text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">العنوان *</label>
                <input
                  type="text"
                  value={editingResource.title}
                  onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                  className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  placeholder="أدخل عنوان المورد"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">الوصف *</label>
                <textarea
                  value={editingResource.description}
                  onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
                  rows={3}
                  className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none"
                  placeholder="وصف مختصر للمورد"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Type */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">النوع</label>
                  <select
                    value={editingResource.type}
                    onChange={(e) => setEditingResource({ ...editingResource, type: e.target.value as Resource['type'] })}
                    className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  >
                    {resourceTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">التصنيف</label>
                  <select
                    value={editingResource.category}
                    onChange={(e) => setEditingResource({ ...editingResource, category: e.target.value })}
                    className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Download URL */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">رابط التحميل</label>
                <input
                  type="url"
                  value={editingResource.downloadUrl || ''}
                  onChange={(e) => setEditingResource({ ...editingResource, downloadUrl: e.target.value })}
                  className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  placeholder="https://..."
                  dir="ltr"
                />
              </div>

              {/* File Upload */}
              <div>
                <FileUpload
                  label="رفع ملف المورد"
                  description="ارفع أي ملف من جهازك"
                  accept="*/*"
                  maxSize={100}
                  onUpload={(file) => setEditingResource({ ...editingResource, downloadUrl: file.url })}
                />
                {editingResource.downloadUrl && editingResource.downloadUrl.startsWith('data:') && (
                  <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <p className="text-green-500 text-sm flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      تم رفع الملف بنجاح
                    </p>
                  </div>
                )}
              </div>

              {/* External URL */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">رابط خارجي</label>
                <input
                  type="url"
                  value={editingResource.externalUrl || ''}
                  onChange={(e) => setEditingResource({ ...editingResource, externalUrl: e.target.value })}
                  className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  placeholder="https://..."
                  dir="ltr"
                />
              </div>

              {/* Published */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={editingResource.published}
                    onChange={(e) => setEditingResource({ ...editingResource, published: e.target.checked })}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-[#21262d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
                <span className="text-white">نشر المورد</span>
              </div>
            </div>

            <div className="sticky bottom-0 bg-[#0D1117] border-t border-[#21262d] p-4 flex items-center justify-end gap-3">
              <button 
                onClick={() => { setShowEditor(false); setEditingResource(null); }}
                className="px-6 py-2.5 bg-[#161b22] border border-[#21262d] text-gray-400 rounded-xl hover:text-white transition-colors"
              >
                إلغاء
              </button>
              <button 
                onClick={handleSaveResource}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all"
              >
                <Save className="w-5 h-5" />
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">حذف المورد</h3>
              <p className="text-gray-400 mb-6">هل أنت متأكد من حذف هذا المورد؟ لا يمكن التراجع عن هذا الإجراء.</p>
              <div className="flex items-center justify-center gap-3">
                <button 
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-6 py-2.5 bg-[#161b22] border border-[#21262d] text-gray-400 rounded-xl hover:text-white transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  onClick={() => handleDeleteResource(showDeleteConfirm)}
                  className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
