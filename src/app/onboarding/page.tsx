'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  Home,
  Bot,
  Link2,
  ChevronLeft,
  ChevronRight,
  Upload,
  Plus,
  Trash2,
  Check,
  Copy,
  Loader,
  MessageSquare,
  MapPin,
  Phone,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { saveAgent, uploadOfficeLogo, completeOnboarding, Property } from '@/lib/agents'

const STEPS = [
  { id: 1, title: 'معلومات المكتب', icon: Building2 },
  { id: 2, title: 'العقارات', icon: Home },
  { id: 3, title: 'شخصية الوكيل', icon: Bot },
  { id: 4, title: 'ربط الواتساب', icon: Link2 },
]

const CITIES = [
  'الرياض',
  'جدة',
  'مكة المكرمة',
  'المدينة المنورة',
  'الدمام',
  'الخبر',
  'الإحساء',
  'الطائف',
  'بريدة',
  'تبوك',
  'خميس مشيط',
  'أبها',
  'نجران',
  'الجبيل',
  'ينبع',
  'حائل',
  'القصيم',
]

const PROPERTY_TYPES = [
  'شقة',
  'فيلا',
  'دوبلكس',
  'أرض سكنية',
  'أرض تجارية',
  'مكتب',
  'محل تجاري',
  'عمارة',
  'استراحة',
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  // Step 1: Office Info
  const [officeName, setOfficeName] = useState('')
  const [officeLogo, setOfficeLogo] = useState<File | null>(null)
  const [officeLogoPreview, setOfficeLogoPreview] = useState<string | null>(null)
  const [city, setCity] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')

  // Step 2: Properties
  const [properties, setProperties] = useState<Property[]>([])
  const [newProperty, setNewProperty] = useState<Property>({
    type: '',
    district: '',
    price: 0,
    area: 0,
    description: '',
  })

  // Step 3: Agent Personality
  const [agentName, setAgentName] = useState('')
  const [responseStyle, setResponseStyle] = useState<'formal' | 'friendly'>('friendly')
  const [welcomeMessage, setWelcomeMessage] = useState('')

  // Step 4: Webhook
  const [webhookUrl, setWebhookUrl] = useState('')
  const [webhookSecret, setWebhookSecret] = useState('')

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Handle logo upload preview
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setOfficeLogo(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setOfficeLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Add property
  const addProperty = () => {
    if (newProperty.type && newProperty.district) {
      setProperties([...properties, { ...newProperty, id: Date.now().toString() }])
      setNewProperty({
        type: '',
        district: '',
        price: 0,
        area: 0,
        description: '',
      })
    }
  }

  // Remove property
  const removeProperty = (id: string) => {
    setProperties(properties.filter(p => p.id !== id))
  }

  // Generate default welcome message
  useEffect(() => {
    if (agentName && !welcomeMessage) {
      const style = responseStyle === 'formal' 
        ? `أهلاً وسهلاً بك، معك ${agentName} من ${officeName || 'مكتبنا العقاري'}. كيف أقدر أساعدك اليوم؟`
        : `هلا والله! أنا ${agentName} من ${officeName || 'المكتب'}، شلون أقدر أخدمك؟ 😊`
      setWelcomeMessage(style)
    }
  }, [agentName, responseStyle, officeName])

  // Save current step
  const saveCurrentStep = async () => {
    setSaving(true)
    try {
      let logoUrl = officeLogoPreview

      // Upload logo if exists
      if (officeLogo && currentStep === 1) {
        const { url } = await uploadOfficeLogo(officeLogo)
        if (url) logoUrl = url
      }

      const agentData: any = {
        office_name: officeName,
        office_logo_url: logoUrl,
        city,
        whatsapp_number: whatsappNumber,
        properties,
        agent_name: agentName,
        response_style: responseStyle,
        welcome_message: welcomeMessage,
      }

      const { data, error } = await saveAgent(agentData)
      
      if (error) {
        console.error('Save error:', error)
        return false
      }

      // Update webhook info for step 4
      if (data) {
        setWebhookUrl(data.webhook_url || '')
        setWebhookSecret(data.webhook_secret || '')
      }

      return true
    } catch (error) {
      console.error('Error saving:', error)
      return false
    } finally {
      setSaving(false)
    }
  }

  // Navigate steps
  const nextStep = async () => {
    const saved = await saveCurrentStep()
    if (saved && currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Complete onboarding
  const finishOnboarding = async () => {
    setSaving(true)
    try {
      await saveCurrentStep()
      await completeOnboarding()
      router.push('/dashboard')
    } catch (error) {
      console.error('Error completing onboarding:', error)
    } finally {
      setSaving(false)
    }
  }

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">إعداد نظام صقر</h1>
          <p className="text-gray-400">أكمل الخطوات التالية لتفعيل الرد الآلي الذكي</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-10 relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#1a1a1a]" />
          <div 
            className="absolute top-5 right-0 h-0.5 bg-primary transition-all duration-500"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />
          
          {STEPS.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentStep >= step.id
                    ? 'bg-primary text-white'
                    : 'bg-[#1a1a1a] text-gray-500'
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <span className={`text-xs mt-2 ${currentStep >= step.id ? 'text-white' : 'text-gray-500'}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-[#111] border border-[#222] rounded-2xl p-6 md:p-8"
          >
            {/* Step 1: Office Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">معلومات المكتب</h2>
                    <p className="text-gray-400 text-sm">أدخل بيانات مكتبك العقاري</p>
                  </div>
                </div>

                {/* Office Name */}
                <div>
                  <label className="block text-white text-sm mb-2">اسم المكتب *</label>
                  <input
                    type="text"
                    value={officeName}
                    onChange={(e) => setOfficeName(e.target.value)}
                    placeholder="مثال: مكتب العقار الذهبي"
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Office Logo */}
                <div>
                  <label className="block text-white text-sm mb-2">شعار المكتب</label>
                  <div className="flex items-center gap-4">
                    {officeLogoPreview ? (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                        <img src={officeLogoPreview} alt="Logo" className="w-full h-full object-cover" />
                        <button
                          onClick={() => {
                            setOfficeLogo(null)
                            setOfficeLogoPreview(null)
                          }}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <Trash2 className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ) : (
                      <label className="w-20 h-20 rounded-xl border-2 border-dashed border-[#333] flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                        <Upload className="w-6 h-6 text-gray-500" />
                        <span className="text-xs text-gray-500 mt-1">رفع</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </label>
                    )}
                    <p className="text-gray-500 text-sm">PNG, JPG بحد أقصى 2MB</p>
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-white text-sm mb-2">المدينة *</label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-10 py-3 text-white focus:outline-none focus:border-primary appearance-none"
                    >
                      <option value="">اختر المدينة</option>
                      {CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label className="block text-white text-sm mb-2">رقم الواتساب التجاري *</label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="966512345678"
                      dir="ltr"
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-10 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary text-left"
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-1">أدخل الرقم بصيغة دولية بدون + أو 00</p>
                </div>
              </div>
            )}

            {/* Step 2: Properties */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Home className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">العقارات</h2>
                    <p className="text-gray-400 text-sm">أضف العقارات المتوفرة لديك</p>
                  </div>
                </div>

                {/* Added Properties */}
                {properties.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {properties.map((property) => (
                      <div key={property.id} className="bg-[#1a1a1a] rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{property.type} - {property.district}</p>
                          <p className="text-gray-400 text-sm">
                            {property.price.toLocaleString()} ر.س | {property.area} م²
                          </p>
                        </div>
                        <button
                          onClick={() => removeProperty(property.id!)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Property Form */}
                <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-4">
                  <h3 className="text-white font-medium">إضافة عقار جديد</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">نوع العقار</label>
                      <select
                        value={newProperty.type}
                        onChange={(e) => setNewProperty({ ...newProperty, type: e.target.value })}
                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                      >
                        <option value="">اختر النوع</option>
                        {PROPERTY_TYPES.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">المنطقة / الحي</label>
                      <input
                        type="text"
                        value={newProperty.district}
                        onChange={(e) => setNewProperty({ ...newProperty, district: e.target.value })}
                        placeholder="مثال: حي النرجس"
                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">السعر (ر.س)</label>
                      <input
                        type="number"
                        value={newProperty.price || ''}
                        onChange={(e) => setNewProperty({ ...newProperty, price: parseInt(e.target.value) || 0 })}
                        placeholder="500000"
                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">المساحة (م²)</label>
                      <input
                        type="number"
                        value={newProperty.area || ''}
                        onChange={(e) => setNewProperty({ ...newProperty, area: parseInt(e.target.value) || 0 })}
                        placeholder="250"
                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs mb-1">وصف مختصر</label>
                    <textarea
                      value={newProperty.description}
                      onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                      placeholder="فيلا دورين مع ملحق، غرفة سائق..."
                      rows={2}
                      className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <button
                    onClick={addProperty}
                    disabled={!newProperty.type || !newProperty.district}
                    className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary py-2 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة العقار
                  </button>
                </div>

                {properties.length === 0 && (
                  <p className="text-gray-500 text-center text-sm">
                    يمكنك تخطي هذه الخطوة وإضافة العقارات لاحقاً
                  </p>
                )}
              </div>
            )}

            {/* Step 3: Agent Personality */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">شخصية الوكيل الذكي</h2>
                    <p className="text-gray-400 text-sm">خصص طريقة تواصل الوكيل مع العملاء</p>
                  </div>
                </div>

                {/* Agent Name */}
                <div>
                  <label className="block text-white text-sm mb-2">اسم الوكيل *</label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="مثال: أحمد"
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary"
                  />
                  <p className="text-gray-500 text-xs mt-1">الاسم الذي سيستخدمه الوكيل للتعريف بنفسه</p>
                </div>

                {/* Response Style */}
                <div>
                  <label className="block text-white text-sm mb-3">أسلوب الرد</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setResponseStyle('formal')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        responseStyle === 'formal'
                          ? 'border-primary bg-primary/10'
                          : 'border-[#333] bg-[#1a1a1a]'
                      }`}
                    >
                      <div className="text-2xl mb-2">🎩</div>
                      <p className="text-white font-medium">رسمي</p>
                      <p className="text-gray-500 text-xs mt-1">أسلوب احترافي ومهني</p>
                    </button>
                    <button
                      onClick={() => setResponseStyle('friendly')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        responseStyle === 'friendly'
                          ? 'border-primary bg-primary/10'
                          : 'border-[#333] bg-[#1a1a1a]'
                      }`}
                    >
                      <div className="text-2xl mb-2">😊</div>
                      <p className="text-white font-medium">ودي</p>
                      <p className="text-gray-500 text-xs mt-1">أسلوب ترحيبي وقريب</p>
                    </button>
                  </div>
                </div>

                {/* Welcome Message */}
                <div>
                  <label className="block text-white text-sm mb-2">رسالة الترحيب</label>
                  <div className="relative">
                    <MessageSquare className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
                    <textarea
                      value={welcomeMessage}
                      onChange={(e) => setWelcomeMessage(e.target.value)}
                      placeholder="رسالة الترحيب التي سيرسلها الوكيل للعميل"
                      rows={3}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 pr-10 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary resize-none"
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-1">اترك الحقل فارغاً لاستخدام الرسالة الافتراضية</p>
                </div>

                {/* Preview */}
                {(agentName || welcomeMessage) && (
                  <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#333]">
                    <p className="text-gray-400 text-xs mb-2">معاينة الرسالة:</p>
                    <div className="bg-[#075e54] rounded-lg p-3 inline-block max-w-[80%]">
                      <p className="text-white text-sm">{welcomeMessage || `مرحباً! معك ${agentName}`}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: WhatsApp Connection */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Link2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">ربط الواتساب</h2>
                    <p className="text-gray-400 text-sm">اربط حسابك بالواتساب لتفعيل الرد الآلي</p>
                  </div>
                </div>

                {/* Webhook URL */}
                <div>
                  <label className="block text-white text-sm mb-2">Webhook URL الخاص بك</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-gray-300 text-sm font-mono overflow-x-auto">
                      {webhookUrl || 'https://api.masaralaqar.com/webhook/YOUR_ID'}
                    </div>
                    <button
                      onClick={() => copyToClipboard(webhookUrl)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        copied ? 'bg-green-500' : 'bg-primary'
                      }`}
                    >
                      {copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5 text-white" />}
                    </button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-[#1a1a1a] rounded-xl p-5 space-y-4">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    خطوات الربط
                  </h3>
                  
                  <ol className="space-y-3 text-gray-300 text-sm">
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs">1</span>
                      <span>افتح لوحة تحكم WhatsApp Business API أو المزود الذي تستخدمه</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs">2</span>
                      <span>اذهب إلى إعدادات Webhook أو Configuration</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs">3</span>
                      <span>الصق الـ URL أعلاه في حقل Callback URL</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs">4</span>
                      <span>فعّل جميع الأحداث (messages, status updates)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs">5</span>
                      <span>احفظ الإعدادات وأرسل رسالة تجريبية للتأكد</span>
                    </li>
                  </ol>
                </div>

                {/* Help */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <p className="text-blue-400 text-sm">
                    💡 تحتاج مساعدة في الربط؟ تواصل معنا عبر واتساب: <span dir="ltr" className="font-mono">+966 54 537 4069</span>
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#222]">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
                السابق
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      التالي
                      <ChevronLeft className="w-5 h-5" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={finishOnboarding}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      إنهاء الإعداد
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
