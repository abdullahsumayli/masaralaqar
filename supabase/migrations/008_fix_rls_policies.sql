-- إصلاح سياسات RLS للمقالات والموارد
-- تقييد الكتابة للأدمن فقط

-- حذف السياسات المفتوحة القديمة
DROP POLICY IF EXISTS "Allow all posts operations" ON blog_posts;
DROP POLICY IF EXISTS "Allow all resources operations" ON library_resources;

-- سياسة القراءة العامة للمقالات المنشورة
DROP POLICY IF EXISTS "Public can read posts" ON blog_posts;
CREATE POLICY "Public can read published posts" ON blog_posts
  FOR SELECT USING (published = true);

-- سياسة القراءة للأدمن لجميع المقالات
CREATE POLICY "Admins can read all posts" ON blog_posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- سياسة الإنشاء للأدمن فقط
CREATE POLICY "Admins can insert posts" ON blog_posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- سياسة التحديث للأدمن فقط
CREATE POLICY "Admins can update posts" ON blog_posts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- سياسة الحذف للأدمن فقط
CREATE POLICY "Admins can delete posts" ON blog_posts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- نفس السياسات لموارد المكتبة
DROP POLICY IF EXISTS "Public can read resources" ON library_resources;
CREATE POLICY "Public can read published resources" ON library_resources
  FOR SELECT USING (published = true);

CREATE POLICY "Admins can read all resources" ON library_resources
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert resources" ON library_resources
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update resources" ON library_resources
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete resources" ON library_resources
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );
