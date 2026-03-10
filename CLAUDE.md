# CLAUDE.md — دليل مشروع مسار العقار (Masaralaqar)

## نظرة عامة

**Masaralaqar (مسار العقار)** منصة عربية (RTL) مبنية بـ **Next.js 15**. تجمع بين:
- **موقع تسويقي ومحتوى**: منتجات، مدونة، مكتبة…
- **لوحات تحكم**: Dashboard للمستخدم و Admin للإدارة
- **اشتراكات/مدفوعات** عبر Supabase
- **صقر (Saqr)**: بوت واتساب للاشتراك والتواصل والردود/الأتمتة

---

## التقنيات (Tech Stack)

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Content**: MDX (`@next/mdx`)
- **Backend/DB**: Supabase (PostgreSQL + RLS) + Supabase Auth + Supabase Storage
- **Optional Media**: Cloudinary (حسب الإعداد)
- **Node**: موصى به Node >= 20 (حسب `package.json`)
- **Deploy**: Vercel

---

## هيكل المشروع (Structure)

```text
masaralaqar/
├─ src/
│  ├─ app/                      # صفحات Next.js (App Router) + API routes
│  │  ├─ layout.tsx             # Root layout + RTL + SEO/Metadata + JSON-LD
│  │  ├─ page.tsx               # Landing page الرئيسية
│  │  ├─ dashboard/             # لوحة المستخدم
│  │  ├─ admin/                 # لوحة الإدارة
│  │  ├─ products/              # صفحات المنتجات والتسعير
│  │  ├─ blog/                  # المدونة (قائمة + [slug])
│  │  ├─ library/               # المكتبة
│  │  └─ api/                   # API routes (مثل خطط/بوت/ويبهوكات…)
│  ├─ components/               # مكوّنات مشتركة + UI primitives
│  ├─ hooks/                    # React hooks (مثل auth)
│  ├─ lib/                      # أدوات/مكتبات (Supabase/Payments/Bot…)
│  ├─ services/                 # منطق الأعمال (Business logic)
│  ├─ repositories/             # طبقة الوصول للبيانات (Queries/CRUD)
│  ├─ integrations/             # تكاملات خارجية (WhatsApp/OpenAI…)
│  └─ types/                    # تعريفات TypeScript للنماذج
├─ supabase/                    # SQL schema + migrations + سياسات RLS
├─ public/                      # ملفات ثابتة (Static assets)
├─ server/                      # خادم صقر (بوت واتساب) — Express
├─ scripts/                     # سكربتات مساعدة (تهيئة/إدارة…)
├─ next.config.ts               # إعدادات Next.js
├─ tailwind.config.ts           # إعدادات Tailwind والثيم
└─ tsconfig.json                # إعدادات TypeScript
```

---

## Subscription tiers (free / basic / professional)

### 1) خطط صقر (Saqr WhatsApp Bot)

داخل الكود، مفتاح الخطة هو: **`free` / `basic` / `pro`**.  
في التسويق/الواجهة، **Professional = `pro` (احترافي)**.

| Tier | Key (في الكود) | السعر الشهري (ر.س) | حد الرسائل/الشهر |
|------|-----------------|--------------------|------------------|
| Free | `free` | 0 | 10 |
| Basic | `basic` | 99 | 100 |
| Professional | `pro` | 299 | غير محدود |

ملاحظات تنفيذية:
- حد “غير محدود” ممثل برقم **`-1`** في دالة `getPlanChatLimit`.
- صفحة التسعير الخاصة بصقر: المسار `/products/pricing`.

### 2) اشتراكات المنصة (Platform subscriptions)

يوجد نظام اشتراكات/مدفوعات عام مرتبط بـ Supabase عبر جداول مثل:
`subscription_plans`, `user_subscriptions`, `bank_transfers`, `invoices`
(انظر `supabase/payment-schema.sql` و `src/lib/payments.ts`).

---

## `server/` هو خادم صقر (بوت واتساب)

المجلد `server/` يحتوي **خادم Node/Express منفصل** مخصص لبوت/تكاملات صقر، ويشغّل Routes مثل:
- Webhook endpoints
- إدارة بيانات (leads/properties/stats) بحسب routes الموجودة

ملفات مهمة:
- `server/index.js`: نقطة تشغيل الخادم (Express + CORS + logging + routes)
- `server/package.json`: اعتماديات الخادم (express, cors, better-sqlite3, pino…)

تشغيله:

```bash
cd server
npm install
npm run dev
```

---

## أوامر التشغيل (Quick commands)

تشغيل الواجهة (Next.js):

```bash
npm install
npm run dev
```

> بيئة البوت تحتاج مثلًا: `BOT_SERVER_URL` و `NEXT_PUBLIC_BOT_WHATSAPP_NUMBER` (راجع `.env.example` و `BOT_INTEGRATION_GUIDE.md`).

