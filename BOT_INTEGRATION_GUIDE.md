# 🤖 WhatsApp Bot Integration Guide

## نظرة عامة

يوفر Masaralaqar تكاملاً كاملاً مع بوت الواتساب للرد الآلي على استفسارات العملاء وإدارة الاشتراكات.

---

## ✅ ما تم تنفيذه

### 1. **API Routes**

#### `/api/bot/subscription` (POST)
تفعيل اشتراك بوت الواتساب للمستخدم.

**Request:**
```json
{
  "phone": "966501234567",
  "planType": "basic",
  "userId": "user-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription activated successfully",
  "data": {
    "phone": "966501234567",
    "planType": "basic",
    "status": "active",
    "expiresAt": "2026-04-05T..."
  }
}
```

**الميزات:**
- ✅ Validation رقم الواتساب (صيغة سعودية)
- ✅ إعادة محاولة تلقائية (3 مرات)
- ✅ معالجة الأخطاء الشاملة
- ✅ Logging لجميع المحاولات

---

#### `/api/bot/status` (GET)
الحصول على حالة الاشتراك الحالية.

**Query Parameters:**
- `phone` (required): رقم الواتساب

**Response:**
```json
{
  "success": true,
  "data": {
    "phone": "966501234567",
    "planType": "basic",
    "status": "active",
    "usageCount": 45,
    "monthlyLimit": 100,
    "remainingChats": 55,
    "usagePercentage": 45,
    "isExpired": false
  }
}
```

---

### 2. **Utility Functions** (`src/lib/bot.ts`)

#### Phone Validation & Formatting
```typescript
import { isValidSaudiPhone, formatSaudiPhone } from '@/lib/bot'

// Validate phone
isValidSaudiPhone('966501234567')  // ✓ true
isValidSaudiPhone('5012345678')    // ✗ false

// Format to standard 966XXXXXXXXX
formatSaudiPhone('05012345678')     // '966501234567'
formatSaudiPhone('00966501234567')  // '966501234567'
```

#### Plan Utilities
```typescript
import { 
  getPlanPrice,
  getPlanChatLimit,
  getPlanNameArabic,
  getBotWhatsAppLink
} from '@/lib/bot'

getPlanPrice('pro')                 // 299
getPlanChatLimit('basic')           // 100
getPlanNameArabic('free')           // 'مجاني'
getBotWhatsAppLink('966501234567')  // 'https://wa.me/966501234567'
```

---

### 3. **Database Schema**

جدول `bot_subscriptions`:
```sql
id              UUID PRIMARY KEY
user_id         UUID (FK → auth.users)
phone           VARCHAR(20) UNIQUE
plan_type       'free' | 'basic' | 'pro'
status          'active' | 'inactive' | 'suspended'
usage_count     INT (default: 0)
monthly_limit   INT
activated_at    TIMESTAMP
expires_at      TIMESTAMP
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

**الفهارس:**
- `user_id` - للبحث السريع برقم المستخدم
- `phone` - للبحث السريع برقم الواتساب
- `status` - لتصفية الاشتراكات النشطة

**RLS Policies:**
- ✅ المستخدمون يرون اشتراكاتهم فقط
- ✅ الإداريون يرون جميع الاشتراكات
- ✅ الخدمات يمكنها الإدراج فقط

---

### 4. **Dashboard Component** (`BotSubscription.tsx`)

عرض حالة الاشتراك وإحصائيات الاستخدام:

```typescript
import { BotSubscription } from '@/components/BotSubscription'

export default function Dashboard() {
  return (
    <BotSubscription
      showUpgradeButton={true}
      showWhatsAppButton={true}
      onUpgradClick={() => { /* handle upgrade */ }}
    />
  )
}
```

**الميزات:**
- 📊 عرض حالة الاشتراك الحالي
- 📈 شريط تقدم استخدام الرسائل
- 🔴 تحذير عند الاقتراب من الحد الأقصى
- 📱 زر مباشر لفتح الواتساب
- ⬆️ زر ترقية إلى خطة أعلى

---

### 5. **صفحة التسعير** (`/products/pricing`)

عرض الخطط المتاحة مع أزرار الاتصال عبر الواتساب:

**الخطط:**
- 🆓 **مجاني**: 10 رسائل/شهر
- ⚡ **أساسي**: 100 رسالة/شهر - 99 ر.س
- 👑 **احترافي**: غير محدود - 299 ر.س

**الميزات:**
- ✓ عرض المميزات لكل خطة
- ✓ أزرار WhatsApp مباشرة مع رسالة مخصصة
- ✓ أسئلة شائعة
- ✓ تصابت للصغر والكبر

---

### 6. **Payment Integration** (`src/lib/payments.ts`)

عند تحقق الدفع، يتم تفعيل اشتراك البوت تلقائياً:

```typescript
import { activateBotSubscription } from '@/lib/payments'

// بعد التحقق من الدفع
const result = await activateBotSubscription(
  userId,
  '966501234567',
  'basic'
)

if (result.success) {
  // تم تفعيل البوت بنجاح
}
```

---

## 📋 متطلبات الحالة / الخطوات التالية

### ✅ المكتملة:
- ✓ API routes للاشتراك والحالة
- ✓ Utility functions للهاتف والخطط
- ✓ Database migration
- ✓ Dashboard component
- ✓ صفحة التسعير
- ✓ Payment integration

### ⏳ المتبقية (اختياري):
1. **تحديث صفحة Saqr** - إضافة أزرار WhatsApp
2. **Admin Dashboard** - إدارة الاشتراكات
3. **الإشعارات** - إرسال تنبيهات عند انتهاء الاشتراك
4. **Analytics** - تقارير الاستخدام
5. **Webhook Handler** - معالجة الرسائل من البوت

---

## 🔧 الإعدادات المطلوبة

### `.env.local`
```env
# بوت الواتساب
BOT_SERVER_URL=https://your-bot-server.com
NEXT_PUBLIC_BOT_WHATSAPP_NUMBER=966XXXXXXXXX

# Supabase (موجود)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Supabase Setup
1. Run migration `010_create_bot_subscriptions.sql`
2. Verify RLS policies are enabled
3. Test إدراج صف تجريبي

---

## 🧪 اختبار

### اختبار Validation:
```bash
npm run dev
# زيارة http://localhost:3000/products/pricing
```

### اختبار API:
```bash
curl -X POST http://localhost:3000/api/bot/subscription \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "966501234567",
    "planType": "basic",
    "userId": "test-user-id"
  }'
```

### اختبار Dashboard:
```typescript
// في صفحة Dashboard
import { BotSubscription } from '@/components/BotSubscription'

export default function DashboardPage() {
  return <BotSubscription />
}
```

---

## 📞 الدعم

للأسئلة أو المشاكل:
1. راجع الـ logs في Supabase
2. تحقق من متغيرات `.env.local`
3. تأكد من تفعيل RLS في Database
4. انظر إلى API response الكامل للأخطاء

---

**النسخة**: 1.0
**آخر تحديث**: مارس 2026
