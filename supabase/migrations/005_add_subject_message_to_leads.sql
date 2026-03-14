-- إضافة حقول الموضوع والرسالة لجدول leads
-- لتتوافق مع نموذج تواصل معنا

ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS subject TEXT,
ADD COLUMN IF NOT EXISTS message TEXT;
