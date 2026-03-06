'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  GraduationCap,
  MessageCircle,
  Users,
  Rocket,
  User,
  Quote
} from 'lucide-react'

interface Service {
  id: string
  icon: string
  title: string
  duration: string
  price: string
  description: string
  features: string[]
  buttonText: string
  buttonHref: string
}

interface Trainer {
  name: string
  title: string
  bio: string
  credentials: string[]
  linkedin: string
}

interface Testimonial {
  id: string
  quote: string
  author: string
  company: string
}

const iconOptions = [
  { value: 'MessageCircle', label: 'استشارات' },
  { value: 'Users', label: 'تدريب' },
  { value: 'Rocket', label: 'برنامج' },
]

const defaultServices: Service[] = [
  {
    id: '1',
    icon: 'MessageCircle',
    title: 'استشارات فردية',
    duration: '60 دقيقة',
    price: '500 ريال',
    description: 'جلسة استشارية فردية لحل تحديات مكتبك العقاري',
    features: ['تحليل وضع مكتبك', 'خطة أتمتة مخصصة', 'توصيات الأدوات', 'متابعة بعد الجلسة'],
    buttonText: 'احجز الآن',
    buttonHref: '#booking',
  },
  {
    id: '2',
    icon: 'Users',
    title: 'تدريب المكاتب',
    duration: 'يوم كامل',
    price: '3,000 ريال',
    description: 'تدريب مكثف لفريق مكتبك',
    features: ['تدريب فريق كامل', 'ورشة عمل تطبيقية', 'إعداد الأدوات', 'دعم لمدة شهر'],
    buttonText: 'تواصل معنا',
    buttonHref: '/contact',
  },
  {
    id: '3',
    icon: 'Rocket',
    title: 'برنامج التحول الرقمي',
    duration: '3 أشهر',
    price: '15,000 ريال',
    description: 'برنامج متكامل للتحول الرقمي',
    features: ['تحليل شامل', 'تنفيذ الأتمتة', 'تدريب الفريق', 'دعم لـ 3 أشهر'],
    buttonText: 'اعرف أكثر',
    buttonHref: '/contact',
  },
]

const defaultTrainer: Trainer = {
  name: 'عبدالله صميلي',
  title: 'مؤسس مسار العقار',
  bio: 'خبير في أتمتة العمليات العقارية والذكاء الاصطناعي',
  credentials: ['ماجستير في إدارة الأعمال', 'شهادة في الذكاء الاصطناعي'],
  linkedin: 'https://linkedin.com',
}

const defaultTestimonials: Testimonial[] = []

export default function AdminAcademyPage() {
  const [activeTab, setActiveTab] = useState<'services' | 'trainer' | 'testimonials'>('services')
  const [services, setServices] = useState<Service[]>([])
  const [trainer, setTrainer] = useState<Trainer>(defaultTrainer)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [showServiceEditor, setShowServiceEditor] = useState(false)
  const [showTestimonialEditor, setShowTestimonialEditor] = useState(false)

  // Load data from localStorage
  useEffect(() => {
    const savedServices = localStorage.getItem('academyServices')
    const savedTrainer = localStorage.getItem('academyTrainer')
    const savedTestimonials = localStorage.getItem('academyTestimonials')

    if (savedServices) {
      setServices(JSON.parse(savedServices))
    } else {
      setServices(defaultServices)
    }

    if (savedTrainer) {
      setTrainer(JSON.parse(savedTrainer))
    }

    if (savedTestimonials) {
      setTestimonials(JSON.parse(savedTestimonials))
    }
  }, [])

  // Save services
  const saveServices = (newServices: Service[]) => {
    setServices(newServices)
    localStorage.setItem('academyServices', JSON.stringify(newServices))
    alert('تم حفظ الخدمات بنجاح!')
  }

  // Save trainer
  const saveTrainer = (newTrainer: Trainer) => {
    setTrainer(newTrainer)
    localStorage.setItem('academyTrainer', JSON.stringify(newTrainer))
    alert('تم حفظ معلومات المدرب بنجاح!')
  }

  // Save testimonials
  const saveTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials)
    localStorage.setItem('academyTestimonials', JSON.stringify(newTestimonials))
    alert('تم حفظ شهادات العملاء بنجاح!')
  }

  // Service CRUD
  const handleAddService = () => {
    setEditingService({
      id: Date.now().toString(),
      icon: 'MessageCircle',
      title: '',
      duration: '',
      price: '',
      description: '',
      features: [''],
      buttonText: 'احجز الآن',
      buttonHref: '/contact',
    })
    setShowServiceEditor(true)
  }

  const handleSaveService = () => {
    if (!editingService) return
    
    const existingIndex = services.findIndex(s => s.id === editingService.id)
    let newServices: Service[]
    
    if (existingIndex >= 0) {
      newServices = [...services]
      newServices[existingIndex] = editingService
    } else {
      newServices = [...services, editingService]
    }
    
    saveServices(newServices)
    setShowServiceEditor(false)
    setEditingService(null)
  }

  const handleDeleteService = (id: string) => {
    const newServices = services.filter(s => s.id !== id)
    saveServices(newServices)
  }

  // Testimonial CRUD
  const handleAddTestimonial = () => {
    setEditingTestimonial({
      id: Date.now().toString(),
      quote: '',
      author: '',
      company: '',
    })
    setShowTestimonialEditor(true)
  }

  const handleSaveTestimonial = () => {
    if (!editingTestimonial) return
    
    const existingIndex = testimonials.findIndex(t => t.id === editingTestimonial.id)
    let newTestimonials: Testimonial[]
    
    if (existingIndex >= 0) {
      newTestimonials = [...testimonials]
      newTestimonials[existingIndex] = editingTestimonial
    } else {
      newTestimonials = [...testimonials, editingTestimonial]
    }
    
    saveTestimonials(newTestimonials)
    setShowTestimonialEditor(false)
    setEditingTestimonial(null)
  }

  const handleDeleteTestimonial = (id: string) => {
    const newTestimonials = testimonials.filter(t => t.id !== id)
    saveTestimonials(newTestimonials)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-cairo">إدارة الأكاديمية</h1>
          <p className="text-gray-400 mt-1">إدارة الخدمات والمدرب والشهادات</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#21262d] pb-2">
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'services' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          الخدمات
        </button>
        <button
          onClick={() => setActiveTab('trainer')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'trainer' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          المدرب
        </button>
        <button
          onClick={() => setActiveTab('testimonials')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'testimonials' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          آراء العملاء
        </button>
      </div>

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <button
            onClick={handleAddService}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium"
          >
            <Plus className="w-5 h-5" />
            إضافة خدمة
          </button>

          <div className="grid gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">{service.title}</h3>
                    <p className="text-gray-400 text-sm">{service.duration} - {service.price}</p>
                    <p className="text-gray-500 text-sm mt-2">{service.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingService(service)
                        setShowServiceEditor(true)
                      }}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trainer Tab */}
      {activeTab === 'trainer' && (
        <div className="bg-[#0D1117] border border-[#21262d] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-white">معلومات المدرب</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">الاسم</label>
              <input
                type="text"
                value={trainer.name}
                onChange={(e) => setTrainer({ ...trainer, name: e.target.value })}
                className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">المسمى الوظيفي</label>
              <input
                type="text"
                value={trainer.title}
                onChange={(e) => setTrainer({ ...trainer, title: e.target.value })}
                className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">النبذة</label>
            <textarea
              value={trainer.bio}
              onChange={(e) => setTrainer({ ...trainer, bio: e.target.value })}
              rows={3}
              className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">رابط LinkedIn</label>
            <input
              type="url"
              value={trainer.linkedin}
              onChange={(e) => setTrainer({ ...trainer, linkedin: e.target.value })}
              className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">المؤهلات (سطر لكل مؤهل)</label>
            <textarea
              value={trainer.credentials.join('\n')}
              onChange={(e) => setTrainer({ ...trainer, credentials: e.target.value.split('\n').filter(c => c.trim()) })}
              rows={4}
              className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white"
            />
          </div>

          <button
            onClick={() => saveTrainer(trainer)}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium"
          >
            <Save className="w-5 h-5" />
            حفظ التغييرات
          </button>
        </div>
      )}

      {/* Testimonials Tab */}
      {activeTab === 'testimonials' && (
        <div className="space-y-4">
          <button
            onClick={handleAddTestimonial}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium"
          >
            <Plus className="w-5 h-5" />
            إضافة شهادة
          </button>

          <div className="grid gap-4">
            {testimonials.length === 0 ? (
              <div className="text-center py-12 bg-[#0D1117] border border-[#21262d] rounded-xl">
                <Quote className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">لا توجد شهادات بعد</p>
              </div>
            ) : (
              testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                      <p className="text-white font-medium mt-2">{testimonial.author}</p>
                      <p className="text-gray-500 text-sm">{testimonial.company}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingTestimonial(testimonial)
                          setShowTestimonialEditor(true)
                        }}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(testimonial.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Service Editor Modal */}
      {showServiceEditor && editingService && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#21262d] flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {services.find(s => s.id === editingService.id) ? 'تعديل الخدمة' : 'إضافة خدمة'}
              </h2>
              <button onClick={() => setShowServiceEditor(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">العنوان</label>
                  <input
                    type="text"
                    value={editingService.title}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">الأيقونة</label>
                  <select
                    value={editingService.icon}
                    onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                    className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white"
                  >
                    {iconOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">المدة</label>
                  <input
                    type="text"
                    value={editingService.duration}
                    onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                    className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white"
                    placeholder="60 دقيقة"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">السعر</label>
                  <input
                    type="text"
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                    className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white"
                    placeholder="500 ريال"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">الوصف</label>
                <textarea
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  rows={2}
                  className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">المميزات (سطر لكل ميزة)</label>
                <textarea
                  value={editingService.features.join('\n')}
                  onChange={(e) => setEditingService({ ...editingService, features: e.target.value.split('\n').filter(f => f.trim()) })}
                  rows={4}
                  className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">نص الزر</label>
                  <input
                    type="text"
                    value={editingService.buttonText}
                    onChange={(e) => setEditingService({ ...editingService, buttonText: e.target.value })}
                    className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">رابط الزر</label>
                  <input
                    type="text"
                    value={editingService.buttonHref}
                    onChange={(e) => setEditingService({ ...editingService, buttonHref: e.target.value })}
                    className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveService}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium"
                >
                  <Save className="w-5 h-5" />
                  حفظ
                </button>
                <button
                  onClick={() => setShowServiceEditor(false)}
                  className="px-6 py-3 bg-[#21262d] hover:bg-[#30363d] text-white rounded-xl font-medium"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Editor Modal */}
      {showTestimonialEditor && editingTestimonial && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-[#21262d] flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {testimonials.find(t => t.id === editingTestimonial.id) ? 'تعديل الشهادة' : 'إضافة شهادة'}
              </h2>
              <button onClick={() => setShowTestimonialEditor(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">الشهادة</label>
                <textarea
                  value={editingTestimonial.quote}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                  rows={3}
                  className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white"
                  placeholder="استشارة عبدالله غيرت نظرتنا للأتمتة..."
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">اسم العميل</label>
                <input
                  type="text"
                  value={editingTestimonial.author}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, author: e.target.value })}
                  className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">الشركة</label>
                <input
                  type="text"
                  value={editingTestimonial.company}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })}
                  className="w-full bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-3 text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveTestimonial}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium"
                >
                  <Save className="w-5 h-5" />
                  حفظ
                </button>
                <button
                  onClick={() => setShowTestimonialEditor(false)}
                  className="px-6 py-3 bg-[#21262d] hover:bg-[#30363d] text-white rounded-xl font-medium"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
