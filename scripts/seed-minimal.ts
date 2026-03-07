// Seed without bathrooms column - adapt to existing schema
const SUPABASE_URL = "https://jtwlyexgptntdubxnnaw.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0d2x5ZXhncHRudGR1YnhubmF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTM4NDcxNCwiZXhwIjoyMDg2OTYwNzE0fQ.7N2XRif1EChlm1gbrB-ayf11Cp-9zrOR3JTREeORoSI";

const TENANT_ID = "00000000-0000-0000-0000-000000000001";

// First, check what columns exist
async function getColumns(): Promise<string[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/properties?select=*&limit=0`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    },
  );

  // Parse OpenAPI schema to get columns
  const schemaRes = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

  return [];
}

// Properties with only basic fields
const properties = [
  {
    title: "شقة حديثة في حي الياسمين",
    description:
      "شقة حديثة بتشطيب فاخر في حي الياسمين، قريبة من المدارس والمراكز التجارية.",
    price: 750000,
    location: "حي الياسمين - الرياض",
    type: "apartment",
    bedrooms: 3,
    area: 150,
  },
  {
    title: "شقة فاخرة في حي النرجس",
    description: "شقة راقية في حي النرجس بالرياض، مساحة واسعة وتصميم مميز.",
    price: 920000,
    location: "حي النرجس - الرياض",
    type: "apartment",
    bedrooms: 4,
    area: 180,
  },
  {
    title: "شقة اقتصادية في حي العارض",
    description: "شقة بسعر مناسب في حي العارض، مثالية للعائلات الصغيرة.",
    price: 480000,
    location: "حي العارض - الرياض",
    type: "apartment",
    bedrooms: 2,
    area: 95,
  },
  {
    title: "شقة عائلية في حي الملقا",
    description: "شقة مميزة في حي الملقا الراقي، قريبة من المدارس الدولية.",
    price: 850000,
    location: "حي الملقا - الرياض",
    type: "apartment",
    bedrooms: 3,
    area: 165,
  },
  {
    title: "شقة جديدة في حي الصحافة",
    description: "شقة جديدة لم تسكن في حي الصحافة، تشطيب سوبر ديلوكس.",
    price: 620000,
    location: "حي الصحافة - الرياض",
    type: "apartment",
    bedrooms: 2,
    area: 120,
  },
  {
    title: "شقة دوبلكس في حي الرمال",
    description: "شقة دوبلكس فاخرة في حي الرمال، مكونة من طابقين مع سطح خاص.",
    price: 1100000,
    location: "حي الرمال - الرياض",
    type: "apartment",
    bedrooms: 4,
    area: 200,
  },
  {
    title: "شقة استثمارية في حي الورود",
    description: "فرصة استثمارية مميزة بعائد إيجاري ممتاز.",
    price: 550000,
    location: "حي الورود - الرياض",
    type: "apartment",
    bedrooms: 2,
    area: 100,
  },
  {
    title: "شقة مفروشة في حي الغدير",
    description: "شقة مفروشة بالكامل جاهزة للسكن فوراً.",
    price: 680000,
    location: "حي الغدير - الرياض",
    type: "apartment",
    bedrooms: 2,
    area: 110,
  },
  {
    title: "فيلا فاخرة في حي الملقا",
    description: "فيلا فاخرة بتصميم عصري، 5 غرف نوم وحديقة خاصة ومسبح.",
    price: 2500000,
    location: "حي الملقا - الرياض",
    type: "villa",
    bedrooms: 5,
    area: 350,
  },
  {
    title: "فيلا دور واحد في حي النرجس",
    description: "فيلا دور واحد مع ملحق، تصميم سعودي أصيل.",
    price: 1800000,
    location: "حي النرجس - الرياض",
    type: "villa",
    bedrooms: 4,
    area: 280,
  },
  {
    title: "فيلا مع مسبح في حي الياسمين",
    description: "فيلا راقية مع مسبح خاص، 6 غرف نوم ومجلس منفصل.",
    price: 2800000,
    location: "حي الياسمين - الرياض",
    type: "villa",
    bedrooms: 6,
    area: 450,
  },
  {
    title: "فيلا عائلية في حي العقيق",
    description: "فيلا مناسبة للعائلة الكبيرة، قريبة من الخدمات.",
    price: 2200000,
    location: "حي العقيق - الرياض",
    type: "villa",
    bedrooms: 5,
    area: 380,
  },
  {
    title: "فيلا صغيرة في حي الربيع",
    description: "فيلا صغيرة مناسبة للعائلة المتوسطة.",
    price: 1400000,
    location: "حي الربيع - الرياض",
    type: "villa",
    bedrooms: 4,
    area: 250,
  },
  {
    title: "شقة بحرية في حي الشاطئ",
    description: "شقة فاخرة مطلة على البحر في جدة.",
    price: 950000,
    location: "حي الشاطئ - جدة",
    type: "apartment",
    bedrooms: 3,
    area: 160,
  },
  {
    title: "شقة حديثة في حي الروضة",
    description: "شقة عصرية في حي الروضة بجدة.",
    price: 520000,
    location: "حي الروضة - جدة",
    type: "apartment",
    bedrooms: 2,
    area: 100,
  },
  {
    title: "شقة في برج سكني بحي الفيصلية",
    description: "شقة في برج سكني راقي، خدمات فندقية.",
    price: 1100000,
    location: "حي الفيصلية - جدة",
    type: "apartment",
    bedrooms: 3,
    area: 175,
  },
  {
    title: "شقة اقتصادية في حي النزهة",
    description: "شقة بسعر مناسب في حي النزهة بجدة.",
    price: 420000,
    location: "حي النزهة - جدة",
    type: "apartment",
    bedrooms: 2,
    area: 90,
  },
  {
    title: "شقة في أبحر الشمالية",
    description: "شقة مميزة قريبة من البحر والمتنزهات.",
    price: 780000,
    location: "أبحر الشمالية - جدة",
    type: "apartment",
    bedrooms: 3,
    area: 145,
  },
  {
    title: "فيلا فاخرة في حي الحمراء",
    description: "فيلا راقية في حي الحمراء بجدة، تصميم كلاسيكي فاخر.",
    price: 2900000,
    location: "حي الحمراء - جدة",
    type: "villa",
    bedrooms: 6,
    area: 480,
  },
  {
    title: "فيلا حديثة في حي المرجان",
    description: "فيلا بتصميم مودرن قريبة من البحر.",
    price: 2400000,
    location: "حي المرجان - جدة",
    type: "villa",
    bedrooms: 5,
    area: 400,
  },
  {
    title: "فيلا عائلية في أبحر الجنوبية",
    description: "فيلا مناسبة للعائلة، موقع هادئ.",
    price: 1650000,
    location: "أبحر الجنوبية - جدة",
    type: "villa",
    bedrooms: 4,
    area: 320,
  },
  {
    title: "شقة في حي الشاطئ الغربي",
    description: "شقة مطلة على البحر في الدمام.",
    price: 680000,
    location: "حي الشاطئ الغربي - الدمام",
    type: "apartment",
    bedrooms: 3,
    area: 140,
  },
  {
    title: "شقة في حي الفيصلية بالدمام",
    description: "شقة مميزة قريبة من الأسواق والمدارس.",
    price: 450000,
    location: "حي الفيصلية - الدمام",
    type: "apartment",
    bedrooms: 2,
    area: 95,
  },
  {
    title: "شقة حديثة في حي الجلوية",
    description: "شقة جديدة بتشطيب ممتاز.",
    price: 580000,
    location: "حي الجلوية - الدمام",
    type: "apartment",
    bedrooms: 3,
    area: 130,
  },
  {
    title: "شقة فاخرة في حي العزيزية",
    description: "شقة راقية بتشطيب سوبر ديلوكس.",
    price: 850000,
    location: "حي العزيزية - الدمام",
    type: "apartment",
    bedrooms: 4,
    area: 170,
  },
  {
    title: "فيلا عصرية في حي الجبيل بالدمام",
    description: "فيلا بتصميم حديث مع روف واسع.",
    price: 1900000,
    location: "حي الجبيل - الدمام",
    type: "villa",
    bedrooms: 4,
    area: 350,
  },
  {
    title: "شقة على الكورنيش في الخبر",
    description: "شقة مميزة مطلة على كورنيش الخبر.",
    price: 920000,
    location: "الكورنيش - الخبر",
    type: "apartment",
    bedrooms: 3,
    area: 155,
  },
  {
    title: "شقة في حي الراكة الشمالية",
    description: "شقة عائلية في موقع حيوي.",
    price: 620000,
    location: "حي الراكة الشمالية - الخبر",
    type: "apartment",
    bedrooms: 3,
    area: 135,
  },
  {
    title: "شقة اقتصادية في حي الثقبة",
    description: "شقة بسعر مناسب للمستثمرين.",
    price: 380000,
    location: "حي الثقبة - الخبر",
    type: "apartment",
    bedrooms: 2,
    area: 85,
  },
  {
    title: "شقة جديدة في حي العليا",
    description: "شقة جديدة لم تسكن بتشطيب ممتاز.",
    price: 550000,
    location: "حي العليا - الخبر",
    type: "apartment",
    bedrooms: 3,
    area: 125,
  },
  {
    title: "فيلا فاخرة في حي الحزام الأخضر",
    description: "فيلا راقية مع حديقة ومسبح.",
    price: 2600000,
    location: "حي الحزام الأخضر - الخبر",
    type: "villa",
    bedrooms: 5,
    area: 420,
  },
  {
    title: "شقة قريبة من الحرم",
    description: "شقة مميزة قريبة من الحرم المكي الشريف.",
    price: 750000,
    location: "العزيزية - مكة",
    type: "apartment",
    bedrooms: 2,
    area: 90,
  },
  {
    title: "شقة في حي الشوقية",
    description: "شقة واسعة قريبة من الخدمات.",
    price: 580000,
    location: "حي الشوقية - مكة",
    type: "apartment",
    bedrooms: 3,
    area: 120,
  },
  {
    title: "فيلا في حي النوارية",
    description: "فيلا عائلية مع حديقة صغيرة.",
    price: 1600000,
    location: "حي النوارية - مكة",
    type: "villa",
    bedrooms: 4,
    area: 280,
  },
  {
    title: "شقة قريبة من المسجد النبوي",
    description: "شقة مميزة قريبة من المسجد النبوي الشريف.",
    price: 820000,
    location: "المنطقة المركزية - المدينة",
    type: "apartment",
    bedrooms: 3,
    area: 110,
  },
  {
    title: "شقة في حي العزيزية بالمدينة",
    description: "شقة عائلية قريبة من المدارس والأسواق.",
    price: 450000,
    location: "حي العزيزية - المدينة",
    type: "apartment",
    bedrooms: 2,
    area: 95,
  },
  {
    title: "فيلا في حي الحرة الشرقية",
    description: "فيلا مميزة مع حديقة ومجالس منفصلة.",
    price: 1850000,
    location: "حي الحرة الشرقية - المدينة",
    type: "villa",
    bedrooms: 5,
    area: 360,
  },
  {
    title: "أرض سكنية في شمال الرياض",
    description: "أرض سكنية مساحة 500 متر على شارعين.",
    price: 650000,
    location: "شمال الرياض",
    type: "land",
    bedrooms: null,
    area: 500,
  },
  {
    title: "أرض تجارية في جدة",
    description: "أرض تجارية على طريق المدينة مساحة 1000 متر.",
    price: 1800000,
    location: "طريق المدينة - جدة",
    type: "land",
    bedrooms: null,
    area: 1000,
  },
  {
    title: "أرض سكنية في الدمام",
    description: "أرض سكنية 400 متر زاوية على شارعين.",
    price: 450000,
    location: "حي الفردوس - الدمام",
    type: "land",
    bedrooms: null,
    area: 400,
  },
  {
    title: "أرض استثمارية في الخبر",
    description: "أرض استثمارية 800 متر مناسبة لمجمع سكني.",
    price: 1200000,
    location: "طريق الظهران - الخبر",
    type: "land",
    bedrooms: null,
    area: 800,
  },
  {
    title: "مكتب تجاري في برج الفيصلية",
    description: "مكتب فاخر بتشطيب كامل وخدمات متكاملة.",
    price: 1500000,
    location: "برج الفيصلية - الرياض",
    type: "commercial",
    bedrooms: null,
    area: 200,
  },
  {
    title: "محل تجاري على طريق الملك فهد",
    description: "محل تجاري بواجهة 8 متر مناسب للمطاعم.",
    price: 950000,
    location: "طريق الملك فهد - الرياض",
    type: "commercial",
    bedrooms: null,
    area: 120,
  },
  {
    title: "مستودع في المنطقة الصناعية",
    description: "مستودع 500 متر مكيف مع مكاتب.",
    price: 2200000,
    location: "المنطقة الصناعية الثانية - الرياض",
    type: "commercial",
    bedrooms: null,
    area: 500,
  },
  {
    title: "مكتب في جدة مول",
    description: "مكتب تجاري في موقع مميز وحركة عالية.",
    price: 650000,
    location: "جدة مول - جدة",
    type: "commercial",
    bedrooms: null,
    area: 80,
  },
  {
    title: "صالة عرض في الخبر",
    description: "صالة عرض بواجهة زجاجية 15 متر.",
    price: 1800000,
    location: "شارع الأمير ماجد - الخبر",
    type: "commercial",
    bedrooms: null,
    area: 350,
  },
  {
    title: "عمارة استثمارية بالدمام",
    description: "عمارة سكنية 8 شقق مؤجرة بعائد 8%.",
    price: 3500000,
    location: "حي المزروعية - الدمام",
    type: "commercial",
    bedrooms: null,
    area: 600,
  },
  {
    title: "شقة بإطلالة في حي المروج",
    description: "شقة بإطلالة رائعة على الحديقة.",
    price: 720000,
    location: "حي المروج - الرياض",
    type: "apartment",
    bedrooms: 3,
    area: 140,
  },
  {
    title: "شقة مودرن في حي الواحة",
    description: "شقة بتصميم مودرن وإضاءة طبيعية ممتازة.",
    price: 590000,
    location: "حي الواحة - الرياض",
    type: "apartment",
    bedrooms: 2,
    area: 105,
  },
  {
    title: "فيلا فخمة في حي الندى",
    description: "فيلا فخمة مع مسبح داخلي وخارجي.",
    price: 3200000,
    location: "حي الندى - الرياض",
    type: "villa",
    bedrooms: 7,
    area: 550,
  },
];

async function seedProperties() {
  console.log(
    "🏠 Starting minimal seed (without bathrooms, city, images, featured)...\n",
  );

  let inserted = 0;
  let failed = 0;

  for (const prop of properties) {
    const body: any = {
      title: prop.title,
      description: prop.description,
      price: prop.price,
      location: prop.location,
      type: prop.type,
      area: prop.area,
    };

    // Only add bedrooms if not null
    if (prop.bedrooms !== null) {
      body.bedrooms = prop.bedrooms;
    }

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        inserted++;
        process.stdout.write(`\r✅ Inserted: ${inserted}/${properties.length}`);
      } else {
        const error = await response.text();
        failed++;
        console.log(`\n❌ ${prop.title}: ${error}`);
      }
    } catch (err: any) {
      failed++;
      console.log(`\n❌ ${prop.title}: ${err.message}`);
    }
  }

  console.log(`\n\n🎉 Total inserted: ${inserted}`);
  console.log(`❌ Failed: ${failed}`);

  // Verify count
  const countRes = await fetch(
    `${SUPABASE_URL}/rest/v1/properties?select=count`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "count=exact",
      },
    },
  );

  const countHeader = countRes.headers.get("content-range");
  console.log(`\n📊 Total in database: ${countHeader}`);
}

seedProperties();
