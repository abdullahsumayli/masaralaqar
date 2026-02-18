# صفر البيانات - دليل حذف البيانات

## الخيار الأول: استخدام Supabase Dashboard (الأسهل) ✨

1. افتح [لوحة التحكم Supabase](https://supabase.com/dashboard)
2. اختر مشروعك `masaralaqar`
3. اذهب إلى **SQL Editor**
4. انسخ والصق الأمر التالي:

```sql
-- حذف جميع البيانات (إبقاء هيكل الجداول)
TRUNCATE TABLE invoices CASCADE;
TRUNCATE TABLE bank_transfers CASCADE;
TRUNCATE TABLE user_subscriptions CASCADE;
TRUNCATE TABLE user_profiles CASCADE;
TRUNCATE TABLE blog_posts CASCADE;
TRUNCATE TABLE library_items CASCADE;
TRUNCATE TABLE subscription_plans CASCADE;
```

5. اضغط **Run** أو `Ctrl+Enter`
6. تم! ✅ البيانات محذوفة والجداول فارغة

---

## الخيار الثاني: استخدام Script Node.js

### المتطلبات:
1. احصل على `SUPABASE_SERVICE_ROLE_KEY`:
   - اذهب إلى: https://supabase.com/dashboard
   - اختر المشروع
   - **Settings** → **API** → **Service Role Secret**
   - انسخ المفتاح

2. أضفه إلى `.env.local`:
```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

3. شغل البرنامج:
```bash
node scripts/clear-data.js
```

### النتيجة المتوقعة:
```
🗑️  Starting data clear...

✅ invoices: Cleared 5 records
✅ bank_transfers: Cleared 3 records
✅ user_subscriptions: Cleared 2 records
✅ user_profiles: Cleared 1 record
✅ blog_posts: Cleared 0 records
✅ library_items: Cleared 0 records
✅ subscription_plans: Cleared 7 records

✨ Data clear complete!
📝 Note: Table structures and RLS policies are preserved
```

---

## ملاحظات مهمة ⚠️

- ✅ **الجداول والعلاقات محفوظة** - الهيكل لن يتغير
- ✅ **سياسات RLS محفوظة** - القواعس الأمنية باقية
- ✅ **التسلسل الذاتي يعاد تعيينه** - الـ IDs تبدأ من جديد
- ❌ **لا يمكن التراجع**! - تأكد قبل التنفيذ

---

## بعد مسح البيانات

اختياريّاً، يمكنك:

1. **إضافة خطط الاشتراك الافتراضية**:
```bash
node scripts/seed-subscription-plans.js
```

2. **إضافة مقالات المدونة**:
```bash
node scripts/seed-blog.js
```

3. **إعادة تشغيل التطبيق**:
```bash
npm run dev
```

---

## الدعم

إذا واجهت مشاكل:
- تأكد من أن مفتاح الخدمة صحيح
- تحقق من اتصالك بـ Supabase
- تأكد من أن لديك صلاحيات الحذف على الجداول
