'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  Home,
  BookOpen,
  MessageSquare,
  Calendar,
  Trophy,
  Users,
  Bell,
  Search,
  Play,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  ChevronRight,
  Star,
  Lock,
  CheckCircle,
  Flame,
  Crown,
  Medal,
  Award,
  TrendingUp,
  GraduationCap,
  Zap,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

// Types
interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  instructor: string
  duration: string
  lessons: number
  progress?: number
  locked?: boolean
  category: string
}

interface Discussion {
  id: string
  author: {
    name: string
    avatar: string
    level: number
  }
  content: string
  image?: string
  likes: number
  comments: number
  time: string
  liked?: boolean
}

interface Member {
  id: string
  name: string
  avatar: string
  points: number
  level: number
  streak: number
  badge?: 'gold' | 'silver' | 'bronze'
}

// Mock Data
const courses: Course[] = [
  {
    id: '1',
    title: 'أساسيات الوساطة العقارية',
    description: 'تعلم أساسيات العمل كوسيط عقاري محترف من الصفر',
    thumbnail: '/api/placeholder/400/225',
    instructor: 'أ. محمد الشهري',
    duration: '10 ساعات',
    lessons: 24,
    progress: 65,
    category: 'مبتدئ',
  },
  {
    id: '2',
    title: 'التسويق العقاري الرقمي',
    description: 'استراتيجيات التسويق الحديثة للعقارات عبر الإنترنت',
    thumbnail: '/api/placeholder/400/225',
    instructor: 'أ. سارة الدوسري',
    duration: '8 ساعات',
    lessons: 18,
    progress: 30,
    category: 'متوسط',
  },
  {
    id: '3',
    title: 'فن التفاوض وإغلاق الصفقات',
    description: 'تقنيات احترافية للتفاوض وإغلاق الصفقات العقارية',
    thumbnail: '/api/placeholder/400/225',
    instructor: 'أ. عبدالله القحطاني',
    duration: '6 ساعات',
    lessons: 15,
    category: 'متقدم',
  },
  {
    id: '4',
    title: 'الذكاء الاصطناعي في العقار',
    description: 'كيف تستخدم AI لأتمتة عملك العقاري',
    thumbnail: '/api/placeholder/400/225',
    instructor: 'م. خالد العتيبي',
    duration: '5 ساعات',
    lessons: 12,
    locked: true,
    category: 'متقدم',
  },
  {
    id: '5',
    title: 'التصوير العقاري الاحترافي',
    description: 'تعلم تصوير العقارات بشكل احترافي يجذب العملاء',
    thumbnail: '/api/placeholder/400/225',
    instructor: 'أ. فهد المالكي',
    duration: '4 ساعات',
    lessons: 10,
    locked: true,
    category: 'متوسط',
  },
  {
    id: '6',
    title: 'إدارة علاقات العملاء CRM',
    description: 'استخدام أنظمة CRM لتنظيم وتتبع العملاء',
    thumbnail: '/api/placeholder/400/225',
    instructor: 'م. نورة الزهراني',
    duration: '3 ساعات',
    lessons: 8,
    locked: true,
    category: 'متوسط',
  },
]

const discussions: Discussion[] = [
  {
    id: '1',
    author: {
      name: 'فهد المطيري',
      avatar: '/api/placeholder/40/40',
      level: 12,
    },
    content: 'شاركت اليوم في أول صفقة بعد تطبيق ما تعلمته من دورة التفاوض - النتيجة كانت مذهلة! العميل وافق على السعر المطلوب بالكامل. شكراً أكاديمية مسار العقار 🎉',
    likes: 47,
    comments: 12,
    time: 'منذ ساعتين',
    liked: true,
  },
  {
    id: '2',
    author: {
      name: 'نورة السالم',
      avatar: '/api/placeholder/40/40',
      level: 8,
    },
    content: 'سؤال للخبراء: ما هي أفضل استراتيجية للتسويق على انستقرام للعقارات السكنية؟ جربت عدة طرق لكن النتائج ليست كما توقعت.',
    likes: 23,
    comments: 34,
    time: 'منذ 4 ساعات',
  },
  {
    id: '3',
    author: {
      name: 'سعود الحربي',
      avatar: '/api/placeholder/40/40',
      level: 15,
    },
    content: 'نصيحة اليوم: لا تبدأ بعرض العقار مباشرة. اسأل العميل أولاً عن احتياجاته وأولوياته. هذا سيوفر عليك وقت كبير ويزيد نسبة الإغلاق بشكل ملحوظ.',
    image: '/api/placeholder/600/300',
    likes: 89,
    comments: 28,
    time: 'منذ 6 ساعات',
  },
]

const leaderboard: Member[] = [
  { id: '1', name: 'خالد العتيبي', avatar: '/api/placeholder/48/48', points: 2840, level: 24, streak: 45, badge: 'gold' },
  { id: '2', name: 'سارة الدوسري', avatar: '/api/placeholder/48/48', points: 2650, level: 22, streak: 38, badge: 'silver' },
  { id: '3', name: 'محمد الشهري', avatar: '/api/placeholder/48/48', points: 2420, level: 20, streak: 30, badge: 'bronze' },
  { id: '4', name: 'فهد المطيري', avatar: '/api/placeholder/48/48', points: 2180, level: 18, streak: 25 },
  { id: '5', name: 'نورة السالم', avatar: '/api/placeholder/48/48', points: 1950, level: 16, streak: 20 },
  { id: '6', name: 'عبدالله القحطاني', avatar: '/api/placeholder/48/48', points: 1820, level: 15, streak: 18 },
  { id: '7', name: 'ريم الزهراني', avatar: '/api/placeholder/48/48', points: 1650, level: 14, streak: 15 },
  { id: '8', name: 'سعود الحربي', avatar: '/api/placeholder/48/48', points: 1520, level: 13, streak: 12 },
]

const upcomingEvents = [
  { title: 'ورشة التسويق الرقمي', date: 'الأحد 28 فبراير', time: '7:00 م', attendees: 45 },
  { title: 'جلسة أسئلة وأجوبة مع الخبراء', date: 'الثلاثاء 2 مارس', time: '8:00 م', attendees: 120 },
  { title: 'تحدي الـ 30 يوم للمبيعات', date: 'الأربعاء 3 مارس', time: '9:00 ص', attendees: 85 },
]

type TabType = 'community' | 'classroom' | 'calendar' | 'leaderboard'

export default function AcademyPage() {
  const [activeTab, setActiveTab] = useState<TabType>('community')
  const [searchQuery, setSearchQuery] = useState('')

  const getBadgeIcon = (badge?: 'gold' | 'silver' | 'bronze') => {
    switch (badge) {
      case 'gold':
        return <Crown className="w-5 h-5 text-yellow-500" />
      case 'silver':
        return <Medal className="w-5 h-5 text-gray-400" />
      case 'bronze':
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      
      {/* Top Header Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Community Name */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">أكاديمية مسار العقار</h1>
                <p className="text-xs text-gray-500">2,450 عضو • تعلم، تواصل، تطور</p>
              </div>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث في المجتمع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 rounded-xl pr-10 pl-4 py-2.5 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                م
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1">
            {[
              { id: 'community', label: 'المجتمع', icon: Home },
              { id: 'classroom', label: 'الدورات', icon: BookOpen },
              { id: 'calendar', label: 'الفعاليات', icon: Calendar },
              { id: 'leaderboard', label: 'المتصدرين', icon: Trophy },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-5 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-primary border-primary'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          
          {/* Main Content Area */}
          <main>
            <AnimatePresence mode="wait">
              {activeTab === 'community' && (
                <motion.div
                  key="community"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {/* Create Post */}
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        م
                      </div>
                      <input
                        type="text"
                        placeholder="شارك شيئاً مع المجتمع..."
                        className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  {/* Discussions */}
                  {discussions.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl p-5 border border-gray-200"
                    >
                      {/* Author */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                              {post.author.name.charAt(0)}
                            </div>
                            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
                              {post.author.level}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{post.author.name}</h4>
                            <p className="text-sm text-gray-500">{post.time}</p>
                          </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Content */}
                      <p className="text-gray-800 leading-relaxed mb-4">{post.content}</p>

                      {/* Image */}
                      {post.image && (
                        <div className="mb-4 rounded-xl overflow-hidden bg-gray-100 aspect-video" />
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                        <button className={`flex items-center gap-2 transition-colors ${post.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
                          <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                          <span className="font-medium">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span className="font-medium">{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
                          <Share2 className="w-5 h-5" />
                          <span className="font-medium">مشاركة</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'classroom' && (
                <motion.div
                  key="classroom"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {/* Progress Banner */}
                  <div className="bg-gradient-to-l from-primary to-orange-600 rounded-xl p-6 mb-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold mb-2">أكمل رحلتك التعليمية</h2>
                        <p className="opacity-90">أنت في المستوى 8 - أكمل 3 دورات للوصول للمستوى التالي</p>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold">65%</div>
                        <div className="text-sm opacity-90">مكتمل</div>
                      </div>
                    </div>
                    <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>

                  {/* Courses Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {courses.map((course) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`bg-white rounded-xl border border-gray-200 overflow-hidden group hover:shadow-lg transition-all ${course.locked ? 'opacity-75' : ''}`}
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
                          <div className="absolute inset-0 flex items-center justify-center">
                            {course.locked ? (
                              <div className="w-12 h-12 rounded-full bg-gray-900/50 flex items-center justify-center">
                                <Lock className="w-6 h-6 text-white" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="w-6 h-6 text-white fill-white mr-[-2px]" />
                              </div>
                            )}
                          </div>
                          {course.progress !== undefined && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
                              <div className="h-full bg-primary" style={{ width: `${course.progress}%` }} />
                            </div>
                          )}
                          <span className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold ${
                            course.category === 'مبتدئ' ? 'bg-green-500 text-white' :
                            course.category === 'متوسط' ? 'bg-yellow-500 text-white' :
                            'bg-red-500 text-white'
                          }`}>
                            {course.category}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {course.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <Play className="w-4 h-4" />
                                {course.lessons} درس
                              </span>
                            </div>
                            {course.progress !== undefined && (
                              <span className="text-primary font-medium">{course.progress}%</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'calendar' && (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4">الفعاليات القادمة</h2>
                  
                  {upcomingEvents.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl p-5 border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-orange-100 flex items-center justify-center">
                          <Calendar className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-500">{event.date} • {event.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Users className="w-4 h-4" />
                            <span className="font-medium">{event.attendees}</span>
                          </div>
                          <span className="text-xs text-gray-400">مشارك</span>
                        </div>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                          سجل الآن
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'leaderboard' && (
                <motion.div
                  key="leaderboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                      <h2 className="text-xl font-bold text-gray-900">ترتيب الأعضاء</h2>
                      <p className="text-gray-500">أكثر الأعضاء نشاطاً هذا الشهر</p>
                    </div>
                    
                    {/* Top 3 */}
                    <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-b from-gray-50 to-white">
                      {leaderboard.slice(0, 3).map((member, index) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`text-center ${index === 1 ? 'order-first md:order-none' : ''}`}
                        >
                          <div className={`relative mx-auto mb-3 ${index === 0 ? 'w-20 h-20' : 'w-16 h-16'}`}>
                            <div className={`w-full h-full rounded-full bg-gradient-to-br ${
                              index === 0 ? 'from-yellow-400 to-yellow-600' :
                              index === 1 ? 'from-gray-300 to-gray-500' :
                              'from-amber-500 to-amber-700'
                            } flex items-center justify-center text-white font-bold text-xl`}>
                              {member.name.charAt(0)}
                            </div>
                            <span className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm ${
                              index === 0 ? 'bg-yellow-500 text-white' :
                              index === 1 ? 'bg-gray-400 text-white' :
                              'bg-amber-600 text-white'
                            }`}>
                              {index + 1}
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-500">{member.points.toLocaleString()} نقطة</p>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-medium text-orange-500">{member.streak} يوم</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Rest of Leaderboard */}
                    <div className="divide-y divide-gray-100">
                      {leaderboard.slice(3).map((member, index) => (
                        <div key={member.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <span className="w-8 text-center font-bold text-gray-400">{index + 4}</span>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{member.name}</h4>
                              <p className="text-sm text-gray-500">المستوى {member.level}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-orange-500">
                              <Flame className="w-4 h-4" />
                              <span className="font-medium">{member.streak}</span>
                            </div>
                            <div className="text-left">
                              <span className="font-bold text-gray-900">{member.points.toLocaleString()}</span>
                              <span className="text-gray-500 text-sm mr-1">نقطة</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:block space-y-6">
            {/* Your Progress */}
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                تقدمك
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">المستوى</span>
                  <span className="font-bold text-primary">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">النقاط</span>
                  <span className="font-bold text-gray-900">1,240</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">الدورات المكتملة</span>
                  <span className="font-bold text-gray-900">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">أيام متتالية</span>
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="font-bold text-orange-500">12</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini Leaderboard */}
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  المتصدرين
                </span>
                <button 
                  onClick={() => setActiveTab('leaderboard')}
                  className="text-primary text-sm hover:underline"
                >
                  عرض الكل
                </button>
              </h3>
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((member, index) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <span className={`w-5 text-center font-bold ${
                      index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-400' :
                      index === 2 ? 'text-amber-600' :
                      'text-gray-400'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate text-sm">{member.name}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-500">{member.points.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                فعاليات قادمة
              </h3>
              <div className="space-y-3">
                {upcomingEvents.slice(0, 2).map((event, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-primary to-orange-600 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-6 h-6" />
                <h3 className="font-bold">ترقية للـ Pro</h3>
              </div>
              <p className="text-sm opacity-90 mb-4">
                احصل على وصول كامل لجميع الدورات والمحتوى الحصري
              </p>
              <button className="w-full bg-white text-primary font-bold py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                ترقية الآن
              </button>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  )
}
