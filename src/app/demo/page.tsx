'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Clock, 
  CheckCheck, 
  Calendar,
  MapPin,
  Home,
  Phone,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Building2,
  BedDouble,
  Bath,
  Maximize,
  ChevronLeft
} from 'lucide-react'

interface Message {
  type: 'user' | 'bot'
  text: string
  delay: number
  showProperty?: boolean
  showConfirmation?: boolean
  showVilla?: boolean
  showLowPriority?: boolean
}

interface DemoScenario {
  id: string
  title: string
  description: string
  messages: Message[]
}

// Demo conversation scenarios
const demoScenarios: DemoScenario[] = [
  {
    id: 'inquiry',
    title: 'استفسار عن عقار',
    description: 'عميل يسأل عن شقة للإيجار',
    messages: [
      { type: 'user' as const, text: 'السلام عليكم، عندكم شقق للإيجار في حي النرجس؟', delay: 0 },
      { type: 'bot' as const, text: 'وعليكم السلام ورحمة الله! 👋\n\nأهلاً بك في مكتب الأفق العقاري. نعم، لدينا عدة شقق متاحة في حي النرجس.\n\nهل تفضل شقة بغرفتين أو ثلاث غرف؟', delay: 1500 },
      { type: 'user' as const, text: 'ثلاث غرف', delay: 3500 },
      { type: 'bot' as const, text: 'ممتاز! 🏠\n\nلدينا 3 شقق متاحة بثلاث غرف في النرجس:\n\n1️⃣ شقة 140م² - 45,000 ر.س/سنة\n2️⃣ شقة 160م² - 52,000 ر.س/سنة (مع مصعد)\n3️⃣ شقة 150م² - 48,000 ر.س/سنة (حديثة)\n\nهل تريد معاينة أي منها؟', delay: 5000, showProperty: true },
      { type: 'user' as const, text: 'أبي أشوف الثانية', delay: 8000 },
      { type: 'bot' as const, text: 'تمام! 📅\n\nالشقة الثانية (160م² مع مصعد) متاحة للمعاينة.\n\nالمواعيد المتاحة:\n• اليوم الساعة 5:00 مساءً\n• غداً الساعة 10:00 صباحاً\n• غداً الساعة 4:00 مساءً\n\nأي وقت يناسبك؟', delay: 9500 },
      { type: 'user' as const, text: 'غدا الساعة 10 الصبح', delay: 12000 },
      { type: 'bot' as const, text: '✅ تم تأكيد الموعد!\n\n📍 الموقع: حي النرجس، شارع الأمير محمد بن سلمان\n📅 الوقت: غداً الساعة 10:00 صباحاً\n👤 سيتواصل معك الوكيل أحمد قبل الموعد\n\nهل تحتاج أي شيء آخر؟ 😊', delay: 13500, showConfirmation: true },
    ]
  },
  {
    id: 'price',
    title: 'استفسار عن السعر',
    description: 'عميل يسأل عن أسعار الفلل',
    messages: [
      { type: 'user' as const, text: 'كم سعر الفلل عندكم في شمال الرياض؟', delay: 0 },
      { type: 'bot' as const, text: 'أهلاً وسهلاً! 🏡\n\nأسعار الفلل في شمال الرياض تتراوح حسب الموقع والمساحة:\n\n📍 حي الملقا: من 2.5 - 4.5 مليون\n📍 حي النرجس: من 2 - 3.5 مليون\n📍 حي الياسمين: من 1.8 - 3 مليون\n\nهل تبحث عن فيلا جاهزة أو تحت الإنشاء؟', delay: 1500 },
      { type: 'user' as const, text: 'جاهزة في الملقا', delay: 4000 },
      { type: 'bot' as const, text: 'ممتاز! لدينا فيلا رائعة في الملقا 🌟\n\n🏠 فيلا درج داخلي + شقة\n📐 المساحة: 375م²\n🛏️ 6 غرف نوم + 2 صالة\n💰 السعر: 3,200,000 ر.س\n\nمميزات: مسبح، حديقة، تشطيب فاخر\n\nهل تريد تحديد موعد للمعاينة؟', delay: 5500, showVilla: true },
    ]
  },
  {
    id: 'filter',
    title: 'تصفية العملاء',
    description: 'كيف يتعامل مع العملاء غير الجادين',
    messages: [
      { type: 'user' as const, text: 'وش أرخص شي عندكم؟', delay: 0 },
      { type: 'bot' as const, text: 'أهلاً بك! 👋\n\nعندنا خيارات متنوعة. لنساعدك بشكل أفضل:\n\n• هل تبحث عن إيجار أو تملك؟\n• ما هي المنطقة المفضلة لك؟\n• كم عدد الغرف المطلوبة؟', delay: 1500 },
      { type: 'user' as const, text: 'بس أسأل', delay: 3500 },
      { type: 'bot' as const, text: 'تمام! 😊\n\nيمكنك تصفح عقاراتنا على موقعنا:\nmasaralaqar.com/properties\n\nوعند جاهزيتك للبحث الجدي، تواصل معنا وسنساعدك بكل سرور! 🏠', delay: 5000, showLowPriority: true },
    ]
  }
]

export default function DemoPage() {
  const [selectedScenario, setSelectedScenario] = useState(demoScenarios[0])
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [visibleMessages, isTyping])

  // Play demo
  useEffect(() => {
    if (!isPlaying) return

    const messages = selectedScenario.messages
    if (currentMessageIndex >= messages.length) {
      setIsPlaying(false)
      return
    }

    const currentMessage = messages[currentMessageIndex]
    const nextMessage = messages[currentMessageIndex + 1]
    
    // Show typing indicator for bot messages
    if (currentMessage.type === 'bot') {
      setIsTyping(true)
      const typingTimer = setTimeout(() => {
        setIsTyping(false)
        setVisibleMessages(prev => [...prev, currentMessage])
        setCurrentMessageIndex(prev => prev + 1)
      }, 1200)
      return () => clearTimeout(typingTimer)
    } else {
      setVisibleMessages(prev => [...prev, currentMessage])
      setCurrentMessageIndex(prev => prev + 1)
    }
  }, [isPlaying, currentMessageIndex, selectedScenario])

  // Delay between messages
  useEffect(() => {
    if (!isPlaying || currentMessageIndex === 0) return
    if (currentMessageIndex >= selectedScenario.messages.length) return

    const currentMessage = selectedScenario.messages[currentMessageIndex]
    const prevMessage = selectedScenario.messages[currentMessageIndex - 1]
    const delay = currentMessage.delay - prevMessage.delay

    const timer = setTimeout(() => {
      // Trigger next message
    }, delay)

    return () => clearTimeout(timer)
  }, [currentMessageIndex, isPlaying, selectedScenario])

  const startDemo = () => {
    setVisibleMessages([])
    setCurrentMessageIndex(0)
    setIsPlaying(true)
  }

  const resetDemo = () => {
    setIsPlaying(false)
    setVisibleMessages([])
    setCurrentMessageIndex(0)
    setIsTyping(false)
  }

  const selectScenario = (scenario: typeof demoScenarios[0]) => {
    resetDemo()
    setSelectedScenario(scenario)
  }

  return (
    <div className="min-h-screen bg-[#010409]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0D1117]/80 backdrop-blur-xl border-b border-[#21262d]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-3xl">🦅</span>
            <div>
              <span className="font-cairo font-bold text-xl text-white">نظام صقر</span>
              <span className="text-xs text-gray-500 block">تجربة تفاعلية</span>
            </div>
          </Link>
          <Link 
            href="/products/saqr" 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <span>العودة لصفحة صقر</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">تجربة حية</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-cairo">
            شاهد <span className="text-primary">صقر</span> وهو يعمل
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            تجربة تفاعلية توضح كيف يرد نظام صقر على عملائك بذكاء ويحجز المواعيد تلقائياً
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scenarios Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-bold text-white mb-4">اختر سيناريو</h2>
              <div className="space-y-3">
                {demoScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => selectScenario(scenario)}
                    className={`w-full text-right p-4 rounded-xl transition-all ${
                      selectedScenario.id === scenario.id
                        ? 'bg-primary/10 border border-primary/30'
                        : 'bg-[#161b22] border border-[#21262d] hover:border-primary/30'
                    }`}
                  >
                    <h3 className={`font-medium ${selectedScenario.id === scenario.id ? 'text-primary' : 'text-white'}`}>
                      {scenario.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">{scenario.description}</p>
                  </button>
                ))}
              </div>

              {/* Demo Controls */}
              <div className="mt-6 pt-6 border-t border-[#21262d]">
                <div className="flex gap-3">
                  <button
                    onClick={isPlaying ? () => setIsPlaying(false) : startDemo}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-5 h-5" />
                        <span>إيقاف</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        <span>تشغيل</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetDemo}
                    className="px-4 py-3 bg-[#161b22] border border-[#21262d] text-gray-400 hover:text-white hover:border-primary rounded-xl transition-all"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#161b22] rounded-xl text-center">
                  <p className="text-2xl font-bold text-primary">2.3</p>
                  <p className="text-xs text-gray-500">ثانية للرد</p>
                </div>
                <div className="p-3 bg-[#161b22] rounded-xl text-center">
                  <p className="text-2xl font-bold text-green-500">98%</p>
                  <p className="text-xs text-gray-500">دقة الفهم</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chat Demo */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl overflow-hidden">
              {/* Chat Header */}
              <div className="bg-[#075E54] p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-2xl">🦅</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">مكتب الأفق العقاري</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    <span className="text-green-200 text-sm">متصل الآن</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs">مدعوم بـ</p>
                  <p className="text-white text-sm font-medium">نظام صقر 🦅</p>
                </div>
              </div>

              {/* Chat Messages */}
              <div 
                ref={chatContainerRef}
                className="h-[500px] overflow-y-auto p-4 space-y-4"
                style={{ 
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2321262d" fill-opacity="0.3"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                  backgroundColor: '#0a0d10'
                }}
              >
                {visibleMessages.length === 0 && !isPlaying && (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <MessageCircle className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-white font-medium mb-2">اضغط "تشغيل" لبدء التجربة</h3>
                    <p className="text-gray-500 text-sm">شاهد كيف يتعامل صقر مع استفسارات العملاء</p>
                  </div>
                )}

                <AnimatePresence>
                  {visibleMessages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            message.type === 'user'
                              ? 'bg-[#005C4B] text-white rounded-br-md'
                              : 'bg-[#1f2937] text-white rounded-bl-md'
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
                          <div className={`flex items-center gap-1 mt-1 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-xs text-white/50">
                              {new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {message.type === 'user' && <CheckCheck className="w-4 h-4 text-blue-400" />}
                          </div>
                        </div>

                        {/* Property Card */}
                        {message.showProperty && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-3 bg-[#1f2937] rounded-xl overflow-hidden"
                          >
                            <div className="h-32 bg-gradient-to-br from-primary/30 to-orange-600/30 flex items-center justify-center">
                              <Home className="w-12 h-12 text-white/50" />
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium text-white text-sm">شقة 160م² - حي النرجس</h4>
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" /> 3 غرف</span>
                                <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> 2 حمام</span>
                                <span className="flex items-center gap-1"><Maximize className="w-3 h-3" /> 160م²</span>
                              </div>
                              <p className="text-primary font-bold mt-2">52,000 ر.س/سنة</p>
                            </div>
                          </motion.div>
                        )}

                        {/* Villa Card */}
                        {message.showVilla && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-3 bg-[#1f2937] rounded-xl overflow-hidden"
                          >
                            <div className="h-32 bg-gradient-to-br from-yellow-500/30 to-orange-600/30 flex items-center justify-center">
                              <Building2 className="w-12 h-12 text-white/50" />
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium text-white text-sm">فيلا فاخرة - حي الملقا</h4>
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" /> 6 غرف</span>
                                <span className="flex items-center gap-1"><Maximize className="w-3 h-3" /> 375م²</span>
                              </div>
                              <p className="text-primary font-bold mt-2">3,200,000 ر.س</p>
                            </div>
                          </motion.div>
                        )}

                        {/* Confirmation Badge */}
                        {message.showConfirmation && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-xl"
                          >
                            <div className="flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-green-500" />
                              <span className="text-green-500 font-medium text-sm">تم حجز الموعد بنجاح!</span>
                            </div>
                          </motion.div>
                        )}

                        {/* Low Priority Badge */}
                        {message.showLowPriority && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl"
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-yellow-500" />
                              <span className="text-yellow-500 text-sm">تم تصنيف العميل: أولوية منخفضة</span>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-[#1f2937] rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Chat Input (Decorative) */}
              <div className="p-4 bg-[#0D1117] border-t border-[#21262d]">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-[#161b22] border border-[#21262d] rounded-full px-4 py-3 text-gray-500 text-sm">
                    اكتب رسالة...
                  </div>
                  <button className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Features Below Chat */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="font-medium text-white mb-1">رد فوري</h3>
                <p className="text-gray-500 text-sm">يرد على العملاء خلال ثواني 24/7</p>
              </div>
              <div className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="font-medium text-white mb-1">حجز تلقائي</h3>
                <p className="text-gray-500 text-sm">يحجز مواعيد المعاينات تلقائياً</p>
              </div>
              <div className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium text-white mb-1">تصفية ذكية</h3>
                <p className="text-gray-500 text-sm">يحدد العملاء الجادين من المتصفحين</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-br from-primary/10 to-orange-600/5 border border-primary/20 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-4 font-cairo">
              جاهز لتجربة صقر في مكتبك؟
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              احصل على تجربة مجانية لمدة 14 يوم وشاهد كيف يزيد صقر من إنتاجية مكتبك
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="https://wa.me/966545374069?text=أريد تجربة نظام صقر"
                target="_blank"
                className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                ابدأ التجربة المجانية
              </Link>
              <Link
                href="/products/saqr"
                className="px-8 py-4 bg-[#161b22] border border-[#21262d] text-white font-medium rounded-xl hover:border-primary transition-all"
              >
                اعرف المزيد
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#21262d] mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">
            نظام صقر - منتج من <Link href="/" className="text-primary hover:underline">مسار العقار</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
