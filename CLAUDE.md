# CLAUDE.md — دليل مشروع مسار العقار (Masaralaqar)

## نظرة عامة

**Masaralaqar (مسار العقار)** منصة PropTech عربية (RTL) مبنية بـ **Next.js 15 App Router**. تجمع:
- **موقع تسويقي**: منتجات، مدونة، مكتبة
- **Dashboard المستخدم**: إدارة العقارات، العملاء، الرسائل، الإحصائيات
- **بوت MQ**: واتساب AI مع WAHA + Redis/BullMQ
- **Admin panel**: إدارة المنصة، المشتركين، المدفوعات
- **نظام اشتراكات** عبر Moyasar + تحويل بنكي

---

## Tech Stack

| Layer | التقنية |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui + Framer Motion |
| DB | Supabase (PostgreSQL + RLS + Auth + Storage) |
| Queue | Redis + BullMQ (whatsapp-messages queue) |
| WhatsApp | WAHA (`office_{officeId}` per office) |
| AI | OpenAI (GPT-4o-mini) |
| Payments | Moyasar + Bank Transfer |
| Media | Cloudinary |
| Deploy | Vercel (Next.js) + VPS/Docker لـ WAHA وRedis/worker حسب الإعداد |

---

## هيكل المشروع

```text
masaralaqar/
├─ src/
│  ├─ app/
│  │  ├─ dashboard/        ← لوحة المستخدم (sidebar layout موحّد)
│  │  │  ├─ layout.tsx     ← DashboardSidebar + mobile top bar
│  │  │  ├─ page.tsx       ← الرئيسية (إحصائيات حقيقية)
│  │  │  ├─ properties/    ← إدارة العقارات + add
│  │  │  ├─ clients/       ← العملاء المحتملون (leads)
│  │  │  ├─ messages/      ← المحادثات (full-height flex layout)
│  │  │  ├─ viewings/      ← طلبات المعاينة
│  │  │  ├─ analytics/     ← Recharts + system metrics
│  │  │  ├─ whatsapp/      ← ربط QR + حالة الاتصال
│  │  │  ├─ ai-listings/   ← مولّد الإعلانات الذكي
│  │  │  ├─ ai-agent/      ← شخصية وإعدادات البوت
│  │  │  ├─ unanswered-questions/ ← أسئلة معلّقة
│  │  │  ├─ reports/       ← تصدير PDF (pdfkit)
│  │  │  ├─ settings/      ← بيانات شخصية + كلمة مرور
│  │  │  └─ subscription/  ← باقات الاشتراك + checkout
│  │  ├─ admin/            ← لوحة الإدارة (AdminSidebar)
│  │  │  ├─ page.tsx       ← إحصائيات المنصة
│  │  │  ├─ subscribers/   ← المكاتب (API حقيقي)
│  │  │  ├─ plans/         ← الباقات
│  │  │  ├─ payments/      ← التحويلات البنكية
│  │  │  ├─ invoices/      ← الفواتير
│  │  │  ├─ trials/        ← طلبات التجربة
│  │  │  ├─ support/       ← تذاكر الدعم
│  │  │  ├─ ai-usage/      ← استهلاك AI
│  │  │  ├─ queues/        ← مراقبة BullMQ
│  │  │  ├─ system-analytics/ ← تحليلات المنصة
│  │  │  └─ whatsapp-sessions/ ← جلسات واتساب
│  │  └─ api/              ← API routes
│  ├─ components/
│  │  ├─ dashboard/sidebar.tsx  ← Sidebar (profile-aware, collapse, WA status)
│  │  └─ branding/MqLogo.tsx    ← شعار MQ
│  ├─ services/            ← Business logic
│  ├─ repositories/        ← Data access layer
│  ├─ integrations/        ← whatsapp.ts, openai.ts
│  ├─ workers/             ← BullMQ consumer (message.worker.ts)
│  ├─ queues/              ← BullMQ queue definitions
│  └─ lib/                 ← waha-client.ts, moyasar.ts, payments.ts, redis.ts...
├─ supabase/migrations/    ← المرجعية الوحيدة لمخطط DB
└─ scripts/                ← سكربتات تشغيل يدوية (اختياري)
```

---

## WAHA (واتساب)

```
Base URL : WAHA_API_URL (مثال: https://waha.example.com:3000)
Env      : WAHA_API_URL، WAHA_API_KEY
API Key  : يُرسل في الـ header باسم X-Api-Key
Session  : لكل مكتب اسم جلسة `office_{officeId}` (من instanceNameForOffice)
Webhook  : {NEXT_PUBLIC_URL}/api/webhook/whatsapp — أحداث message و session.status
```

---

## SaaS متعدد المستأجرين (Multi-tenancy)

- **المكتب**: `offices` + `users.office_id` — بيانات العقارات والعملاء والرسائل تُفلتر بـ `office_id` (انظر migrations من `019` وما بعدها).
- **جلسة WAHA**: اسم ثابت `office_{uuid}` — إنشاء الجلسة عبر `POST /api/sessions` على WAHA من `wahaCreateSession` / `ensureInstanceExists`.
- **Webhook → BullMQ**: `POST /api/webhook/whatsapp` يضع الرسائل في الطابور (`enqueueMessage`) مع fallback `InlineProcessor` إن تعذر Redis.
- **Worker**: `npm run worker` — `src/workers/message.worker.ts` يستهلك الطابور ويحدّث Supabase.
- **Realtime**: جدول `whatsapp_sessions` مُدرَج في `supabase_realtime` (migration `042`)؛ صفحة `/dashboard/whatsapp` تشترك لتحديث **متصل / جاري الربط / غير متصل** فور تغيّر `session_status` من الـ webhook.

---

## خطط الاشتراك

| Key | الاسم | السعر/شهر | العقارات | رسائل AI |
|-----|------|-----------|---------|---------:|
| `free` | مجاني | 0 | 10 | 10 |
| `basic` | أساسي | 99 | 50 | 100 |
| `pro` | احترافي | 299 | غير محدود | غير محدود (-1) |

- جداول DB: `subscription_plans`, `user_subscriptions`, `bank_transfers`, `invoices`, `payments`
- Moyasar callback → `/api/payments/callback` → يفعّل الاشتراك
- Bank transfer → `/api/payments/bank-transfer` → `status: pending` → Admin يوافق

---

## Tailwind Theme (ألوان المشروع)

```
background  : #070B14    surface : #0D1526   card : #111E35
primary     : #4F8EF7    primary-dark : #2B6DE8
text-primary: #F0F4FF    text-secondary : #94A3B8   text-muted : #475569
border      : rgba(79,142,247,0.12)
success     : #34D399    error : #F87171
```

---

## Dashboard Layout Rules

كل صفحة في `/dashboard/*` يجب أن:
- **تبدأ** بـ `<div className="min-h-full bg-surface">` (ليس `min-h-screen`)
- **لا تحتوي** على `<header>` sticky خاص بها (الـ layout يتكفّل بذلك)
- صفحة messages استثناء: تستخدم `h-full flex flex-col` + `flex-1 min-h-0`

---

## API الرئيسية

```
GET  /api/analytics              ← إحصائيات المكتب
GET  /api/leads/list             ← قائمة العملاء
GET  /api/offices/my             ← مكتب المستخدم الحالي
GET  /api/properties/my          ← عقارات المستخدم
GET  /api/unanswered-questions   ← أسئلة معلّقة
GET  /api/whatsapp/connect       ← حالة اتصال واتساب
POST /api/webhook/whatsapp       ← webhook من WAHA
GET  /api/plans                  ← الباقات المتاحة
GET  /api/subscription/current   ← اشتراك المستخدم الحالي
POST /api/payments/bank-transfer ← تسجيل تحويل بنكي
POST /api/payments/callback      ← Moyasar callback (GET)
GET  /api/admin/stats            ← إحصائيات المنصة (admin)
GET  /api/admin/subscribers      ← المشتركين (admin, paginated)
```

---

## أوامر التشغيل

```bash
# Next.js
npm install
npm run dev

# Worker (BullMQ) — شغّله على خادم طويل الأمد (Docker/VPS) يصل إلى REDIS_URL
npm run worker
```

---

## ملاحظات مهمة

1. **tenant_id**: يُستخرج دائماً من الجلسة في الـ API، لا من client
2. **جلسة WAHA**: اسم الجلسة لكل مكتب `office_{officeId}` عبر `instanceNameForOffice`
3. **supabaseAdmin**: للعمليات server-side التي تحتاج bypass RLS
4. **getServerUser()**: في `/api/*` routes للتحقق من المستخدم
5. **Admin role**: يُتحقق من `profile.role === 'admin'` في كل admin API
