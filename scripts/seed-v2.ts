// Direct SQL insertion to bypass schema cache issue
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const TENANT_ID = "00000000-0000-0000-0000-000000000001";

const properties = [
  {
    title: "شقة حديثة في حي الياسمين",
    description:
      "شقة حديثة بتشطيب فاخر في حي الياسمين، قريبة من المدارس والمراكز التجارية.",
    price: 750000,
    city: "الرياض",
    location: "حي الياسمين",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    images:
      '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"]',
    featured: true,
  },
  {
    title: "شقة فاخرة في حي النرجس",
    description: "شقة راقية في حي النرجس بالرياض، مساحة واسعة وتصميم مميز.",
    price: 920000,
    city: "الرياض",
    location: "حي النرجس",
    type: "apartment",
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    images:
      '["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"]',
    featured: true,
  },
  {
    title: "شقة اقتصادية في حي العارض",
    description: "شقة بسعر مناسب في حي العارض، مثالية للعائلات الصغيرة.",
    price: 480000,
    city: "الرياض",
    location: "حي العارض",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 95,
    images:
      '["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800"]',
    featured: false,
  },
  {
    title: "شقة عائلية في حي الملقا",
    description: "شقة مميزة في حي الملقا الراقي، قريبة من المدارس الدولية.",
    price: 850000,
    city: "الرياض",
    location: "حي الملقا",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 165,
    images:
      '["https://images.unsplash.com/photo-1502672023188-91a91c0c1b8c?w=800"]',
    featured: false,
  },
  {
    title: "شقة جديدة في حي الصحافة",
    description: "شقة جديدة لم تسكن في حي الصحافة، تشطيب سوبر ديلوكس.",
    price: 620000,
    city: "الرياض",
    location: "حي الصحافة",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    images:
      '["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"]',
    featured: false,
  },
  {
    title: "شقة دوبلكس في حي الرمال",
    description: "شقة دوبلكس فاخرة في حي الرمال، مكونة من طابقين مع سطح خاص.",
    price: 1100000,
    city: "الرياض",
    location: "حي الرمال",
    type: "apartment",
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    images:
      '["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"]',
    featured: true,
  },
  {
    title: "فيلا فاخرة في حي الملقا",
    description: "فيلا فاخرة بتصميم عصري، 5 غرف نوم وحديقة خاصة ومسبح.",
    price: 2500000,
    city: "الرياض",
    location: "حي الملقا",
    type: "villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    images:
      '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"]',
    featured: true,
  },
  {
    title: "فيلا دور واحد في حي النرجس",
    description: "فيلا دور واحد مع ملحق، تصميم سعودي أصيل.",
    price: 1800000,
    city: "الرياض",
    location: "حي النرجس",
    type: "villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    images:
      '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"]',
    featured: false,
  },
  {
    title: "فيلا مع مسبح في حي الياسمين",
    description: "فيلا راقية مع مسبح خاص، 6 غرف نوم ومجلس منفصل.",
    price: 2800000,
    city: "الرياض",
    location: "حي الياسمين",
    type: "villa",
    bedrooms: 6,
    bathrooms: 5,
    area: 450,
    images:
      '["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800"]',
    featured: true,
  },
  {
    title: "فيلا عائلية في حي العقيق",
    description: "فيلا مناسبة للعائلة الكبيرة، قريبة من الخدمات.",
    price: 2200000,
    city: "الرياض",
    location: "حي العقيق",
    type: "villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 380,
    images:
      '["https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800"]',
    featured: false,
  },
  {
    title: "شقة بحرية في حي الشاطئ",
    description: "شقة فاخرة مطلة على البحر في جدة.",
    price: 950000,
    city: "جدة",
    location: "حي الشاطئ",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 160,
    images:
      '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"]',
    featured: true,
  },
  {
    title: "شقة حديثة في حي الروضة",
    description: "شقة عصرية في حي الروضة بجدة.",
    price: 520000,
    city: "جدة",
    location: "حي الروضة",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 100,
    images:
      '["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"]',
    featured: false,
  },
  {
    title: "شقة في برج سكني بحي الفيصلية",
    description: "شقة في برج سكني راقي، خدمات فندقية.",
    price: 1100000,
    city: "جدة",
    location: "حي الفيصلية",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 175,
    images:
      '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]',
    featured: true,
  },
  {
    title: "شقة اقتصادية في حي النزهة",
    description: "شقة بسعر مناسب في حي النزهة بجدة.",
    price: 420000,
    city: "جدة",
    location: "حي النزهة",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 90,
    images:
      '["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800"]',
    featured: false,
  },
  {
    title: "شقة في أبحر الشمالية",
    description: "شقة مميزة قريبة من البحر والمتنزهات.",
    price: 780000,
    city: "جدة",
    location: "أبحر الشمالية",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 145,
    images:
      '["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"]',
    featured: false,
  },
  {
    title: "فيلا فاخرة في حي الحمراء",
    description: "فيلا راقية في حي الحمراء بجدة، تصميم كلاسيكي فاخر.",
    price: 2900000,
    city: "جدة",
    location: "حي الحمراء",
    type: "villa",
    bedrooms: 6,
    bathrooms: 5,
    area: 480,
    images:
      '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"]',
    featured: true,
  },
  {
    title: "فيلا حديثة في حي المرجان",
    description: "فيلا بتصميم مودرن قريبة من البحر.",
    price: 2400000,
    city: "جدة",
    location: "حي المرجان",
    type: "villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 400,
    images:
      '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"]',
    featured: false,
  },
  {
    title: "فيلا عائلية في أبحر الجنوبية",
    description: "فيلا مناسبة للعائلة، موقع هادئ.",
    price: 1650000,
    city: "جدة",
    location: "أبحر الجنوبية",
    type: "villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    images:
      '["https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800"]',
    featured: false,
  },
  {
    title: "شقة في حي الشاطئ الغربي",
    description: "شقة مطلة على البحر في الدمام.",
    price: 680000,
    city: "الدمام",
    location: "حي الشاطئ الغربي",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    images:
      '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"]',
    featured: true,
  },
  {
    title: "شقة في حي الفيصلية بالدمام",
    description: "شقة مميزة قريبة من الأسواق والمدارس.",
    price: 450000,
    city: "الدمام",
    location: "حي الفيصلية",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 95,
    images:
      '["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"]',
    featured: false,
  },
  {
    title: "شقة حديثة في حي الجلوية",
    description: "شقة جديدة بتشطيب ممتاز.",
    price: 580000,
    city: "الدمام",
    location: "حي الجلوية",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 130,
    images:
      '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]',
    featured: false,
  },
  {
    title: "شقة فاخرة في حي العزيزية",
    description: "شقة راقية بتشطيب سوبر ديلوكس.",
    price: 850000,
    city: "الدمام",
    location: "حي العزيزية",
    type: "apartment",
    bedrooms: 4,
    bathrooms: 3,
    area: 170,
    images:
      '["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"]',
    featured: true,
  },
  {
    title: "شقة على الكورنيش في الخبر",
    description: "شقة مميزة مطلة على كورنيش الخبر.",
    price: 920000,
    city: "الخبر",
    location: "الكورنيش",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 155,
    images:
      '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"]',
    featured: true,
  },
  {
    title: "شقة في حي الراكة الشمالية",
    description: "شقة عائلية في موقع حيوي.",
    price: 620000,
    city: "الخبر",
    location: "حي الراكة الشمالية",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 135,
    images:
      '["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"]',
    featured: false,
  },
  {
    title: "شقة اقتصادية في حي الثقبة",
    description: "شقة بسعر مناسب للمستثمرين.",
    price: 380000,
    city: "الخبر",
    location: "حي الثقبة",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    images:
      '["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800"]',
    featured: false,
  },
  {
    title: "شقة جديدة في حي العليا",
    description: "شقة جديدة لم تسكن بتشطيب ممتاز.",
    price: 550000,
    city: "الخبر",
    location: "حي العليا",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 125,
    images:
      '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]',
    featured: false,
  },
  {
    title: "فيلا فاخرة في حي الحزام الأخضر",
    description: "فيلا راقية مع حديقة ومسبح.",
    price: 2600000,
    city: "الخبر",
    location: "حي الحزام الأخضر",
    type: "villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 420,
    images:
      '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"]',
    featured: true,
  },
  {
    title: "فيلا عصرية في حي الجبيل بالدمام",
    description: "فيلا بتصميم حديث مع روف واسع.",
    price: 1900000,
    city: "الدمام",
    location: "حي الجبيل",
    type: "villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    images:
      '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"]',
    featured: false,
  },
  {
    title: "شقة قريبة من الحرم",
    description: "شقة مميزة قريبة من الحرم المكي الشريف.",
    price: 750000,
    city: "مكة",
    location: "العزيزية",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 90,
    images:
      '["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"]',
    featured: true,
  },
  {
    title: "شقة في حي الشوقية",
    description: "شقة واسعة قريبة من الخدمات.",
    price: 580000,
    city: "مكة",
    location: "حي الشوقية",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    images:
      '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]',
    featured: false,
  },
  {
    title: "فيلا في حي النوارية",
    description: "فيلا عائلية مع حديقة صغيرة.",
    price: 1600000,
    city: "مكة",
    location: "حي النوارية",
    type: "villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    images:
      '["https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800"]',
    featured: false,
  },
  {
    title: "شقة قريبة من المسجد النبوي",
    description: "شقة مميزة قريبة من المسجد النبوي الشريف.",
    price: 820000,
    city: "المدينة",
    location: "المنطقة المركزية",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 110,
    images:
      '["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"]',
    featured: true,
  },
  {
    title: "شقة في حي العزيزية بالمدينة",
    description: "شقة عائلية قريبة من المدارس والأسواق.",
    price: 450000,
    city: "المدينة",
    location: "حي العزيزية",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 95,
    images:
      '["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800"]',
    featured: false,
  },
  {
    title: "فيلا في حي الحرة الشرقية",
    description: "فيلا مميزة مع حديقة ومجالس منفصلة.",
    price: 1850000,
    city: "المدينة",
    location: "حي الحرة الشرقية",
    type: "villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 360,
    images:
      '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"]',
    featured: false,
  },
  {
    title: "أرض سكنية في شمال الرياض",
    description: "أرض سكنية مساحة 500 متر على شارعين.",
    price: 650000,
    city: "الرياض",
    location: "شمال الرياض",
    type: "land",
    bedrooms: null,
    bathrooms: null,
    area: 500,
    images:
      '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"]',
    featured: false,
  },
  {
    title: "أرض تجارية في جدة",
    description: "أرض تجارية على طريق المدينة مساحة 1000 متر.",
    price: 1800000,
    city: "جدة",
    location: "طريق المدينة",
    type: "land",
    bedrooms: null,
    bathrooms: null,
    area: 1000,
    images:
      '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"]',
    featured: true,
  },
  {
    title: "أرض سكنية في الدمام",
    description: "أرض سكنية 400 متر زاوية على شارعين.",
    price: 450000,
    city: "الدمام",
    location: "حي الفردوس",
    type: "land",
    bedrooms: null,
    bathrooms: null,
    area: 400,
    images:
      '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"]',
    featured: false,
  },
  {
    title: "أرض استثمارية في الخبر",
    description: "أرض استثمارية 800 متر مناسبة لمجمع سكني.",
    price: 1200000,
    city: "الخبر",
    location: "طريق الظهران",
    type: "land",
    bedrooms: null,
    bathrooms: null,
    area: 800,
    images:
      '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"]',
    featured: false,
  },
  {
    title: "مكتب تجاري في برج الفيصلية",
    description: "مكتب فاخر بتشطيب كامل وخدمات متكاملة.",
    price: 1500000,
    city: "الرياض",
    location: "برج الفيصلية",
    type: "commercial",
    bedrooms: null,
    bathrooms: 2,
    area: 200,
    images:
      '["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"]',
    featured: true,
  },
  {
    title: "محل تجاري على طريق الملك فهد",
    description: "محل تجاري بواجهة 8 متر مناسب للمطاعم.",
    price: 950000,
    city: "الرياض",
    location: "طريق الملك فهد",
    type: "commercial",
    bedrooms: null,
    bathrooms: 1,
    area: 120,
    images:
      '["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"]',
    featured: false,
  },
  {
    title: "مستودع في المنطقة الصناعية",
    description: "مستودع 500 متر مكيف مع مكاتب.",
    price: 2200000,
    city: "الرياض",
    location: "المنطقة الصناعية الثانية",
    type: "commercial",
    bedrooms: null,
    bathrooms: 2,
    area: 500,
    images:
      '["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800"]',
    featured: false,
  },
  {
    title: "مكتب في جدة مول",
    description: "مكتب تجاري في موقع مميز وحركة عالية.",
    price: 650000,
    city: "جدة",
    location: "جدة مول",
    type: "commercial",
    bedrooms: null,
    bathrooms: 1,
    area: 80,
    images:
      '["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"]',
    featured: false,
  },
  {
    title: "صالة عرض في الخبر",
    description: "صالة عرض بواجهة زجاجية 15 متر.",
    price: 1800000,
    city: "الخبر",
    location: "شارع الأمير ماجد",
    type: "commercial",
    bedrooms: null,
    bathrooms: 2,
    area: 350,
    images:
      '["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"]',
    featured: true,
  },
  {
    title: "عمارة استثمارية بالدمام",
    description: "عمارة سكنية 8 شقق مؤجرة بعائد 8%.",
    price: 3500000,
    city: "الدمام",
    location: "حي المزروعية",
    type: "commercial",
    bedrooms: null,
    bathrooms: 8,
    area: 600,
    images:
      '["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"]',
    featured: true,
  },
  {
    title: "شقة استثمارية في حي الورود",
    description: "فرصة استثمارية مميزة بعائد إيجاري ممتاز.",
    price: 550000,
    city: "الرياض",
    location: "حي الورود",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 100,
    images:
      '["https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800"]',
    featured: false,
  },
  {
    title: "شقة مفروشة في حي الغدير",
    description: "شقة مفروشة بالكامل جاهزة للسكن فوراً.",
    price: 680000,
    city: "الرياض",
    location: "حي الغدير",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 110,
    images:
      '["https://images.unsplash.com/photo-1560448075-bb485b067938?w=800"]',
    featured: false,
  },
  {
    title: "شقة بإطلالة في حي المروج",
    description: "شقة بإطلالة رائعة على الحديقة.",
    price: 720000,
    city: "الرياض",
    location: "حي المروج",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    images:
      '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"]',
    featured: false,
  },
  {
    title: "فيلا صغيرة في حي الربيع",
    description: "فيلا صغيرة مناسبة للعائلة المتوسطة.",
    price: 1400000,
    city: "الرياض",
    location: "حي الربيع",
    type: "villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    images:
      '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"]',
    featured: false,
  },
];

async function seedWithRPC() {
  console.log("🏠 Starting property seed via RPC...\n");

  let inserted = 0;

  for (const prop of properties) {
    const sql = `
      INSERT INTO properties (tenant_id, title, description, price, city, location, type, bedrooms, bathrooms, area, images, featured, status)
      VALUES (
        '${TENANT_ID}',
        '${prop.title.replace(/'/g, "''")}',
        '${prop.description.replace(/'/g, "''")}',
        ${prop.price},
        '${prop.city}',
        '${prop.location.replace(/'/g, "''")}',
        '${prop.type}',
        ${prop.bedrooms === null ? "NULL" : prop.bedrooms},
        ${prop.bathrooms === null ? "NULL" : prop.bathrooms},
        ${prop.area},
        '${prop.images}'::jsonb,
        ${prop.featured},
        'available'
      )
    `;

    const { error } = await supabase
      .rpc("exec_sql", { sql_query: sql })
      .single();

    if (error) {
      // Try direct insert
      const { error: insertError } = await supabase.from("properties").insert({
        tenant_id: TENANT_ID,
        title: prop.title,
        description: prop.description,
        price: prop.price,
        city: prop.city,
        location: prop.location,
        type: prop.type,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        area: prop.area,
        images: JSON.parse(prop.images),
        featured: prop.featured,
        status: "available",
      });

      if (!insertError) {
        inserted++;
        process.stdout.write(`\r✅ Inserted: ${inserted}/${properties.length}`);
      } else {
        console.log(`\n❌ ${prop.title}: ${insertError.message}`);
      }
    } else {
      inserted++;
      process.stdout.write(`\r✅ Inserted: ${inserted}/${properties.length}`);
    }
  }

  console.log(`\n\n🎉 Total inserted: ${inserted} properties`);

  // Count final
  const { count } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true });
  console.log(`📊 Total in database: ${count}`);
}

seedWithRPC();
