'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Upload, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Trash2, 
  Download, 
  Copy, 
  Check,
  Image as ImageIcon,
  File,
  FileText,
  Video,
  Music,
  Archive,
  X,
  ExternalLink,
  Eye,
  Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: string
}

function getFileIcon(type: string) {
  if (type.startsWith('image')) return ImageIcon
  if (type.startsWith('video')) return Video
  if (type.startsWith('audio')) return Music
  if (type.includes('pdf')) return FileText
  if (type.includes('zip') || type.includes('rar')) return Archive
  return File
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load files from localStorage
  useEffect(() => {
    const savedFiles = localStorage.getItem('uploadedFiles')
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles))
    }
  }, [])

  // Filter files
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || file.type.startsWith(filterType) || file.type.includes(filterType)
    return matchesSearch && matchesType
  })

  // Handle file upload
  const processFile = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 100)

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const uploadedFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: base64,
        uploadedAt: new Date().toISOString(),
      }

      const newFiles = [uploadedFile, ...files]
      setFiles(newFiles)
      localStorage.setItem('uploadedFiles', JSON.stringify(newFiles))

      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 500)
    } catch {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    selectedFiles.forEach(processFile)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    droppedFiles.forEach(processFile)
  }

  // Delete file
  const handleDelete = (id: string) => {
    const newFiles = files.filter(f => f.id !== id)
    setFiles(newFiles)
    localStorage.setItem('uploadedFiles', JSON.stringify(newFiles))
    setShowDeleteConfirm(null)
    setSelectedFile(null)
  }

  // Copy URL
  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Download file
  const handleDownload = (file: UploadedFile) => {
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name
    link.click()
  }

  // Get stats
  const stats = {
    total: files.length,
    images: files.filter(f => f.type.startsWith('image')).length,
    documents: files.filter(f => f.type.includes('pdf') || f.type.includes('doc')).length,
    videos: files.filter(f => f.type.startsWith('video')).length,
    totalSize: files.reduce((sum, f) => sum + f.size, 0)
  }

  return (
    <div 
      className="space-y-6"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary/10 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-[#0D1117] border-2 border-dashed border-primary rounded-2xl p-12 text-center">
              <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
              <p className="text-xl font-bold text-white">اسحب الملفات هنا</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-cairo">مدير الملفات</h1>
          <p className="text-gray-400 mt-1">إدارة جميع الملفات المرفوعة</p>
        </div>
        <button 
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all"
        >
          <Upload className="w-5 h-5" />
          رفع ملف
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#0D1117] border border-primary/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="text-white">جاري رفع الملف...</span>
              <span className="text-gray-400 mr-auto">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-[#21262d] rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4">
          <p className="text-gray-400 text-sm">إجمالي الملفات</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#0D1117] border border-blue-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">صور</p>
          <p className="text-2xl font-bold text-blue-500 mt-1">{stats.images}</p>
        </div>
        <div className="bg-[#0D1117] border border-purple-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">مستندات</p>
          <p className="text-2xl font-bold text-purple-500 mt-1">{stats.documents}</p>
        </div>
        <div className="bg-[#0D1117] border border-orange-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">فيديو</p>
          <p className="text-2xl font-bold text-orange-500 mt-1">{stats.videos}</p>
        </div>
        <div className="bg-[#0D1117] border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">الحجم الإجمالي</p>
          <p className="text-2xl font-bold text-green-500 mt-1">{formatFileSize(stats.totalSize)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="ابحث في الملفات..."
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
          <option value="image">صور</option>
          <option value="video">فيديو</option>
          <option value="audio">صوت</option>
          <option value="pdf">PDF</option>
          <option value="application">ملفات أخرى</option>
        </select>
        <div className="flex items-center gap-1 bg-[#161b22] border border-[#21262d] rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Files Grid/List */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-16 bg-[#0D1117] border border-[#21262d] rounded-2xl">
          <File className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">لا توجد ملفات</p>
          <p className="text-gray-500 text-sm mb-6">ابدأ برفع ملفاتك الآن</p>
          <button 
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all"
          >
            <Upload className="w-5 h-5" />
            رفع ملف
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredFiles.map((file) => {
            const FileIcon = getFileIcon(file.type)
            const isImage = file.type.startsWith('image')

            return (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setSelectedFile(file)}
                className="bg-[#0D1117] border border-[#21262d] rounded-xl overflow-hidden hover:border-primary/30 cursor-pointer transition-all group relative"
              >
                <div className="aspect-square bg-[#161b22] flex items-center justify-center overflow-hidden">
                  {isImage ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  ) : (
                    <FileIcon className="w-12 h-12 text-gray-500" />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-white text-sm truncate">{file.name}</p>
                  <p className="text-gray-500 text-xs">{formatFileSize(file.size)}</p>
                </div>
                {/* Quick Actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCopyUrl(file.id, file.url); }}
                    className="w-7 h-7 rounded-lg bg-[#0D1117]/90 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedId === file.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(file.id); }}
                    className="w-7 h-7 rounded-lg bg-[#0D1117]/90 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#21262d]">
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">الملف</th>
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">النوع</th>
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">الحجم</th>
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">التاريخ</th>
                <th className="text-center px-6 py-4 text-gray-400 text-sm font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => {
                const FileIcon = getFileIcon(file.type)

                return (
                  <tr 
                    key={file.id} 
                    onClick={() => setSelectedFile(file)}
                    className="border-b border-[#21262d]/50 hover:bg-[#161b22] cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#161b22] flex items-center justify-center">
                          {file.type.startsWith('image') ? (
                            <img src={file.url} alt="" className="w-full h-full rounded-lg object-cover" />
                          ) : (
                            <FileIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <span className="text-white truncate max-w-[200px]">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-[#21262d] rounded-full text-gray-400 text-xs">
                        {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{formatFileSize(file.size)}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{formatDate(file.uploadedAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDownload(file); }}
                          className="w-8 h-8 rounded-lg hover:bg-[#21262d] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCopyUrl(file.id, file.url); }}
                          className="w-8 h-8 rounded-lg hover:bg-[#21262d] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                        >
                          {copiedId === file.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(file.id); }}
                          className="w-8 h-8 rounded-lg hover:bg-[#21262d] flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* File Preview Modal */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedFile(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0D1117] border border-[#21262d] rounded-2xl w-full max-w-2xl"
            >
              <div className="border-b border-[#21262d] p-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white truncate">{selectedFile.name}</h2>
                <button 
                  onClick={() => setSelectedFile(null)}
                  className="w-8 h-8 rounded-lg hover:bg-[#21262d] flex items-center justify-center text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {/* Preview */}
                {selectedFile.type.startsWith('image') ? (
                  <img 
                    src={selectedFile.url} 
                    alt={selectedFile.name} 
                    className="w-full max-h-[400px] object-contain rounded-xl bg-[#161b22] mb-4"
                  />
                ) : selectedFile.type.startsWith('video') ? (
                  <video 
                    src={selectedFile.url} 
                    controls 
                    className="w-full max-h-[400px] rounded-xl bg-[#161b22] mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-[#161b22] rounded-xl flex items-center justify-center mb-4">
                    {(() => {
                      const FileIcon = getFileIcon(selectedFile.type)
                      return <FileIcon className="w-20 h-20 text-gray-500" />
                    })()}
                  </div>
                )}

                {/* File Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#161b22] rounded-xl p-3">
                    <p className="text-gray-400 text-xs mb-1">النوع</p>
                    <p className="text-white text-sm">{selectedFile.type || 'غير معروف'}</p>
                  </div>
                  <div className="bg-[#161b22] rounded-xl p-3">
                    <p className="text-gray-400 text-xs mb-1">الحجم</p>
                    <p className="text-white text-sm">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <div className="bg-[#161b22] rounded-xl p-3 col-span-2">
                    <p className="text-gray-400 text-xs mb-1">تاريخ الرفع</p>
                    <p className="text-white text-sm">{formatDate(selectedFile.uploadedAt)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDownload(selectedFile)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#161b22] hover:bg-[#21262d] text-white rounded-xl transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    تحميل
                  </button>
                  <button
                    onClick={() => handleCopyUrl(selectedFile.id, selectedFile.url)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#161b22] hover:bg-[#21262d] text-white rounded-xl transition-colors"
                  >
                    {copiedId === selectedFile.id ? (
                      <>
                        <Check className="w-5 h-5 text-green-500" />
                        تم النسخ
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        نسخ الرابط
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(selectedFile.id)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <h3 className="text-xl font-bold text-white mb-2">حذف الملف</h3>
                <p className="text-gray-400 mb-6">هل أنت متأكد من حذف هذا الملف؟ لا يمكن التراجع عن هذا الإجراء.</p>
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
