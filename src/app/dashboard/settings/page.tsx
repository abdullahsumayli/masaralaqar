'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { updateUserProfile } from '@/lib/auth'
import { updatePassword } from '@/lib/auth'
import {
  Settings, ChevronRight, Loader2, User, Building2, Phone,
  Mail, Lock, Save, CheckCircle2, AlertCircle,
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()

  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [saving, setSaving] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setCompany(profile.company || '')
      setPhone(profile.phone || '')
    }
  }, [profile])

  const handleSaveProfile = async () => {
    if (!user) return
    setSaving(true)
    setMessage(null)

    const { error } = await updateUserProfile(user.id, { name, company, phone })

    if (error) {
      setMessage({ type: 'error', text: error })
    } else {
      setMessage({ type: 'success', text: 'تم حفظ البيانات بنجاح' })
    }
    setSaving(false)
  }

  const handleChangePassword = async () => {
    setSavingPassword(true)
    setPasswordMessage(null)

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
      setSavingPassword(false)
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'كلمة المرور الجديدة غير متطابقة' })
      setSavingPassword(false)
      return
    }

    const { error } = await updatePassword(newPassword)

    if (error) {
      setPasswordMessage({ type: 'error', text: error })
    } else {
      setPasswordMessage({ type: 'success', text: 'تم تغيير كلمة المرور بنجاح' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
    setSavingPassword(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface" dir="rtl">
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-2 text-sm">
            <Link href="/dashboard" className="text-text-secondary hover:text-primary transition-colors">
              لوحة التحكم
            </Link>
            <ChevronRight className="w-4 h-4 text-text-muted" />
            <span className="text-text-primary font-medium">الإعدادات</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Profile Section */}
        <section className="bg-background rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">البيانات الشخصية</h2>
              <p className="text-sm text-text-secondary">إدارة بياناتك الأساسية</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> الاسم</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder-text-muted focus:border-primary focus:outline-none transition"
                placeholder="اسمك الكامل"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> اسم المكتب / الشركة</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder-text-muted focus:border-primary focus:outline-none transition"
                placeholder="اسم المكتب"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> رقم الجوال</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder-text-muted focus:border-primary focus:outline-none transition"
                placeholder="05XXXXXXXX"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> البريد الإلكتروني</span>
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-surface/50 border border-border rounded-lg px-4 py-2.5 text-text-muted cursor-not-allowed"
                dir="ltr"
              />
            </div>
          </div>

          {message && (
            <div className={`flex items-center gap-2 mt-4 text-sm ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {message.text}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              حفظ التغييرات
            </button>
          </div>
        </section>

        {/* Password Section */}
        <section className="bg-background rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">تغيير كلمة المرور</h2>
              <p className="text-sm text-text-secondary">تحديث كلمة مرور حسابك</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-1.5">كلمة المرور الجديدة</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder-text-muted focus:border-primary focus:outline-none transition"
                placeholder="6 أحرف على الأقل"
                dir="ltr"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-1.5">تأكيد كلمة المرور الجديدة</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder-text-muted focus:border-primary focus:outline-none transition"
                placeholder="أعد كتابة كلمة المرور"
                dir="ltr"
              />
            </div>
          </div>

          {passwordMessage && (
            <div className={`flex items-center gap-2 mt-4 text-sm ${passwordMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {passwordMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {passwordMessage.text}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleChangePassword}
              disabled={savingPassword || !newPassword}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold text-background rounded-lg font-medium hover:bg-gold-dark transition-colors disabled:opacity-50"
            >
              {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              تحديث كلمة المرور
            </button>
          </div>
        </section>

        {/* Account Info */}
        <section className="bg-background rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">معلومات الحساب</h2>
              <p className="text-sm text-text-secondary">تفاصيل حسابك واشتراكك</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-surface rounded-lg p-4 border border-border">
              <p className="text-xs text-text-muted mb-1">نوع الاشتراك</p>
              <p className="text-text-primary font-bold">{profile?.subscription === 'pro' ? 'احترافي' : profile?.subscription === 'enterprise' ? 'مؤسسات' : 'مجاني'}</p>
            </div>
            <div className="bg-surface rounded-lg p-4 border border-border">
              <p className="text-xs text-text-muted mb-1">تاريخ الانضمام</p>
              <p className="text-text-primary font-bold" dir="ltr">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('ar-SA') : '—'}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
