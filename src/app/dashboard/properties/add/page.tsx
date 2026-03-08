'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  Building2,
  ChevronRight,
  Loader2,
  Upload,
  X,
  Plus,
} from 'lucide-react'
import { PropertyType, PropertyStatus } from '@/types/property'

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

interface FormData {
  title: string
  city: string
  district: string
  type: PropertyType
  price: string
  area: string
  bedrooms: string
  bathrooms: string
  description: string
  license_number: string
  status: PropertyStatus
}

const initialForm: FormData = {
  title: '',
  city: 'الرياض',
  district: '',
  type: 'apartment',
  price: '',
  area: '',
  bedrooms: '',
  bathrooms: '',
  description: '',
  license_number: '',
  status: 'available',
}

export default function AddPropertyPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [form, setForm] = useState<FormData>(initialForm)
  const [images, setImages] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      } catch (err) {
        console.error('Failed to upload image:', err)
      }
    }
    setImages(prev => [...prev, ...uploadedUrls])
    setUploadingImage(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: parseInt(form.price, 10),
        city: form.city,
        district: form.district,
        location: form.district ? `${form.district}، ${form.city}` : form.city,
        type: form.type,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms, 10) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms, 10) : null,
        area: form.area ? parseFloat(form.area) : null,
        images,
        license_number: form.license_number,
        status: form.status,
        tenant_id: 'default',
      }
      const response = await fetch('/api/properties/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (data.success) {
        router.push('/dashboard/properties')
      } else {
        setError(data.message || data.error || 'فشل في إضافة العقار')
      }
    } catch (err) {
      console.error('Failed to create property:', err)
      setError('حدث خطأ أثناء إضافة العقار')
    } finally {
      setSubmitting(false)
    }
  }

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
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-2 text-sm">
            <Link href="/dashboard" className="text-text-secondary hover:text-primary transition-colors">
              لوحة التحكم
            </Link>
            <ChevronRight className="w-4 h-4 text-text-muted" />
            <Link href="/dashboard/properties" className="text-text-secondary hover:text-primary transition-colors">
              العقارات
            </Link>
            <ChevronRight className="w-4 h-4 text-text-muted" />
            <span className="text-text-primary font-medium">إضافة عقار</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Page Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">إضافة عقار جديد</h1>
              <p className="text-sm text-text-secondary">أدخل تفاصيل العقار الذي تريد إضافته</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section: Basic Info */}
            <div className="bg-background rounded-xl border border-border p-6 space-y-4">
              <h2 className="text-base font-semibold text-text-primary border-b border-border pb-3">
                المعلومات الأساسية
              </h2>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  عنوان العقار <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="مثال: شقة فاخرة 3 غرف في حي النرجس"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  نوع العقار <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {propertyTypes.map(t => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm({ ...form, type: t.value })}
                      className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        form.type === t.value
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-surface border-border text-text-secondary hover:border-primary/30'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  حالة العقار
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {statusOptions.map(s => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setForm({ ...form, status: s.value })}
                      className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        form.status === s.value
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-surface border-border text-text-secondary hover:border-primary/30'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section: Location */}
            <div className="bg-background rounded-xl border border-border p-6 space-y-4">
              <h2 className="text-base font-semibold text-text-primary border-b border-border pb-3">
                الموقع
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    المدينة <span className="text-red-400">*</span>
                  </label>
                  <select
                    required
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">الحي</label>
                  <input
                    type="text"
                    value={form.district}
                    onChange={e => setForm({ ...form, district: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="مثال: حي النرجس"
                  />
                </div>
              </div>
            </div>

            {/* Section: Details */}
            <div className="bg-background rounded-xl border border-border p-6 space-y-4">
              <h2 className="text-base font-semibold text-text-primary border-b border-border pb-3">
                التفاصيل
              </h2>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    السعر (ريال) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="800000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">المساحة (م²)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.area}
                    onChange={e => setForm({ ...form, area: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">غرف النوم</label>
                  <input
                    type="number"
                    min="0"
                    value={form.bedrooms}
                    onChange={e => setForm({ ...form, bedrooms: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">رقم الترخيص</label>
                <input
                  type="text"
                  value={form.license_number}
                  onChange={e => setForm({ ...form, license_number: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="رقم ترخيص الفال"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">وصف العقار</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                  placeholder="وصف تفصيلي للعقار، المميزات، الموقع، وغيرها..."
                />
              </div>
            </div>

            {/* Section: Images */}
            <div className="bg-background rounded-xl border border-border p-6 space-y-4">
              <h2 className="text-base font-semibold text-text-primary border-b border-border pb-3">
                صور العقار
              </h2>

              <label
                htmlFor="property-images"
                className={`flex flex-col items-center justify-center gap-3 w-full py-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  uploadingImage
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                {uploadingImage ? (
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                ) : (
                  <Upload className="w-8 h-8 text-text-muted" />
                )}
                <div className="text-center">
                  <p className="text-text-secondary text-sm font-medium">
                    {uploadingImage ? 'جاري رفع الصور...' : 'اضغط لرفع الصور'}
                  </p>
                  <p className="text-text-muted text-xs mt-1">PNG, JPG, WEBP حتى 10MB</p>
                </div>
              </label>
              <input
                id="property-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />

              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img src={url} alt="" className="w-full h-24 object-cover rounded-lg" />
                      {index === 0 && (
                        <span className="absolute bottom-1 right-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded">
                          رئيسية
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                href="/dashboard/properties"
                className="flex-1 flex items-center justify-center py-3 border border-border rounded-lg text-text-secondary hover:bg-surface transition-colors font-medium"
              >
                إلغاء
              </Link>
              <button
                type="submit"
                disabled={submitting || uploadingImage}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري الإضافة...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    إضافة العقار
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  )
}
