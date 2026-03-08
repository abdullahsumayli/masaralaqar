-- Migration 016: Seed 51 demo properties for Saqr system testing
-- Cities: الرياض، جدة، الدمام
--
-- ⚠️  INSTRUCTIONS:
--   1. Run this script in Supabase Dashboard → SQL Editor
--   2. If you have a specific tenant_id, replace the DO block below
--      with: SELECT id INTO v_tenant FROM tenants WHERE ... LIMIT 1;
--   3. The script will use the FIRST tenant found in the tenants table.
--      If no tenant exists, it will RAISE an error — create a tenant first.

DO $$
DECLARE
  v_tenant  UUID;
  v_user    UUID;
BEGIN
  -- Grab first available tenant
  SELECT id INTO v_tenant FROM tenants LIMIT 1;
  IF v_tenant IS NULL THEN
    RAISE EXCEPTION 'No tenant found. Create a tenant record first.';
  END IF;

  -- Grab corresponding user_id from tenants table
  SELECT user_id INTO v_user FROM tenants WHERE id = v_tenant LIMIT 1;
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Tenant has no user_id. Check tenants table.';
  END IF;

  -- ─────────────────────────────────────────────
  -- الرياض — 17 عقار
  -- ─────────────────────────────────────────────

  INSERT INTO properties (tenant_id, user_id, title, description, city, location, type, price, bedrooms, area, status, featured, views_count)
  VALUES
    (v_tenant, v_user, 'شقة في حي النرجس',         'شقة حديثة قريبة من الطرق الرئيسية والمدارس',   'الرياض', 'حي النرجس، الرياض',         'apartment', 820000,  3, 140, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي الياسمين',        'شقة فاخرة بتشطيب عالي وموقف سيارة',           'الرياض', 'حي الياسمين، الرياض',        'apartment', 910000,  3, 150, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي العارض',          'شقة مناسبة للعائلات بالقرب من الخدمات',        'الرياض', 'حي العارض، الرياض',          'apartment', 760000,  3, 135, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي الملقا',          'شقة واسعة في حي راقٍ',                         'الرياض', 'حي الملقا، الرياض',          'apartment', 990000,  4, 165, 'available', true,  0),
    (v_tenant, v_user, 'شقة في حي الصحافة',         'شقة حديثة البناء',                              'الرياض', 'حي الصحافة، الرياض',         'apartment', 880000,  3, 150, 'available', false, 0),
    (v_tenant, v_user, 'فيلا في حي الرمال',         'فيلا مستقلة بتصميم عصري',                      'الرياض', 'حي الرمال، الرياض',          'villa',     1750000, 5, 300, 'available', true,  0),
    (v_tenant, v_user, 'فيلا في حي القيروان',       'فيلا فاخرة قريبة من الطرق الرئيسية',           'الرياض', 'حي القيروان، الرياض',        'villa',     2100000, 6, 320, 'available', true,  0),
    (v_tenant, v_user, 'فيلا في حي حطين',           'فيلا حديثة بتشطيبات فاخرة',                    'الرياض', 'حي حطين، الرياض',            'villa',     2450000, 6, 340, 'available', true,  0),
    (v_tenant, v_user, 'شقة في حي قرطبة',           'شقة قريبة من المدارس والمراكز التجارية',        'الرياض', 'حي قرطبة، الرياض',           'apartment', 730000,  3, 130, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي الروضة',          'شقة مناسبة للعائلات الصغيرة',                  'الرياض', 'حي الروضة، الرياض',          'apartment', 690000,  3, 125, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي الخليج',          'شقة اقتصادية في موقع مميز',                    'الرياض', 'حي الخليج، الرياض',          'apartment', 640000,  3, 120, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي اشبيلية',         'شقة بتشطيب جيد وقريبة من الخدمات',             'الرياض', 'حي اشبيلية، الرياض',         'apartment', 720000,  3, 135, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي الرمال',          'شقة حديثة في حي متطور',                        'الرياض', 'حي الرمال، الرياض',          'apartment', 670000,  3, 125, 'available', false, 0),
    (v_tenant, v_user, 'فيلا في حي بدر',            'فيلا اقتصادية مناسبة للعائلات',                'الرياض', 'حي بدر، الرياض',             'villa',     1300000, 5, 280, 'available', false, 0),
    (v_tenant, v_user, 'فيلا في حي السويدي',        'فيلا واسعة في حي هادئ',                        'الرياض', 'حي السويدي، الرياض',         'villa',     1200000, 5, 260, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي العزيزية',        'شقة اقتصادية مناسبة للاستثمار',                'الرياض', 'حي العزيزية، الرياض',        'apartment', 580000,  3, 110, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي ظهرة لبن',        'شقة قريبة من الخدمات',                         'الرياض', 'حي ظهرة لبن، الرياض',        'apartment', 620000,  3, 120, 'available', false, 0),

  -- ─────────────────────────────────────────────
  -- جدة — 18 عقار
  -- ─────────────────────────────────────────────

    (v_tenant, v_user, 'شقة في حي السلامة',         'شقة واسعة قريبة من المدارس',                   'جدة',    'حي السلامة، جدة',            'apartment', 720000,  3, 140, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي الروضة',          'شقة حديثة بتشطيب فاخر',                        'جدة',    'حي الروضة، جدة',             'apartment', 840000,  3, 150, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي النهضة',          'شقة قريبة من الخدمات',                         'جدة',    'حي النهضة، جدة',             'apartment', 780000,  3, 145, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي النعيم',          'شقة مناسبة للعائلات',                          'جدة',    'حي النعيم، جدة',             'apartment', 650000,  3, 130, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي الصفا',           'شقة اقتصادية',                                 'جدة',    'حي الصفا، جدة',              'apartment', 600000,  3, 120, 'available', false, 0),
    (v_tenant, v_user, 'فيلا في حي المروة',         'فيلا بتصميم حديث',                             'جدة',    'حي المروة، جدة',             'villa',     1400000, 5, 300, 'available', false, 0),
    (v_tenant, v_user, 'فيلا في حي ابحر الشمالية', 'فيلا قريبة من البحر',                          'جدة',    'حي ابحر الشمالية، جدة',      'villa',     2200000, 6, 350, 'available', true,  0),
    (v_tenant, v_user, 'فيلا في حي الحمدانية',      'فيلا عائلية',                                  'جدة',    'حي الحمدانية، جدة',          'villa',     1250000, 5, 280, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي النسيم',          'شقة اقتصادية',                                 'جدة',    'حي النسيم، جدة',             'apartment', 520000,  3, 115, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي الفيصلية',        'شقة حديثة البناء',                             'جدة',    'حي الفيصلية، جدة',           'apartment', 670000,  3, 130, 'available', false, 0),
    (v_tenant, v_user, 'فيلا في حي البساتين',       'فيلا فاخرة',                                   'جدة',    'حي البساتين، جدة',           'villa',     2100000, 6, 330, 'available', true,  0),
    (v_tenant, v_user, 'شقة في حي الخالدية',        'شقة واسعة',                                    'جدة',    'حي الخالدية، جدة',           'apartment', 880000,  4, 165, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي الحمراء',         'شقة قريبة من الكورنيش',                        'جدة',    'حي الحمراء، جدة',            'apartment', 950000,  4, 170, 'available', true,  0),
    (v_tenant, v_user, 'شقة في حي السامر',          'شقة مناسبة للاستثمار',                         'جدة',    'حي السامر، جدة',             'apartment', 560000,  3, 120, 'available', false, 0),
    (v_tenant, v_user, 'فيلا في حي الاجاويد',       'فيلا عائلية',                                  'جدة',    'حي الاجاويد، جدة',           'villa',     1150000, 5, 270, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي التيسير',         'شقة اقتصادية',                                 'جدة',    'حي التيسير، جدة',            'apartment', 540000,  3, 110, 'available', false, 0),

  -- ─────────────────────────────────────────────
  -- الدمام — 17 عقار
  -- ─────────────────────────────────────────────

    (v_tenant, v_user, 'شقة في حي الشاطئ',          'شقة قريبة من البحر',                           'الدمام', 'حي الشاطئ، الدمام',          'apartment', 690000,  3, 140, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي الفيصلية',        'شقة حديثة',                                    'الدمام', 'حي الفيصلية، الدمام',        'apartment', 620000,  3, 130, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي النور',            'شقة اقتصادية',                                 'الدمام', 'حي النور، الدمام',           'apartment', 560000,  3, 120, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي احد',             'شقة مناسبة للعائلات',                          'الدمام', 'حي احد، الدمام',             'apartment', 540000,  3, 115, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي طيبة',            'شقة بسعر مناسب',                               'الدمام', 'حي طيبة، الدمام',            'apartment', 510000,  3, 110, 'available', false, 0),
    (v_tenant, v_user, 'فيلا في حي الشاطئ',         'فيلا بتصميم عصري',                             'الدمام', 'حي الشاطئ، الدمام',          'villa',     1650000, 5, 320, 'available', true,  0),
    (v_tenant, v_user, 'فيلا في حي الضباب',          'فيلا عائلية',                                  'الدمام', 'حي الضباب، الدمام',          'villa',     1450000, 5, 300, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي النزهة',           'شقة حديثة',                                    'الدمام', 'حي النزهة، الدمام',          'apartment', 590000,  3, 125, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي الشاطئ الغربي',   'شقة قريبة من الخدمات',                         'الدمام', 'حي الشاطئ الغربي، الدمام',   'apartment', 720000,  3, 145, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي بدر',             'شقة اقتصادية',                                 'الدمام', 'حي بدر، الدمام',             'apartment', 500000,  3, 110, 'available', false, 0),
    (v_tenant, v_user, 'فيلا في حي الفرسان',        'فيلا حديثة',                                   'الدمام', 'حي الفرسان، الدمام',         'villa',     1350000, 5, 280, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي الحمراء',         'شقة واسعة',                                    'الدمام', 'حي الحمراء، الدمام',         'apartment', 610000,  3, 130, 'available', false, 0),
    (v_tenant, v_user, 'فيلا في حي النورس',         'فيلا فاخرة',                                   'الدمام', 'حي النورس، الدمام',          'villa',     1750000, 6, 340, 'available', true,  0),
    (v_tenant, v_user, 'شقة في حي الندى',           'شقة مناسبة للعائلات',                          'الدمام', 'حي الندى، الدمام',           'apartment', 540000,  3, 115, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي المنار',          'شقة اقتصادية',                                 'الدمام', 'حي المنار، الدمام',          'apartment', 520000,  3, 110, 'available', false, 0),
    (v_tenant, v_user, 'فيلا في حي الفيحاء',        'فيلا حديثة',                                   'الدمام', 'حي الفيحاء، الدمام',         'villa',     1500000, 5, 300, 'available', false, 0),
    (v_tenant, v_user, 'شقة في حي الزهور',          'شقة مناسبة للاستثمار',                         'الدمام', 'حي الزهور، الدمام',          'apartment', 560000,  3, 120, 'available', false, 0);

  RAISE NOTICE 'تم إدخال 51 عقاراً تجريبياً بنجاح للـ tenant: %', v_tenant;
END $$;
