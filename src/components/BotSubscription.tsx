'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { BotSubscription as BotSubscriptionType } from '@/lib/supabase'
import { getBotSubscription } from '@/lib/supabase'
import {
  getPlanChatLimit,
  getPlanPrice,
  getPlanNameArabic,
  getBotWhatsAppLink,
  getDefaultWhatsAppMessage,
} from '@/lib/bot'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface BotSubscriptionProps {
  showUpgradeButton?: boolean
  showWhatsAppButton?: boolean
  onUpgradClick?: () => void
}

export function BotSubscription({
  showUpgradeButton = true,
  showWhatsAppButton = true,
  onUpgradClick,
}: BotSubscriptionProps) {
  const { user, loading: authLoading } = useAuth()
  const [subscription, setSubscription] = useState<BotSubscriptionType | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || authLoading) return

    const fetchSubscription = async () => {
      try {
        const { data, error: err } = await getBotSubscription(user.id)
        if (err && err.code !== 'PGRST116') {
          // PGRST116 = no rows found
          throw new Error(err.message)
        }
        setSubscription(data || null)
        setError(null)
      } catch (err) {
        console.error('Error fetching bot subscription:', err)
        setError(
          err instanceof Error ? err.message : 'Failed to load subscription'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [user, authLoading])

  if (loading || authLoading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center h-24">
          <div className="text-gray-400">جاري التحميل...</div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6 border-red-500/20 bg-red-500/5">
        <div className="text-red-400">خطأ: {error}</div>
      </Card>
    )
  }

  if (!subscription) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">لم تشترك بعد</h3>
          <p className="text-gray-400 mb-4">
            اشترك في خدمة الواتساب AI لإدارة عملائك تلقائياً
          </p>
          {showWhatsAppButton && (
            <Button
              asChild
              className="bg-green-600 hover:bg-green-700"
            >
              <a
                href={getBotWhatsAppLink('966XXXXXXXXX')} // Replace with actual bot number
                target="_blank"
                rel="noopener noreferrer"
              >
                اتصل عبر الواتساب
              </a>
            </Button>
          )}
        </div>
      </Card>
    )
  }

  const monthlyLimit = getPlanChatLimit(subscription.plan_type)
  const planPrice = getPlanPrice(subscription.plan_type)
  const planNameArabic = getPlanNameArabic(subscription.plan_type)
  const progressPercentage =
    monthlyLimit > 0
      ? Math.min((subscription.usage_count / monthlyLimit) * 100, 100)
      : 100

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">اشتراك الواتساب AI</h3>
            <p className="text-gray-400 text-sm mt-1">
              الخطة: <span className="text-primary">{planNameArabic}</span>
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              subscription.status === 'active'
                ? 'bg-green-500/20 text-green-300'
                : subscription.status === 'suspended'
                  ? 'bg-red-500/20 text-red-300'
                  : 'bg-gray-500/20 text-gray-300'
            }`}
          >
            {subscription.status === 'active'
              ? 'نشط'
              : subscription.status === 'suspended'
                ? 'معلق'
                : 'غير نشط'}
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <p className="text-sm text-gray-400">رقم الواتساب</p>
          <p className="text-lg font-mono mt-1">{subscription.phone}</p>
        </div>

        {/* Usage Progress (only for paid plans) */}
        {monthlyLimit > 0 && (
          <div>
            <div className="flex justify-between mb-2">
              <p className="text-sm text-gray-400">الاستخدام الشهري</p>
              <p className="text-sm font-medium">
                {subscription.usage_count} / {monthlyLimit}
              </p>
            </div>
            <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            {progressPercentage >= 80 && (
              <p className="text-xs text-orange-400 mt-2">
                ⚠️ اقتربت من حدك الشهري
              </p>
            )}
          </div>
        )}

        {/* Expiration Date */}
        {subscription.expires_at && (
          <div>
            <p className="text-sm text-gray-400">تاريخ الانتهاء</p>
            <p className="text-sm mt-1">
              {new Date(subscription.expires_at).toLocaleDateString('ar-SA')}
            </p>
          </div>
        )}

        {/* Plan Details */}
        <div className="border-t border-gray-700 pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs">رسالة الواتساب</p>
              <p className="mt-1 font-medium">
                {monthlyLimit === -1 ? 'غير محدود' : monthlyLimit + ' رسالة/شهر'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">السعر</p>
              <p className="mt-1 font-medium">{planPrice} ر.س</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {showWhatsAppButton && (
            <Button
              asChild
              variant="outline"
              className="flex-1"
            >
              <a
                href={getBotWhatsAppLink(
                  subscription.phone,
                  getDefaultWhatsAppMessage(subscription.plan_type)
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                📱 افتح الواتساب
              </a>
            </Button>
          )}
          {showUpgradeButton && subscription.plan_type !== 'pro' && (
            <Button
              onClick={onUpgradClick}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              ترقية الخطة
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
