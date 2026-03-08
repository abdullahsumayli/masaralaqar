'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  Building2,
  Plus,
  Search,
  Trash2,
  Pencil,
  Loader2,
  X,
  Upload,
  ChevronRight,
  MapPin,
  DollarSign,
  BedDouble,
  SquareStack,
  FileText,
} from 'lucide-react'
import { Property, PropertyType, PropertyStatus } from '@/types/property'

const cities = ['الرياض', 'جدة', 'الدمام', 'الخبر', 'مكة', 'المدينة', 'أبها', 'تبوك']
const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'شقة' },
  { value: 'villa', label: 'فيلا' },
  { value: 'land', label: 'أرض' },
  { value: 'commercial', label: 'تجاري' },
]
const statusOptions: { value: PropertyStatus; label: string }[] = [
  { value: 'available', label: 'متاح' },
  { value: 'sold', label: 'مباع' },
  { value: 'rented', label: 'مؤجر' },
  { value: 'archived', label: 'مؤرشف' },
]

interface EditFormData {
  title: string
  description: string
  price: string
  city: string
  district: string
  location: string
  type: PropertyType
  bedrooms: string
  bathrooms: string
  area: string
  license_number: string
  status: PropertyStatus
}

const statusColors: Record<PropertyStatus, string> = {
  available: 'bg-green-500/10 text-green-400 border-green-500/20',
  sold: 'bg-red-500/10 text-red-400 border-red-500/20',
  rented: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  archived: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

export default function PropertiesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [editForm, setEditForm] = useState<EditFormData | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [editImages, setEditImages] = useState<string[]>([])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/properties/list')
      const data = await response.json()
      if (data.success) {
        setProperties(data.properties)
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العقار؟')) return
    try {
      const response = await fetch(`/api/properties/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setProperties(prev => prev.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete property:', error)
    }
  }

  const openEdit = (property: Property) => {
    setEditingProperty(property)
    setEditImages(property.images || [])
    setEditForm({
      title: property.title || '',
      description: property.description || '',
      price: String(property.price || ''),
      city: property.city || '',
      district: (property as any).district || '',
      location: property.location || '',
      type: property.type,
      bedrooms: String(property.bedrooms || ''),
      bathrooms: String(property.bathrooms || ''),
      area: String(property.area || ''),
      license_number: (property as any).license_number || '',
      status: property.status,
    })
  }

  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploadingImage(true)
    const uploadedUrls: string[] = []
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData()
      formData.append('file', files[i])
      formData.append('tenant_id', 'default')
      try {
        const response = await fetch('/api/properties/upload-image', { method: 'POST', body: formData })
        const data = await response.json()
        if (data.success && data.url) uploadedUrls.push(data.url)
      } catch (error) {
        console.error('Failed to upload image:', error)
      }
    }
    setEditImages(prev => [...prev, ...uploadedUrls])
    setUploadingImage(false)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProperty || !editForm) return
    setSubmitting(true)
    try {
      const payload = {
        title: editForm.title,
        description: editForm.description,
        price: parseInt(editForm.price, 10),
        city: editForm.city,
        district: editForm.district,
        location: editForm.location || editForm.city,
        type: editForm.type,
        bedrooms: editForm.bedrooms ? parseInt(editForm.bedrooms, 10) : undefined,
        bathrooms: editForm.bathrooms ? parseInt(editForm.bathrooms, 10) : undefined,
        area: editForm.area ? parseFloat(editForm.area) : undefined,
        images: editImages,
        license_number: editForm.license_number,
        status: editForm.status,
      }
      const response = await fetch(`/api/properties/${editingProperty.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (data.success) {
        setProperties(prev => prev.map(p => p.id === editingProperty.id ? { ...p, ...payload, images: editImages } : p))
        setEditingProperty(null)
        setEditForm(null)
      } else {
        alert('فشل في تحديث العقار: ' + (data.error || 'خطأ غير معروف'))
      }
    } catch (error) {
      console.error('Failed to update property:', error)
      alert('حدث خطأ أثناء تحديث العقار')
    } finally {
      setSubmitting(false)
    }
  }

  const getTypeLabel = (type: string) =>
    propertyTypes.find(t => t.value === type)?.label || type

  const getStatusLabel = (status: string) =>
    statusOptions.find(s => s.value === status)?.label || status

  const filteredProperties = properties.filter(p =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface" dir="rtl">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-1 text-text-secondary hover:text-primary transition-colors">
                <ChevronRight className="w-5 h-5" />
                <span className="text-sm">لوحة التحكم</span>
              </Link>
              <span className="text-border">/</span>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <h1 className="text-lg font-bold text-text-primary">إدارة العقارات</h1>
              </div>
            </div>
            <Link
              href="/dashboard/properties/add"
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              إضافة عقار
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-background rounded-xl p-4 border border-border">
            <p className="text-2xl font-bold text-text-primary">{properties.length}</p>
            <p className="text-sm text-text-secondary mt-1">إجمالي العقارات</p>
          </div>
          <div className="bg-background rounded-xl p-4 border border-border">
            <p className="text-2xl font-bold text-green-400">{properties.filter(p => p.status === 'available').length}</p>
            <p className="text-sm text-text-secondary mt-1">متاح للبيع</p>
          </div>
          <div className="bg-background rounded-xl p-4 border border-border">
            <p className="text-2xl font-bold text-red-400">{properties.filter(p => p.status === 'sold').length}</p>
            <p className="text-sm text-text-secondary mt-1">مباع</p>
          </div>
          <div className="bg-background rounded-xl p-4 border border-border">
            <p className="text-2xl font-bold text-blue-400">{properties.filter(p => p.status === 'rented').length}</p>
            <p className="text-sm text-text-secondary mt-1">مؤجر</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="ابحث عن عقار بالاسم أو المدينة..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-background rounded-xl border border-border"
          >
            <Building2 className="w-16 h-16 mx-auto text-text-muted mb-4" />
            <p className="text-text-secondary text-lg mb-2">
              {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد عقارات بعد'}
            </p>
            {!searchQuery && (
              <Link
                href="/dashboard/properties/add"
                className="inline-flex items-center gap-2 text-primary hover:underline mt-2"
              >
                <Plus className="w-4 h-4" />
                أضف أول عقار
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-background rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-all"
              >
                {/* Image */}
                <div className="h-48 bg-surface relative overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : property.image_url ? (
                    <img
                      src={property.image_url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-text-muted" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-md font-medium">
                      {getTypeLabel(property.type)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-md border font-medium ${statusColors[property.status]}`}>
                      {getStatusLabel(property.status)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-text-primary mb-2 line-clamp-1">{property.title}</h3>
                  <div className="flex items-center gap-1 text-text-secondary text-sm mb-1">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{property.city}{(property as any).district ? ` - ${(property as any).district}` : ''}</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary font-bold mb-3">
                    <DollarSign className="w-4 h-4 flex-shrink-0" />
                    <span>{property.price?.toLocaleString()} ريال</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-muted mb-4">
                    {property.bedrooms ? (
                      <span className="flex items-center gap-1">
                        <BedDouble className="w-3.5 h-3.5" />
                        {property.bedrooms} غرف
                      </span>
                    ) : null}
                    {property.area ? (
                      <span className="flex items-center gap-1">
                        <SquareStack className="w-3.5 h-3.5" />
                        {property.area} م²
                      </span>
                    ) : null}
                    {(property as any).license_number ? (
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        ترخيص
                      </span>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(property)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-text-secondary border border-border py-2 rounded-lg hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-colors text-sm"
                    >
                      <Pencil className="w-4 h-4" />
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-red-400 border border-red-500/20 py-2 rounded-lg hover:bg-red-500/10 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editingProperty && editForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border"
          >
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-background z-10">
              <h2 className="text-lg font-bold text-text-primary">تعديل العقار</h2>
              <button
                onClick={() => { setEditingProperty(null); setEditForm(null) }}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">عنوان العقار *</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>

              {/* City + District */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">المدينة *</label>
                  <select
                    required
                    value={editForm.city}
                    onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">الحي</label>
                  <input
                    type="text"
                    value={editForm.district}
                    onChange={e => setEditForm({ ...editForm, district: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="مثال: حي النرجس"
                  />
                </div>
              </div>

              {/* Type + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">نوع العقار *</label>
                  <select
                    required
                    value={editForm.type}
                    onChange={e => setEditForm({ ...editForm, type: e.target.value as PropertyType })}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    {propertyTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">الحالة</label>
                  <select
                    value={editForm.status}
                    onChange={e => setEditForm({ ...editForm, status: e.target.value as PropertyStatus })}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Price + Area + Rooms */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">السعر (ريال) *</label>
                  <input
                    type="number"
                    required
                    value={editForm.price}
                    onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">المساحة (م²)</label>
                  <input
                    type="number"
                    value={editForm.area}
                    onChange={e => setEditForm({ ...editForm, area: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">غرف النوم</label>
                  <input
                    type="number"
                    value={editForm.bedrooms}
                    onChange={e => setEditForm({ ...editForm, bedrooms: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>

              {/* License number */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">رقم الترخيص</label>
                <input
                  type="text"
                  value={editForm.license_number}
                  onChange={e => setEditForm({ ...editForm, license_number: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="رقم ترخيص الفال"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">الوصف</label>
                <textarea
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                  rows={3}
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">الصور</label>
                <label
                  htmlFor="edit-image-upload"
                  className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                >
                  {uploadingImage ? (
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  ) : (
                    <Upload className="w-5 h-5 text-text-muted" />
                  )}
                  <span className="text-text-muted text-sm">
                    {uploadingImage ? 'جاري الرفع...' : 'رفع صور'}
                  </span>
                </label>
                <input
                  id="edit-image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleEditImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
                {editImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {editImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt="" className="w-full h-20 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => setEditImages(prev => prev.filter((_, i) => i !== index))}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : 'حفظ التعديلات'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
