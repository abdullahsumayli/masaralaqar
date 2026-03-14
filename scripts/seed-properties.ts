// Seed script to insert 50 demo properties into Supabase
// Run with: npx tsx scripts/seed-properties.ts

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface Property {
  tenant_id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  location: string;
  type: "apartment" | "villa" | "land" | "commercial";
  bedrooms: number | null;
  bathrooms: number | null;
  area: number;
  images: string[];
  status: string;
  featured: boolean;
}

const TENANT_ID = "00000000-0000-0000-0000-000000000001";

const properties: Property[] = [
  // Apartments in الرياض (8 properties)
  {
    tenant_id: TENANT_ID,
    title: "شقة حديثة في حي الياسمين",
    description:
      "شقة حديثة بتشطيب فاخر في حي الياسمين، قريبة من المدارس والمراكز التجارية، تتميز بإطلالة مفتوحة ومواقف خاصة. تصميم عصري وتشطيبات عالية الجودة.",
    price: 750000,
    city: "الرياض",
    location: "حي الياسمين",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    ],
    status: "available",
    featured: true,
  },
  {
    tenant_id: TENANT_ID,
    title: "شقة فاخرة في حي النرجس",
    description:
      "شقة راقية في حي النرجس بالرياض، مساحة واسعة وتصميم مميز، قريبة من طريق الملك سلمان. مطبخ مجهز بالكامل وغرفة خادمة.",
    price: 920000,
    city: "الرياض",
    location: "حي النرجس",
    type: "apartment",
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
    ],
    status: "available",
    featured: true,
  },
  {
    tenant_id: TENANT_ID,
    title: "شقة اقتصادية في حي العارض",
    description:
      "شقة بسعر مناسب في حي العارض، مثالية للعائلات الصغيرة، قريبة من جميع الخدمات. تشطيب جيد ومساحة مريحة.",
    price: 480000,
    city: "الرياض",
    location: "حي العارض",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 95,
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
    ],
    status: "available",
    featured: false,
  },
  {
    tenant_id: TENANT_ID,
    title: "شقة عائلية في حي الملقا",
    description:
      "شقة مميزة في حي الملقا الراقي، تتكون من 3 غرف نوم وصالة كبيرة، قريبة من المدارس الدولية. موقع استراتيجي وهادئ.",
    price: 850000,
    city: "الرياض",
    location: "حي الملقا",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 165,
    images: [
      "https://images.unsplash.com/photo-1502672023188-91a91c0c1b8c?w=800",
      "https://images.unsplash.com/photo-1560185007-cde436f6a419?w=800",
      "https://images.unsplash.com/photo-1560448075-bb485b067938?w=800",
    ],
    status: "available",
    featured: false,
  },
  {
    tenant_id: TENANT_ID,
    title: "شقة جديدة في حي الصحافة",
    description:
      "شقة جديدة لم تسكن في حي الصحافة، تشطيب سوبر ديلوكس، مع مصعد ومواقف. إطلالة رائعة على الحديقة.",
    price: 620000,
    city: "الرياض",
    location: "حي الصحافة",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    status: "available",
    featured: false,
  },
  {
    tenant_id: TENANT_ID,
    title: "شقة استثمارية في حي الورود",
    description:
      "فرصة استثمارية مميزة، شقة في حي الورود بعائد إيجاري ممتاز، قريبة من طريق الملك فهد. مؤجرة حالياً بعقد طويل.",
    price: 550000,
    city: "الرياض",
    location: "حي الورود",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 100,
    images: [
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    ],
    status: "available",
    featured: false,
  },
  {
    tenant_id: TENANT_ID,
    title: "شقة دوبلكس في حي الرمال",
    description:
      "شقة دوبلكس فاخرة في حي الرمال، مكونة من طابقين مع سطح خاص، تصميم عصري ومساحات واسعة.",
    price: 1100000,
    city: "الرياض",
    location: "حي الرمال",
    type: "apartment",
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800",
    ],
    status: "available",
    featured: true,
  },
  {
    tenant_id: TENANT_ID,
    title: "شقة مفروشة في حي الغدير",
    description:
      "شقة مفروشة بالكامل في حي الغدير، جاهزة للسكن فوراً، مع جميع الأجهزة الكهربائية. مثالية للموظفين.",
    price: 680000,
    city: "الرياض",
    location: "حي الغدير",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 110,
    images: [
      "https://images.unsplash.com/photo-1560448075-bb485b067938?w=800",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    ],
    status: "available",
    featured: false,
  },

  // Villas in الرياض (4 properties)
  {
    tenant_id: TENANT_ID,
    title: "فيلا فاخرة في حي الملقا",
    description:
      "فيلا فاخرة بتصميم عصري في حي الملقا، تتكون من 5 غرف نوم وصالة واسعة وحديقة خاصة ومسبح. مساحة الأرض 400 متر.",
    price: 2500000,
    city: "الرياض",
    location: "حي الملقا",
    type: "villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    status: "available",
    featured: true,
  },
  {
    tenant_id: TENANT_ID,
    title: "فيلا دور واحد في حي النرجس",
    description:
      "فيلا دور واحد مع ملحق في حي النرجس، مساحة واسعة ومدخل سيارات، تصميم سعودي أصيل مع لمسات حديثة.",
    price: 1800000,
    city: "الرياض",
    location: "حي النرجس",
    type: "villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
    ],
    status: "available",
    featured: false,
  },
  {
    tenant_id: TENANT_ID,
    title: "فيلا مع مسبح في حي الياسمين",
    description:
      "فيلا راقية مع مسبح خاص في حي الياسمين، 6 غرف نوم ومجلس رجال ونساء منفصل، حديقة كبيرة وجلسات خارجية.",
    price: 2800000,
    city: "الرياض",
    location: "حي الياسمين",
    type: "villa",
    bedrooms: 6,
    bathrooms: 5,
    area: 450,
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
    ],
    status: "available",
    featured: true,
  },
  {
    tenant_id: TENANT_ID,
    title: "فيلا عائلية في حي العقيق",
    description:
      "فيلا مناسبة للعائلة الكبيرة في حي العقيق، قريبة من الخدمات والمدارس، 5 غرف نوم مع جناح رئيسي.",
    price: 2200000,
    city: "الرياض",
    location: "حي العقيق",
    type: "villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 380,
    images: [
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
    ],
    status: "available",
    featured: false,
  },

  // Apartments in جدة (5 properties)
  {
    tenant_id: TENANT_ID,
    title: "شقة بحرية في حي الشاطئ",
    description:
      "شقة فاخرة مطلة على البحر في حي الشاطئ بجدة، إطلالة خلابة على الكورنيش، تشطيب راقي ومواقف خاصة.",
    price: 950000,
    city: "جدة",
    location: "حي الشاطئ",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 160,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    ],
    status: "available",
    featured: true,
  },
  {
    tenant_id: TENANT_ID,
    title: "شقة حديثة في حي الروضة",
    description:
      "شقة عصرية في حي الروضة بجدة، قريبة من المولات والمطاعم، 2 غرفة نوم مع بلكونة واسعة.",
    price: 520000,
    city: "جدة",
    location: "حي الروضة",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 100,
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    status: "available",
    featured: false,
  },
  {
    tenant_id: TENANT_ID,
    title: "شقة في برج سكني بحي الفيصلية",
    description:
      "شقة في برج سكني راقي بحي الفيصلية، خدمات فندقية، جيم ومسبح مشترك، أمن 24 ساعة.",
    price: 1100000,
    city: "جدة",
    location: "حي الفيصلية",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 175,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560185007-cde436f6a419?w=800",
      "https://images.unsplash.com/photo-1560448075-bb485b067938?w=800",
    ],
    status: "available",
    featured: true,
  },
  {
    tenant_id: TENANT_ID,
    title: "شقة اقتصادية في حي النزهة",
    description:
      "شقة بسعر مناسب في حي النزهة بجدة، مثالية للشباب والمتزوجين الجدد، قريبة من المواصلات العامة.",
    price: 420000,
    city: "جدة",
    location: "حي النزهة",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 90,
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800",
    ],
    status: "available",
    featured: false,
  },
  {
    tenant_id: TENANT_ID,
    title: "شقة في أبحر الشمالية",
    description:
      "شقة مميزة في أبحر الشمالية، قريبة من البحر والمتنزهات، 3 غرف نوم مع تصميم مفتوح وإضاءة طبيعية ممتازة.",
    price: 780000,
    city: "جدة",
    location: "أبحر الشمالية",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 145,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    status: "available",
    featured: false,
  },

  // Villas in جدة (3 properties)
  {
    tenant_id: TENANT_ID,
    title: "فيلا فاخرة في حي الحمراء",
    description:
      "فيلا راقية في حي الحمراء بجدة، تصميم كلاسيكي فاخر، 6 غرف نوم مع حديقة واسعة ومسبح خاص.",
    price: 2900000,
    city: "جدة",
    location: "حي الحمراء",
    type: "villa",
    bedrooms: 6,
    bathrooms: 5,
    area: 480,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    ],
    status: "available",
    featured: true,
  },
  {
    tenant_id: TENANT_ID,
    title: "فيلا حديثة في حي المرجان",
    description:
      "فيلا بتصميم مودرن في حي المرجان، قريبة من البحر، 5 غرف نوم مع روف واسع وإطلالة بحرية.",
    price: 2400000,
    city: "جدة",
    location: "حي المرجان",
    type: "villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 400,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
    ],
    status: "available",
    featured: false,
  },
  {
    tenant_id: TENANT_ID,
    title: "فيلا عائلية في أبحر الجنوبية",
    description:
      "فيلا مناسبة للعائلة في أبحر الجنوبية، موقع هادئ وقريب من الخدمات، 4 غرف نوم مع ملحق.",
    price: 1650000,
    city: "جدة",
    location: "أبحر الجنوبية",
    type: "villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    images: [
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
    ],
    status: "available",
    featured: false,
  },

  // Apartments in الدمام (4 properties)
  {
    tenant_id: TENANT_ID,
    title: "شقة في حي الشاطئ الغربي",
    description:
      "شقة مطلة على البحر في حي الشاطئ الغربي بالدمام، تصميم عصري مع بلكونة واسعة، قريبة من الكورنيش.",
    price: 680000,
    city: "الدمام",
    location: "حي الشاطئ الغربي",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    ],
    status: "available",
    featured: true,
  },
  {
    tenant_id: TENANT_ID,
    title: "شقة في حي الفيصلية بالدمام",
    description:
      "شقة مميزة في حي الفيصلية، قريبة من الأسواق والمدارس، 2 غرفة نوم مع مطبخ مجهز.",
    price: 450000,
    city: "الدمام",
    location: "حي الفيصلية",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 95,
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
    ],
    status: "available",
    featured: false,
  },
  {
    tenant_id: TENANT_ID,
    title: "شقة حديثة في حي الجلوية",
    description:
      "شقة جديدة في حي الجلوية بالدمام، تشطيب ممتاز، 3 غرف نوم مع صالة كبيرة ومواقف خاصة.",
    price: 580000,
    city: "الدمام",
    location: "حي الجلوية",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 130,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560185007-cde436f6a419?w=800",
      "https://images.unsplash.com/photo-1560448075-bb485b067938?w=800",
    ],
    status: "available",
    featured: false,
  },
  {
    tenant_id: TENANT_ID,
    title: "شقة فاخرة في حي العزيزية",
    description:
      "شقة راقية في حي العزيزية بالدمام، تشطيب سوبر ديلوكس، 4 غرف نوم مع غرفة خادمة وغسيل.",
    price: 850000,
    city: "الدمام",
    location: "حي العزيزية",
    type: "apartment",
    bedrooms: 4,
    bathrooms: 3,
    area: 170,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    status: "available",
    featured: true,
  },

  // Apartments in الخبر (4 properties)
  {
    tenant_id: TENANT_ID,
    title: "شقة على الكورنيش في الخبر",
    description:
      "شقة مميزة مطلة على كورنيش الخبر، إطلالة بحرية خلابة، تصميم مودرن مع تشطيبات فاخرة.",
    price: 920000,
    city: "الخبر",
    location: "الكورنيش",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 155,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    ],
    status: "available",
    featured: true,
  },
  {
    tenant_id: TENANT_ID,
    title: "شقة في حي الراكة الشمالية",
    description:
      "شقة عائلية في حي الراكة الشمالية، موقع حيوي وقريب من المجمعات التجارية، 3 غرف نوم.",
    price: 620000,
    city: "الخبر",
    location: "حي الراكة الشمالية",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 135,
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
    ],
    status: "available",
    featured: false,
  },
  {
    tenant_id: TENANT_ID,
    title: "شقة اقتصادية في حي الثقبة",
    description:
      "شقة بسعر مناسب في حي الثقبة بالخبر، 2 غرفة نوم، مثالية للمستثمرين أو المتزوجين الجدد.",
    price: 380000,
    city: "الخبر",
    location: "حي الثقبة",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800",
    ],
    status: "available",
    featured: false,
  },
  {
    tenant_id: TENANT_ID,
    title: "شقة جديدة في حي العليا",
    description:
      "شقة جديدة لم تسكن في حي العليا بالخبر، تشطيب ممتاز، 3 غرف نوم مع مصعد ومواقف.",
    price: 550000,
    city: "الخبر",
    location: "حي العليا",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 125,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560185007-cde436f6a419?w=800",
      "https://images.unsplash.com/photo-1560448075-bb485b067938?w=800",
    ],
    status: "available",
    featured: false,
  },

  // Villas in الدمام والخبر (2 properties)
  {
    tenant_id: TENANT_ID,
    title: "فيلا فاخرة في حي الحزام الأخضر",
    description:
      "فيلا راقية في حي الحزام الأخضر بالخبر، 5 غرف نوم مع حديقة ومسبح، قريبة من المدارس الدولية.",
    price: 2600000,
    city: "الخبر",
    location: "حي الحزام الأخضر",
    type: "villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 420,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    ],
    status: "available",
    featured: true,
  },
  {
    tenant_id: TENANT_ID,
    title: "فيلا عصرية في حي الجبيل بالدمام",
    description:
      "فيلا بتصميم حديث في حي الجبيل، 4 غرف نوم مع روف واسع وإطلالة مميزة.",
    price: 1900000,
    city: "الدمام",
    location: "حي الجبيل",
    type: "villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
    ],
    status: "available",
    featured: false,
  },

  // Apartments & Villas in مكة (3 properties)
  {
    tenant_id: TENANT_ID,
    title: "شقة قريبة من الحرم",
    description:
      "شقة مميزة قريبة من الحرم المكي الشريف، موقع استراتيجي للعبادة والراحة، 2 غرفة نوم.",
    price: 750000,
    city: "مكة",
    location: "العزيزية",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 90,
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    status: "available",
    featured: true,
  },
  {
    tenant_id: TENANT_ID,
    title: "شقة في حي الشوقية",
    description:
      "شقة واسعة في حي الشوقية بمكة، 3 غرف نوم، قريبة من الخدمات والطرق الرئيسية.",
    price: 580000,
    city: "مكة",
    location: "حي الشوقية",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560185007-cde436f6a419?w=800",
      "https://images.unsplash.com/photo-1560448075-bb485b067938?w=800",
    ],
    status: "available",
    featured: false,
  },
  {
    tenant_id: TENANT_ID,
    title: "فيلا في حي النوارية",
    description:
      "فيلا عائلية في حي النوارية بمكة، 4 غرف نوم مع حديقة صغيرة ومواقف خاصة.",
    price: 1600000,
    city: "مكة",
    location: "حي النوارية",
    type: "villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    images: [
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
    ],
    status: "available",
    featured: false,
  },

  // Apartments & Villas in المدينة (3 properties)
  {
    tenant_id: TENANT_ID,
    title: "شقة قريبة من المسجد النبوي",
    description:
      "شقة مميزة قريبة من المسجد النبوي الشريف، موقع رائع للسكن أو الاستثمار، 3 غرف نوم.",
    price: 820000,
    city: "المدينة",
    location: "المنطقة المركزية",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 110,
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    status: "available",
    featured: true,
  },
  {
    tenant_id: TENANT_ID,
    title: "شقة في حي العزيزية بالمدينة",
    description:
      "شقة عائلية في حي العزيزية بالمدينة المنورة، 2 غرفة نوم، قريبة من المدارس والأسواق.",
    price: 450000,
    city: "المدينة",
    location: "حي العزيزية",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 95,
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800",
    ],
    status: "available",
    featured: false,
  },
  {
    tenant_id: TENANT_ID,
    title: "فيلا في حي الحرة الشرقية",
    description:
      "فيلا مميزة في حي الحرة الشرقية بالمدينة، 5 غرف نوم مع حديقة ومجالس منفصلة.",
    price: 1850000,
    city: "المدينة",
    location: "حي الحرة الشرقية",
    type: "villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 360,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    ],
    status: "available",
    featured: false,
  },

  // Land properties (4 properties)
  {
    tenant_id: TENANT_ID,
    title: "أرض سكنية في شمال الرياض",
    description:
      "أرض سكنية للبيع في شمال الرياض، مساحة 500 متر مربع، على شارعين، مناسبة لبناء فيلا.",
    price: 650000,
    city: "الرياض",
    location: "شمال الرياض",
    type: "land",
    bedrooms: null,
    bathrooms: null,
    area: 500,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800",
      "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=800",
    ],
    status: "available",
    featured: false,
  },
  {
    tenant_id: TENANT_ID,
    title: "أرض تجارية في جدة",
    description:
      "أرض تجارية للبيع على طريق المدينة بجدة، مساحة 1000 متر، مناسبة لمشروع تجاري.",
    price: 1800000,
    city: "جدة",
    location: "طريق المدينة",
    type: "land",
    bedrooms: null,
    bathrooms: null,
    area: 1000,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800",
      "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=800",
    ],
    status: "available",
    featured: true,
  },
  {
    tenant_id: TENANT_ID,
    title: "أرض سكنية في الدمام",
    description:
      "أرض سكنية للبيع في حي الفردوس بالدمام، 400 متر، زاوية على شارعين.",
    price: 450000,
    city: "الدمام",
    location: "حي الفردوس",
    type: "land",
    bedrooms: null,
    bathrooms: null,
    area: 400,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800",
      "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=800",
    ],
    status: "available",
    featured: false,
  },
  {
    tenant_id: TENANT_ID,
    title: "أرض استثمارية في الخبر",
    description:
      "أرض استثمارية على طريق الظهران بالخبر، 800 متر، مناسبة لمجمع سكني.",
    price: 1200000,
    city: "الخبر",
    location: "طريق الظهران",
    type: "land",
    bedrooms: null,
    bathrooms: null,
    area: 800,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800",
      "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=800",
    ],
    status: "available",
    featured: false,
  },

  // Commercial properties (6 properties)
  {
    tenant_id: TENANT_ID,
    title: "مكتب تجاري في برج الفيصلية",
    description:
      "مكتب فاخر في برج الفيصلية بالرياض، تشطيب كامل، مساحة 200 متر، خدمات متكاملة.",
    price: 1500000,
    city: "الرياض",
    location: "برج الفيصلية",
    type: "commercial",
    bedrooms: null,
    bathrooms: 2,
    area: 200,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
    ],
    status: "available",
    featured: true,
  },
  {
    tenant_id: TENANT_ID,
    title: "محل تجاري على طريق الملك فهد",
    description:
      "محل تجاري على طريق الملك فهد بالرياض، واجهة 8 متر، مناسب للمطاعم أو التجزئة.",
    price: 950000,
    city: "الرياض",
    location: "طريق الملك فهد",
    type: "commercial",
    bedrooms: null,
    bathrooms: 1,
    area: 120,
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800",
      "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?w=800",
    ],
    status: "available",
    featured: false,
  },
  {
    tenant_id: TENANT_ID,
    title: "مستودع في المنطقة الصناعية",
    description:
      "مستودع للبيع في المنطقة الصناعية الثانية بالرياض، مساحة 500 متر، مكيف مع مكاتب.",
    price: 2200000,
    city: "الرياض",
    location: "المنطقة الصناعية الثانية",
    type: "commercial",
    bedrooms: null,
    bathrooms: 2,
    area: 500,
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
      "https://images.unsplash.com/photo-1565891741441-64926e441838?w=800",
    ],
    status: "available",
    featured: false,
  },
  {
    tenant_id: TENANT_ID,
    title: "مكتب في جدة مول",
    description:
      "مكتب تجاري في مجمع جدة مول، موقع مميز وحركة عالية، 80 متر مع تكييف مركزي.",
    price: 650000,
    city: "جدة",
    location: "جدة مول",
    type: "commercial",
    bedrooms: null,
    bathrooms: 1,
    area: 80,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
    ],
    status: "available",
    featured: false,
  },
  {
    tenant_id: TENANT_ID,
    title: "صالة عرض في الخبر",
    description:
      "صالة عرض للبيع في موقع مميز بالخبر، واجهة زجاجية 15 متر، مناسبة للسيارات أو الأثاث.",
    price: 1800000,
    city: "الخبر",
    location: "شارع الأمير ماجد",
    type: "commercial",
    bedrooms: null,
    bathrooms: 2,
    area: 350,
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800",
      "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?w=800",
    ],
    status: "available",
    featured: true,
  },
  {
    tenant_id: TENANT_ID,
    title: "عمارة استثمارية بالدمام",
    description:
      "عمارة سكنية استثمارية في الدمام، 8 شقق مؤجرة، عائد سنوي 8%، موقع حيوي.",
    price: 3500000,
    city: "الدمام",
    location: "حي المزروعية",
    type: "commercial",
    bedrooms: null,
    bathrooms: 8,
    area: 600,
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1464938050520-ef2571e0d6d7?w=800",
    ],
    status: "available",
    featured: true,
  },
];

async function ensureTenant() {
  // Check if tenant exists
  const { data: existingTenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("id", TENANT_ID)
    .single();

  if (!existingTenant) {
    // Create default tenant
    const { error } = await supabase.from("tenants").insert({
      id: TENANT_ID,
      name: "Masar Real Estate",
      office_name: "مسار العقار",
      whatsapp_number: "966545374069",
      webhook_secret: "masar2024secret",
    });

    if (error) {
      console.log("⚠️ Tenant may already exist, continuing...");
    } else {
      console.log("✅ Created default tenant");
    }
  } else {
    console.log("✅ Tenant already exists");
  }
}

async function seedProperties() {
  console.log("🏠 Starting property seed...\n");

  await ensureTenant();

  // Check existing properties count
  const { count: existingCount } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true });

  console.log(`📊 Existing properties: ${existingCount || 0}`);

  // Insert properties in batches
  const batchSize = 10;
  let inserted = 0;

  for (let i = 0; i < properties.length; i += batchSize) {
    const batch = properties.slice(i, i + batchSize);

    const { data, error } = await supabase
      .from("properties")
      .insert(batch)
      .select("id");

    if (error) {
      console.error(`❌ Batch ${i / batchSize + 1} error:`, error.message);
    } else {
      inserted += data?.length || 0;
      console.log(
        `✅ Batch ${Math.floor(i / batchSize) + 1}: Inserted ${data?.length || 0} properties`,
      );
    }
  }

  console.log(`\n🎉 Total inserted: ${inserted} properties`);

  // Verify and show distribution
  const { data: stats } = await supabase
    .from("properties")
    .select("city, type");

  if (stats) {
    const distribution: Record<string, Record<string, number>> = {};
    stats.forEach((p) => {
      if (!distribution[p.city]) distribution[p.city] = {};
      distribution[p.city][p.type] = (distribution[p.city][p.type] || 0) + 1;
    });

    console.log("\n📊 Distribution by City & Type:");
    console.log("================================");
    Object.entries(distribution).forEach(([city, types]) => {
      console.log(`\n${city}:`);
      Object.entries(types).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count}`);
      });
    });
  }

  // Final count
  const { count: finalCount } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true });

  console.log(`\n✅ Total properties in database: ${finalCount}`);
}

seedProperties()
  .then(() => {
    console.log("\n🚀 Seed completed!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
