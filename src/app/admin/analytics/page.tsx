'use client'

import { 
  TrendingUp, 
  TrendingDown,
  Users,
  CreditCard,
  MessageSquare,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download
} from 'lucide-react'

const monthlyData = [
  { month: 'يناير', subscribers: 35, revenue: 32400, messages: 125000 },
  { month: 'فبراير', subscribers: 38, revenue: 36200, messages: 142000 },
  { month: 'مارس', subscribers: 42, revenue: 40800, messages: 168000 },
  { month: 'أبريل', subscribers: 45, revenue: 43200, messages: 185000 },
  { month: 'مايو', subscribers: 48, revenue: 45600, messages: 198000 },
]

const topClients = [
  { name: 'مجموعة الدار العقارية', messages: 45230, growth: '+15%' },
  { name: 'شركة البناء الذهبي', messages: 24560, growth: '+12%' },
  { name: 'مكتب دار الإعمار', messages: 15420, growth: '+8%' },
  { name: 'عقارات الرياض الحديثة', messages: 12450, growth: '+22%' },
  { name: 'عقارات المستقبل', messages: 8340, growth: '+5%' },
]

const metrics = [
  {
    title: 'معدل النمو الشهري',
    value: '١٢%',
    change: '+3%',
    trend: 'up',
    description: 'مقارنة بالشهر السابق',
    icon: TrendingUp,
    color: 'from-green-500 to-green-600',
  },
  {
    title: 'معدل الاحتفاظ بالعملاء',
    value: '٩٤%',
    change: '+2%',
    trend: 'up',
    description: 'آخر 6 أشهر',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'متوسط الإيراد لكل عميل',
    value: '٩٥٠ ر.س',
    change: '+8%',
    trend: 'up',
    description: 'ARPU شهري',
    icon: CreditCard,
    color: 'from-primary to-orange-600',
  },
  {
    title: 'معدل إلغاء الاشتراك',
    value: '٢.٥%',
    change: '-0.5%',
    trend: 'down',
    description: 'Churn Rate',
    icon: TrendingDown,
    color: 'from-purple-500 to-purple-600',
  },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-cairo">التحليلات</h1>
          <p className="text-gray-400 mt-1">تحليلات وإحصائيات تفصيلية عن أداء المنصة</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary">
            <option>آخر 30 يوم</option>
            <option>آخر 3 أشهر</option>
            <option>آخر 6 أشهر</option>
            <option>هذه السنة</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border border-[#21262d] text-gray-400 rounded-xl text-sm hover:text-white hover:border-primary transition-all">
            <Download className="w-4 h-4" />
            تصدير التقرير
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div 
            key={index}
            className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-5 hover:border-primary/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`flex items-center gap-1 text-sm ${
                (metric.trend === 'up' && metric.title !== 'معدل إلغاء الاشتراك') || 
                (metric.trend === 'down' && metric.title === 'معدل إلغاء الاشتراك')
                  ? 'text-green-500' 
                  : 'text-red-500'
              }`}>
                {metric.change}
                {metric.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm">{metric.title}</h3>
            <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
            <p className="text-gray-500 text-xs mt-2">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">الإيرادات الشهرية</h2>
          <div className="h-64 flex items-end justify-between gap-4">
            {monthlyData.map((data, index) => {
              const maxRevenue = Math.max(...monthlyData.map(d => d.revenue))
              const height = (data.revenue / maxRevenue) * 100
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[#161b22] rounded-t-lg relative overflow-hidden" style={{ height: '200px' }}>
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-orange-500 rounded-t-lg transition-all duration-500"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-xs">{data.month}</span>
                  <span className="text-white text-sm font-medium">{(data.revenue / 1000).toFixed(1)}K</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Subscribers Growth */}
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">نمو المشتركين</h2>
          <div className="h-64 flex items-end justify-between gap-4">
            {monthlyData.map((data, index) => {
              const maxSubs = Math.max(...monthlyData.map(d => d.subscribers))
              const height = (data.subscribers / maxSubs) * 100
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[#161b22] rounded-t-lg relative overflow-hidden" style={{ height: '200px' }}>
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg transition-all duration-500"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-xs">{data.month}</span>
                  <span className="text-white text-sm font-medium">{data.subscribers}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Messages & Top Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages Stats */}
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">إحصائيات الرسائل</h2>
          <div className="space-y-4">
            <div className="p-4 bg-[#161b22] rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">رسائل اليوم</span>
                <span className="text-green-500 text-xs">+18%</span>
              </div>
              <p className="text-2xl font-bold text-white">١٢,٤٥٠</p>
            </div>
            <div className="p-4 bg-[#161b22] rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">رسائل هذا الأسبوع</span>
                <span className="text-green-500 text-xs">+12%</span>
              </div>
              <p className="text-2xl font-bold text-white">٧٨,٣٢٠</p>
            </div>
            <div className="p-4 bg-[#161b22] rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">رسائل هذا الشهر</span>
                <span className="text-green-500 text-xs">+15%</span>
              </div>
              <p className="text-2xl font-bold text-white">١٩٨,٠٠٠</p>
            </div>
            <div className="p-4 bg-[#161b22] rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">متوسط وقت الرد</span>
                <span className="text-green-500 text-xs">-5%</span>
              </div>
              <p className="text-2xl font-bold text-white">٢.٣ ثانية</p>
            </div>
          </div>
        </div>

        {/* Top Clients */}
        <div className="lg:col-span-2 bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">أكثر العملاء نشاطاً</h2>
          <div className="space-y-3">
            {topClients.map((client, index) => {
              const maxMessages = Math.max(...topClients.map(c => c.messages))
              const width = (client.messages / maxMessages) * 100
              return (
                <div key={index} className="p-4 bg-[#161b22] rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {index + 1}
                      </span>
                      <span className="text-white font-medium">{client.name}</span>
                    </div>
                    <div className="text-left">
                      <span className="text-white font-bold">{client.messages.toLocaleString()}</span>
                      <span className="text-green-500 text-xs mr-2">{client.growth}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-[#21262d] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-l from-primary to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
