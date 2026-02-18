'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Eye,
  Calendar,
  Clock,
  Tag,
  FileText,
  Save,
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'
import { FileUpload } from '@/components/admin/file-upload'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  date: string
  readingTime: number
  image?: string
  published: boolean
}

// Initial posts data - empty array (start fresh)
const initialPosts: BlogPost[] = []

const categories = ['استراتيجية', 'أتمتة', 'ذكاء اصطناعي', 'تقنية عقارية', 'تسويق', 'مبيعات']

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  // Load posts from localStorage or use initial data
  useEffect(() => {
    const savedPosts = localStorage.getItem('blogPosts')
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    } else {
      setPosts(initialPosts)
      localStorage.setItem('blogPosts', JSON.stringify(initialPosts))
    }
  }, [])

  // Save posts to localStorage
  const savePosts = (newPosts: BlogPost[]) => {
    setPosts(newPosts)
    try {
      // First try to clear space by removing uploadedFiles
      localStorage.removeItem('uploadedFiles')
      localStorage.setItem('blogPosts', JSON.stringify(newPosts))
    } catch (err) {
      // Still full - try saving without images
      try {
        const postsWithoutImages = newPosts.map(p => ({
          ...p,
          image: undefined
        }))
        localStorage.setItem('blogPosts', JSON.stringify(postsWithoutImages))
        alert('تم حفظ المقال بدون صورة لتوفير المساحة. يرجى استخدام صورة أصغر حجماً.')
      } catch {
        alert('تعذر حفظ المقال. يرجى مسح بيانات المتصفح.')
      }
    }
  }

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.includes(searchQuery) || post.excerpt.includes(searchQuery)
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Add new post
  const handleAddPost = () => {
    setEditingPost({
      id: Date.now().toString(),
      slug: '',
      title: '',
      excerpt: '',
      content: '',
      category: categories[0],
      date: new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }),
      readingTime: 5,
      published: false,
    })
    setShowEditor(true)
  }

  // Edit post
  const handleEditPost = (post: BlogPost) => {
    setEditingPost({ ...post })
    setShowEditor(true)
  }

  // Save post
  const handleSavePost = () => {
    if (!editingPost) return

    // Generate slug if empty - handle Arabic titles
    if (!editingPost.slug) {
      // Use timestamp + random string for Arabic titles
      editingPost.slug = `post-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    }

    const existingIndex = posts.findIndex(p => p.id === editingPost.id)
    let newPosts: BlogPost[]

    if (existingIndex >= 0) {
      newPosts = [...posts]
      newPosts[existingIndex] = editingPost
    } else {
      newPosts = [editingPost, ...posts]
    }

    savePosts(newPosts)
    setShowEditor(false)
    setEditingPost(null)
  }

  // Delete post
  const handleDeletePost = (id: string) => {
    const newPosts = posts.filter(p => p.id !== id)
    savePosts(newPosts)
    setShowDeleteConfirm(null)
  }

  // Toggle publish status
  const togglePublish = (id: string) => {
    const newPosts = posts.map(p => 
      p.id === id ? { ...p, published: !p.published } : p
    )
    savePosts(newPosts)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-cairo">إدارة المدونة</h1>
          <p className="text-gray-400 mt-1">إضافة وتعديل وحذف مقالات المدونة</p>
        </div>
        <button 
          onClick={handleAddPost}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all"
        >
          <Plus className="w-5 h-5" />
          مقال جديد
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4">
          <p className="text-gray-400 text-sm">إجمالي المقالات</p>
          <p className="text-2xl font-bold text-white mt-1">{posts.length}</p>
        </div>
        <div className="bg-[#0D1117] border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">منشورة</p>
          <p className="text-2xl font-bold text-green-500 mt-1">{posts.filter(p => p.published).length}</p>
        </div>
        <div className="bg-[#0D1117] border border-yellow-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">مسودات</p>
          <p className="text-2xl font-bold text-yellow-500 mt-1">{posts.filter(p => !p.published).length}</p>
        </div>
        <div className="bg-[#0D1117] border border-blue-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">التصنيفات</p>
          <p className="text-2xl font-bold text-blue-500 mt-1">{categories.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="ابحث في المقالات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161b22] border border-[#21262d] rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <select 
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
        >
          <option value="all">جميع التصنيفات</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Posts Table */}
      <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#21262d]">
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">المقال</th>
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">التصنيف</th>
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">التاريخ</th>
                <th className="text-right px-6 py-4 text-gray-400 text-sm font-medium">الحالة</th>
                <th className="text-center px-6 py-4 text-gray-400 text-sm font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post.id} className="border-b border-[#21262d]/50 hover:bg-[#161b22] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-orange-600/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-white line-clamp-1">{post.title}</p>
                        <p className="text-gray-500 text-sm line-clamp-1 mt-1">{post.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-[#21262d] rounded-full text-gray-400 text-xs">{post.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => togglePublish(post.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.published 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}
                    >
                      {post.published ? 'منشور' : 'مسودة'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link 
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="w-8 h-8 rounded-lg hover:bg-[#21262d] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleEditPost(post)}
                        className="w-8 h-8 rounded-lg hover:bg-[#21262d] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(post.id)}
                        className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
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

        {filteredPosts.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">لا توجد مقالات</p>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {showEditor && editingPost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D1117] border-b border-[#21262d] p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {posts.find(p => p.id === editingPost.id) ? 'تعديل المقال' : 'مقال جديد'}
              </h2>
              <button 
                onClick={() => { setShowEditor(false); setEditingPost(null); }}
                className="w-8 h-8 rounded-lg hover:bg-[#21262d] flex items-center justify-center text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">عنوان المقال *</label>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  placeholder="أدخل عنوان المقال"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">الرابط (Slug)</label>
                <input
                  type="text"
                  value={editingPost.slug}
                  onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                  className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  placeholder="يُنشأ تلقائياً من العنوان"
                  dir="ltr"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">المقتطف *</label>
                <textarea
                  value={editingPost.excerpt}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  rows={3}
                  className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none"
                  placeholder="وصف مختصر للمقال"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">المحتوى</label>
                <textarea
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  rows={10}
                  className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none font-mono text-sm"
                  placeholder="محتوى المقال (يدعم Markdown)"
                />
              </div>

              {/* Featured Image Upload */}
              <div>
                <FileUpload
                  label="صورة المقال"
                  description="اسحب الصورة هنا أو اضغط للاختيار"
                  accept="*/*"
                  maxSize={50}
                  onUpload={(file) => setEditingPost({ ...editingPost, image: file.url })}
                />
                {editingPost.image && (
                  <div className="mt-3 relative inline-block">
                    <img 
                      src={editingPost.image} 
                      alt="صورة المقال" 
                      className="max-w-xs max-h-40 rounded-xl border border-[#21262d] object-cover"
                    />
                    <button
                      onClick={() => setEditingPost({ ...editingPost, image: undefined })}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">التصنيف</label>
                  <select
                    value={editingPost.category}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Reading Time */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">وقت القراءة (دقائق)</label>
                  <input
                    type="number"
                    value={editingPost.readingTime}
                    onChange={(e) => setEditingPost({ ...editingPost, readingTime: parseInt(e.target.value) || 5 })}
                    className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                    min="1"
                  />
                </div>
              </div>

              {/* Published */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={editingPost.published}
                    onChange={(e) => setEditingPost({ ...editingPost, published: e.target.checked })}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-[#21262d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
                <span className="text-white">نشر المقال</span>
              </div>
            </div>

            <div className="sticky bottom-0 bg-[#0D1117] border-t border-[#21262d] p-4 flex items-center justify-end gap-3">
              <button 
                onClick={() => { setShowEditor(false); setEditingPost(null); }}
                className="px-6 py-2.5 bg-[#161b22] border border-[#21262d] text-gray-400 rounded-xl hover:text-white transition-colors"
              >
                إلغاء
              </button>
              <button 
                onClick={handleSavePost}
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
              <h3 className="text-xl font-bold text-white mb-2">حذف المقال</h3>
              <p className="text-gray-400 mb-6">هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.</p>
              <div className="flex items-center justify-center gap-3">
                <button 
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-6 py-2.5 bg-[#161b22] border border-[#21262d] text-gray-400 rounded-xl hover:text-white transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  onClick={() => handleDeletePost(showDeleteConfirm)}
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
