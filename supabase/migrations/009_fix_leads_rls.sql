-- إصلاح سياسات RLS لجدول leads
-- السماح لأي شخص بإرسال lead من الموقع

-- حذف السياسات القديمة إن وجدت
DROP POLICY IF EXISTS "Anyone can insert leads" ON leads;
DROP POLICY IF EXISTS "Public can insert leads" ON leads;
DROP POLICY IF EXISTS "Enable insert for everyone" ON leads;

-- سياسة جديدة للسماح بالإضافة من أي شخص (حتى بدون تسجيل دخول)
CREATE POLICY "Public can insert leads" ON leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- التأكد من أن الـ Admin يقدر يشوف الـ Leads
DROP POLICY IF EXISTS "Admins can view all leads" ON leads;
CREATE POLICY "Admins can view all leads" ON leads
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- الـ Admin يقدر يعدل على الـ Leads
DROP POLICY IF EXISTS "Admins can update leads" ON leads;
CREATE POLICY "Admins can update leads" ON leads
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- الـ Admin يقدر يحذف الـ Leads
DROP POLICY IF EXISTS "Admins can delete leads" ON leads;
CREATE POLICY "Admins can delete leads" ON leads
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );
