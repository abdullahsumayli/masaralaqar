'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, File, Image as ImageIcon, FileText, Video, Music, Archive, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: string
}

interface FileUploadProps {
  onUpload: (file: UploadedFile) => void
  accept?: string
  maxSize?: number // in MB
  label?: string
  description?: string
  multiple?: boolean
}

const fileTypeIcons: Record<string, typeof File> = {
  'image': ImageIcon,
  'video': Video,
  'audio': Music,
  'application/pdf': FileText,
  'application/zip': Archive,
  'application/x-rar': Archive,
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

export function FileUpload({
  onUpload,
  accept = '*/*',
  maxSize = 100, // 100MB default
  label = 'رفع ملف',
  description = 'اسحب الملف هنا أو اضغط للاختيار',
  multiple = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const processFile = async (file: File) => {
    setError(null)
    
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`حجم الملف يجب أن يكون أقل من ${maxSize}MB`)
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 100)

      let base64: string

      // Compress images before converting to base64
      if (file.type && file.type.startsWith('image')) {
        base64 = await compressImage(file, 500, 0.4)
      } else {
        // Convert to base64 for localStorage storage
        base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = () => reject(new Error('فشل في قراءة الملف'))
          reader.readAsDataURL(file)
        })
      }

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Create uploaded file object
      const uploadedFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        url: base64,
        uploadedAt: new Date().toISOString(),
      }

      // Skip saving to uploadedFiles to save space
      // Just return the file for immediate use

      // Set preview for images
      if (file.type && file.type.startsWith('image')) {
        setPreview(base64)
      }

      onUpload(uploadedFile)

      // Reset after a short delay
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
        setError(null)
      }, 500)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ أثناء رفع الملف'
      setError(errorMessage)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // Compress image to reduce size for localStorage
  const compressImage = (file: File, maxWidth: number, quality: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = document.createElement('img')
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // Scale down if needed
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('فشل في ضغط الصورة'))
            return
          }

          ctx.drawImage(img, 0, 0, width, height)
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
          resolve(compressedBase64)
        }
        img.onerror = () => reject(new Error('فشل في قراءة الصورة'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('فشل في قراءة الملف'))
      reader.readAsDataURL(file)
    })
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      if (multiple) {
        files.forEach(processFile)
      } else {
        processFile(files[0])
      }
    }
  }, [multiple, maxSize, onUpload])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      if (multiple) {
        files.forEach(processFile)
      } else {
        processFile(files[0])
      }
    }
  }

  const clearPreview = () => {
    setPreview(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-gray-400 text-sm mb-2">{label}</label>
      
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-[#21262d] hover:border-primary/50 bg-[#161b22]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
            <p className="text-white">جاري الرفع...</p>
            <div className="w-full bg-[#21262d] rounded-full h-2 max-w-xs mx-auto">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-gray-500 text-sm">{uploadProgress}%</p>
          </div>
        ) : (
          <>
            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-primary' : 'text-gray-500'}`} />
            <p className="text-white mb-2">{description}</p>
            <p className="text-gray-500 text-sm">الحد الأقصى للحجم: {maxSize}MB</p>
          </>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative inline-block"
          >
            <img 
              src={preview} 
              alt="Preview" 
              className="max-w-xs max-h-48 rounded-xl border border-[#21262d]"
            />
            <button
              onClick={(e) => { e.stopPropagation(); clearPreview(); }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// File Manager Component for viewing all uploaded files
export function FileManager({ onSelect }: { onSelect?: (file: UploadedFile) => void }) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')

  useState(() => {
    const savedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]')
    setFiles(savedFiles)
  })

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || file.type.startsWith(filterType)
    return matchesSearch && matchesType
  })

  const handleDelete = (id: string) => {
    const newFiles = files.filter(f => f.id !== id)
    setFiles(newFiles)
    localStorage.setItem('uploadedFiles', JSON.stringify(newFiles))
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="ابحث عن ملف..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
        >
          <option value="all">جميع الأنواع</option>
          <option value="image">صور</option>
          <option value="video">فيديو</option>
          <option value="application/pdf">PDF</option>
          <option value="application">ملفات أخرى</option>
        </select>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredFiles.map((file) => {
          const FileIcon = getFileIcon(file.type)
          const isImage = file.type.startsWith('image')

          return (
            <div
              key={file.id}
              onClick={() => onSelect?.(file)}
              className="bg-[#0D1117] border border-[#21262d] rounded-xl p-3 hover:border-primary/30 cursor-pointer transition-all group"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-[#161b22] flex items-center justify-center mb-2">
                {isImage ? (
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                ) : (
                  <FileIcon className="w-12 h-12 text-gray-500" />
                )}
              </div>
              <p className="text-white text-xs truncate">{file.name}</p>
              <p className="text-gray-500 text-xs">{formatFileSize(file.size)}</p>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }}
                className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <File className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">لا توجد ملفات مرفوعة</p>
        </div>
      )}
    </div>
  )
}
