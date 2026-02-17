'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Star,
  Archive,
  Trash2,
  Check,
  CheckCheck
} from 'lucide-react'

const conversations = [
  { 
    id: 1, 
    name: 'محمد أحمد العتيبي', 
    lastMessage: 'شكراً لكم، سأحضر المعاينة غداً إن شاء الله',
    time: '10:30 ص',
    unread: 2,
    online: true,
    avatar: 'م'
  },
  { 
    id: 2, 
    name: 'سارة علي المطيري', 
    lastMessage: 'هل يمكن تأجيل الموعد للأسبوع القادم؟',
    time: '10:15 ص',
    unread: 0,
    online: true,
    avatar: 'س'
  },
  { 
    id: 3, 
    name: 'فهد خالد السبيعي', 
    lastMessage: 'ما هو السعر النهائي للأرض؟',
    time: '09:45 ص',
    unread: 1,
    online: false,
    avatar: 'ف'
  },
  { 
    id: 4, 
    name: 'نورة محمد الدوسري', 
    lastMessage: 'تم الاتفاق على السعر، متى نوقع العقد؟',
    time: '09:30 ص',
    unread: 0,
    online: false,
    avatar: 'ن'
  },
  { 
    id: 5, 
    name: 'عبدالرحمن سعد', 
    lastMessage: 'أريد معاينة شقة أخرى في نفس الحي',
    time: 'أمس',
    unread: 0,
    online: false,
    avatar: 'ع'
  },
]

const messages = [
  { id: 1, sender: 'client', text: 'السلام عليكم، أبحث عن شقة في حي الملقا', time: '10:00 ص', status: 'read' },
  { id: 2, sender: 'me', text: 'وعليكم السلام ورحمة الله! أهلاً بك. نعم لدينا عدة خيارات رائعة في الملقا. ما المساحة التي تبحث عنها؟', time: '10:01 ص', status: 'read' },
  { id: 3, sender: 'client', text: 'أبحث عن شقة 3 غرف، مساحة 150-180 متر تقريباً', time: '10:05 ص', status: 'read' },
  { id: 4, sender: 'me', text: 'ممتاز! لدينا شقة مميزة 3 غرف + صالة + مطبخ، المساحة 165 متر، الطابق الثالث مع مصعد. السعر 850,000 ريال.', time: '10:06 ص', status: 'read' },
  { id: 5, sender: 'client', text: 'يبدو جيداً، هل يمكنني معاينة الشقة؟', time: '10:10 ص', status: 'read' },
  { id: 6, sender: 'me', text: 'بالتأكيد! متى يناسبك؟ يمكننا جدولة معاينة غداً الساعة 10 صباحاً أو 2 ظهراً', time: '10:12 ص', status: 'read' },
  { id: 7, sender: 'client', text: 'الساعة 10 صباحاً مناسبة لي', time: '10:20 ص', status: 'read' },
  { id: 8, sender: 'me', text: 'تم تأكيد الموعد ✅ غداً الساعة 10 صباحاً. سأرسل لك الموقع على الخريطة.', time: '10:22 ص', status: 'read' },
  { id: 9, sender: 'client', text: 'شكراً لكم، سأحضر المعاينة غداً إن شاء الله', time: '10:30 ص', status: 'delivered' },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState('')

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Conversations List */}
      <div className="w-80 bg-surface border border-border rounded-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="ابحث في المحادثات..."
              className="w-full bg-background border border-border rounded-xl pr-10 pl-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`p-4 cursor-pointer transition-colors border-b border-border/50 ${
                selectedConversation.id === conv.id ? 'bg-primary/5 border-r-2 border-r-primary' : 'hover:bg-background/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {conv.avatar}
                  </div>
                  {conv.online && (
                    <span className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 border-2 border-surface rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-text-primary text-sm truncate">{conv.name}</h3>
                    <span className="text-text-muted text-xs">{conv.time}</span>
                  </div>
                  <p className="text-text-secondary text-xs mt-1 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-surface border border-border rounded-2xl flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {selectedConversation.avatar}
              </div>
              {selectedConversation.online && (
                <span className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-green-500 border-2 border-surface rounded-full"></span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-text-primary">{selectedConversation.name}</h3>
              <p className="text-xs text-text-muted">
                {selectedConversation.online ? 'متصل الآن' : 'آخر ظهور 10:30 ص'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-text-secondary hover:text-green-500 hover:border-green-500 transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-text-secondary hover:text-blue-500 hover:border-blue-500 transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-colors">
              <Star className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'me' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[70%] ${msg.sender === 'me' ? 'order-1' : 'order-2'}`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  msg.sender === 'me' 
                    ? 'bg-primary/10 rounded-bl-sm' 
                    : 'bg-background border border-border rounded-br-sm'
                }`}>
                  <p className="text-text-primary text-sm leading-relaxed">{msg.text}</p>
                </div>
                <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'me' ? '' : 'justify-end'}`}>
                  <span className="text-text-muted text-xs">{msg.time}</span>
                  {msg.sender === 'me' && (
                    msg.status === 'read' 
                      ? <CheckCheck className="w-4 h-4 text-blue-500" />
                      : <Check className="w-4 h-4 text-text-muted" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="اكتب رسالتك..."
              className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
            <button className="w-12 h-12 rounded-xl bg-primary hover:bg-primary-dark text-white flex items-center justify-center transition-colors">
              <Send className="w-5 h-5 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
