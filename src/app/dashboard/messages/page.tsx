'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  MessageSquare,
  ChevronRight,
  Loader2,
  Phone,
  Bot,
  User,
  RefreshCw,
  X,
} from 'lucide-react'

interface ConversationMessage {
  id: string
  role: 'user' | 'assistant'
  message: string
  timestamp: string
}

interface Lead {
  id: string
  name: string
  phone: string
  status: string
  last_contacted_at?: string
  created_at: string
  conversation_history?: ConversationMessage[]
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'الآن'
  if (mins < 60) return `${mins} د`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} س`
  return `${Math.floor(hours / 24)} ي`
}

export default function MessagesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Lead | null>(null)
  const [loadingConv, setLoadingConv] = useState(false)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/leads/list')
      const data = await res.json() as { success: boolean; leads: Lead[] }
      if (data.success) {
        // Only show leads that have had some interaction
        setLeads(data.leads.filter(l => l.last_contacted_at))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) fetchLeads()
  }, [user, fetchLeads])

  const openConversation = async (lead: Lead) => {
    setSelected(lead)
    if (!lead.conversation_history) {
      setLoadingConv(true)
      try {
        const res = await fetch(`/api/leads/${lead.id}`)
        const data = await res.json() as { success: boolean; lead: Lead }
        if (data.success) {
          setSelected(data.lead)
          setLeads(prev => prev.map(l => l.id === lead.id ? data.lead : l))
        }
      } finally {
        setLoadingConv(false)
      }
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/dashboard" className="text-text-secondary hover:text-primary transition-colors">
                لوحة التحكم
              </Link>
              <ChevronRight className="w-4 h-4 text-text-muted" />
              <span className="text-text-primary font-medium">الرسائل</span>
            </div>
            <button
              onClick={fetchLeads}
              className="p-2 text-text-secondary hover:text-primary transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6 h-[calc(100vh-10rem)]">
          {/* Leads list (sidebar) */}
          <div className={`flex flex-col ${selected ? 'hidden md:flex md:w-80' : 'w-full md:w-80'} bg-background rounded-xl border border-border overflow-hidden`}>
            <div className="p-4 border-b border-border">
              <h1 className="font-bold text-text-primary">المحادثات</h1>
              <p className="text-xs text-text-muted mt-0.5">{leads.length} محادثة</p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : leads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 gap-3 text-center px-4">
                  <MessageSquare className="w-8 h-8 text-primary/40" />
                  <p className="text-sm text-text-muted">لا توجد محادثات بعد</p>
                  <p className="text-xs text-text-muted">ستظهر هنا المحادثات التي يجريها صقر مع عملائك</p>
                </div>
              ) : (
                leads.map(lead => {
                  const history = Array.isArray(lead.conversation_history) ? lead.conversation_history : []
                  const lastMsg = history[history.length - 1]
                  const isActive = selected?.id === lead.id

                  return (
                    <button
                      key={lead.id}
                      onClick={() => openConversation(lead)}
                      className={`w-full text-right px-4 py-3 border-b border-border hover:bg-surface transition-colors ${
                        isActive ? 'bg-primary/5 border-r-2 border-r-primary' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-bold text-sm">
                            {lead.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm text-text-primary truncate">
                              {lead.name}
                            </span>
                            <span className="text-[10px] text-text-muted flex-shrink-0 mr-1">
                              {lead.last_contacted_at ? timeAgo(lead.last_contacted_at) : ''}
                            </span>
                          </div>
                          <p className="text-xs text-text-muted truncate mt-0.5">
                            {lastMsg ? lastMsg.message : 'لا توجد رسائل'}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Conversation panel */}
          {selected ? (
            <div className="flex-1 flex flex-col bg-background rounded-xl border border-border overflow-hidden">
              {/* Conv header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{selected.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">{selected.name}</p>
                    <div className="flex items-center gap-1 text-text-muted text-xs">
                      <Phone className="w-3 h-3" />
                      <span dir="ltr">{selected.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard/clients"
                    className="text-xs text-primary hover:underline"
                  >
                    عرض الملف
                  </Link>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-1 text-text-muted hover:text-text-primary md:hidden"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingConv ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : !selected.conversation_history?.length ? (
                  <div className="flex items-center justify-center h-full text-text-muted text-sm">
                    لا توجد رسائل في هذه المحادثة
                  </div>
                ) : (
                  selected.conversation_history.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex gap-2 ${msg.role === 'assistant' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        msg.role === 'assistant' ? 'bg-primary/10' : 'bg-surface border border-border'
                      }`}>
                        {msg.role === 'assistant'
                          ? <Bot className="w-3.5 h-3.5 text-primary" />
                          : <User className="w-3.5 h-3.5 text-text-muted" />
                        }
                      </div>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.role === 'assistant'
                          ? 'bg-primary/10 text-text-primary rounded-tr-sm'
                          : 'bg-surface border border-border text-text-primary rounded-tl-sm'
                      }`}>
                        <p className="leading-relaxed">{msg.message}</p>
                        <p className="text-[10px] text-text-muted mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center bg-background rounded-xl border border-border">
              <div className="text-center">
                <MessageSquare className="w-10 h-10 text-primary/30 mx-auto mb-3" />
                <p className="text-text-muted text-sm">اختر محادثة لعرضها</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
