const BASE = "https://masaralaqar.com";

const offers = [
  {
    name: "المبتدئ",
    nameEn: "Starter",
    price: 499,
    description: "مثالي للبداية — مستخدم واحد، رقم واتساب واحد، رد آلي ذكي أساسي، إدارة العملاء المحتملين، تحليلات أساسية",
    url: `${BASE}/pricing`,
  },
  {
    name: "احترافي",
    nameEn: "Pro",
    price: 999,
    description: "للفرق والمكاتب النامية — حتى 5 مستخدمين، حتى 5 أرقام واتساب، ردود ذكية متقدمة، كتالوج العقارات، سير عمل أتمتة",
    url: `${BASE}/pricing`,
  },
  {
    name: "أعمال",
    nameEn: "Business",
    price: 1999,
    description: "للشركات الكبرى — حتى 10 مستخدمين، أتمتة ذكية متقدمة، إدارة الفريق، تقارير متقدمة، دعم ذو أولوية",
    url: `${BASE}/pricing`,
  },
];

function buildSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "خطط تسعير MQ - MQ",
    description: "خطط اشتراك نظام MQ للمكاتب العقارية",
    itemListElement: offers.map((offer, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Offer",
        name: offer.name,
        description: offer.description,
        price: offer.price,
        priceCurrency: "SAR",
        url: offer.url,
        availability: "https://schema.org/InStock",
      },
    })),
  };
}

export function PricingSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSchema()) }}
    />
  );
}
