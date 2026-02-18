# نظام المصادقة (Authentication) - دليل الإعداد

## 📋 نظرة عامة

تم تنفيذ نظام مصادقة كامل باستخدام **Supabase Auth** مع حماية على الصفحات والمسارات.

---

## 🔧 خطوات الإعداد الفورية

### **1️⃣ تشغيل SQL Schema في Supabase**

1. اذهب إلى [Supabase Dashboard](https://app.supabase.com)
2. اختر مشروعك
3. انقر على **SQL Editor** (من القائمة اليسرى)
4. انقر **"New Query"**
5. انسخ محتوى الملف: `supabase/auth-schema.sql`
6. الصقه في محرر SQL
7. انقر **"Run"** (أو اضغط Ctrl+Enter)

**ستقوم بـ:**
- إنشاء جدول `users` 
- إضافة RLS Policies
- إنشاء trigger تلقائي للمستخدمين الجدد

---

### **2️⃣ التحقق من الإعدادات**

```bash
# تحقق من أن NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY مضبوطة في .env.local
```

---

## 📄 الملفات الرئيسية

### **`src/lib/auth.ts`** - دوال المصادقة الأساسية

```typescript
// تسجيل مستخدم جديد
await signUp(email, password, name, company)

// تسجيل دخول
await signIn(email, password)

// تسجيل خروج
await signOut()

// الحصول على المستخدم الحالي
const user = await getCurrentUser()

// الحصول على ملف تعريف المستخدم
const profile = await getUserProfile(userId)

// تحديث الملف الشخصي
await updateUserProfile(userId, updates)
```

---

### **`src/hooks/useAuth.ts`** - React Hooks

#### **`useAuth()`** - الحصول على المستخدم الحالي

```typescript
const { user, profile, isLoading } = useAuth()

if (isLoading) return <LoadingSpinner />
if (!user) return <Redirect to="/login" />

return <div>مرحباً {profile?.name}</div>
```

#### **`useRequireAuth()`** - حماية المسارات العادية

```typescript
function Dashboard() {
  const { user, isLoading } = useRequireAuth()
  
  if (isLoading) return <LoadingSpinner />
  if (!user) return null // سيتم إعادة التوجيه تلقائياً
  
  return <DashboardContent />
}
```

#### **`useRequireAdmin()`** - حماية مسارات الإدارة

```typescript
function AdminPanel() {
  const { user, isLoading } = useRequireAdmin()
  
  // سيتم إعادة التوجيه إذا لم يكن admin
  if (!user) return null
  
  return <AdminContent />
}
```

---

## 🔐 كيف تعمل الحماية

### **مسارات المستخدم العادي:**
```
/auth/signup → قم بإنشاء حساب جديد
     ↓
/auth/verify-email → تحقق من بريدك
     ↓
/login → سجّل دخولك
     ↓
/dashboard → (محمي - يتطلب useRequireAuth())
```

### **مسارات الإدارة:**
```
/admin/login → تسجيل دخول الإدارة
     ↓
/admin → (محمي - يتطلب role = 'admin')
/admin/blog → محرر المدونة
/admin/library → محرر المكتبة
```

---

## 👤 أنماط المستخدمين

### **User Interface**

```typescript
interface User {
  id: string
  email: string
  name?: string
  company?: string
  phone?: string
  subscription?: string // 'free', 'basic', 'pro'
  role?: string         // 'user' أو 'admin'
  created_at?: string
  updated_at?: string
}
```

### **الأدوار (Roles)**

- **`user`** → مستخدم عادي (يمكنه الوصول للـ dashboard)
- **`admin`** → مسؤول (يمكنه الوصول لـ /admin)

---

## 🔄 تدفق تسجيل المستخدم

### **1️⃣ التسجيل:**

```bash
POST /auth/signup
Body: {
  email: "user@example.com",
  password: "secure123",
  name: "أحمد محمود",
  company: "العقارات الذهبية"
}
```

**الخطوات:**
1. يرسل Supabase بريد تحقق
2. ينتظر المستخدم الضغط على الرابط في البريد
3. ينشئ trigger جدول `users` تلقائياً

### **2️⃣ التحقق:**

المستخدم يفتح البريد → يضغط على رابط التحقق

### **3️⃣ تسجيل الدخول:**

```bash
POST /login
Body: {
  email: "user@example.com",
  password: "secure123"
}
```

**النتيجة:**
- JWT Token يُحفظ في session
- إعادة توجيه إلى `/dashboard`

---

## 🎯 الحماية المطبقة

### **Dashboard Layout** (`src/app/dashboard/layout.tsx`)

```typescript
'use client'
export default function DashboardLayout() {
  const { user, isLoading } = useRequireAuth()
  
  if (isLoading) return <Spinner />
  if (!user) return null // redirects automatically
  
  return <Protected Layout />
}
```

### **Admin Layout** (`src/components/admin/auth-guard.tsx`)

```typescript
- يتحقق من أن المستخدم مسجل دخول
- يتحقق من أن role = 'admin'
- يعيد التوجيه إذا لم يتحقق شرط
```

---

## 🧪 الاختبار

### **1️⃣ اختبار التسجيل:**

1. اذهب إلى `http://localhost:3000/auth/signup`
2. ملء البيانات
3. انقر **تسجيل** 
4. يجب أن ترى رسالة تحقق البريد

### **2️⃣ التحقق من البريد:**

تحقق من بريدك (أو استخدم Supabase Email Preview):
- اضغط على رابط التأكيد

### **3️⃣ تسجيل الدخول:**

1. اذهب إلى `http://localhost:3000/login`
2. أدخل البريد والكلمة
3. انقر **تسجيل الدخول**
4. يجب أن تنتقل إلى `/dashboard`

### **4️⃣ اختبر logout:**

في الـ sidebar، انقر **تسجيل الخروج**
- يجب أن تنتقل إلى `/login`

---

## 🔑 إنشاء Admin

### **الطريقة 1: عبر Supabase Console**

1. اذهب إلى Supabase Dashboard
2. انقر **Authentication** → **Users**
3. انقر **+ Create new user**
4. أدخل البريد والكلمة
5. انقر على جدول `users` في Database
6. غيّر `role` من `'user'` إلى `'admin'`

### **الطريقة 2: عبر SQL**

```sql
-- أولاً: إنشاء المستخدم
-- (من خلال /auth/signup أو Admin Console)

-- ثانياً: تحديث الدور
UPDATE public.users
SET role = 'admin'
WHERE email = 'admin@example.com';
```

---

## 🛡️ Row Level Security (RLS)

### **السياسات المطبقة:**

#### **المستخدمون يمكنهم قراءة ملفهم فقط:**
```sql
SELECT * FROM users WHERE id = auth.uid()
```

#### **المستخدمون يمكنهم تحديث ملفهم فقط:**
```sql
UPDATE users SET name = '...' WHERE id = auth.uid()
```

#### **المسؤولون يرون جميع المستخدمين:**
```sql
SELECT * FROM users 
WHERE (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
```

---

## ❌ استكشاف الأخطاء

### **مشكلة: "بيانات الدخول غير صحيحة"**

- ✅ تأكد من أن البريد موجود في جدول `users`
- ✅ تأكد من التحقق من بريدك
- ✅ تحقق من الكلمة (حالة الأحرف مهمة)

### **مشكلة: "لا يمكن الوصول إلى /admin"**

- ✅ تحقق من أن `role = 'admin'` في جدول `users`
- ✅ تحقق من صحة استدعاء `getUserProfile()`

### **مشكلة: لا يعمل OAuth (في المستقبل)**

- ✅ تأكد من تفعيل Providers في Supabase
- ✅ أضف Redirect URLs الصحيحة

---

## 🚀 الخطوات التالية

1. ✅ تشغيل SQL Schema
2. ✅ اختبار التسجيل والدخول
3. 🔄 **إضافة Password Reset** 
4. 🔄 **إضافة Google/GitHub OAuth** (اختياري)
5. 🔄 **نظام الدفع بالحوالات البنكية**

---

## 📞 الدعم

للمزيد من المعلومات:
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

