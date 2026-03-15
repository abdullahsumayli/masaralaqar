import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Building2, Target, Lightbulb } from "lucide-react";

const sections = [
  {
    id: "what",
    Icon: Building2,
    title: "ما هو Masar AlAqar (مسار العقار)؟",
    content:
      "Masar AlAqar منصة سعودية متخصصة في حلول تقنية للمكاتب العقارية والوسطاء. نقدم أدوات ذكية للرد على العملاء، إدارة العلاقات، التسويق والتحليلات — كل ذلك مصمم خصيصاً لسوق العقار في المملكة. نؤمن بأن كل مكتب عقاري يستحق أدوات احترافية بأسعار مناسبة.",
  },
  {
    id: "why",
    Icon: Target,
    title: "لماذا أُنشئت المنصة؟",
    content:
      "انطلقت Masar AlAqar من تجربة مباشرة مع تحديات المكاتب العقارية: ضياع الفرص بسبب تأخر الرد، إدارة عملاء غير منظمة، ووقت مهدر في مهام متكررة. هدفنا كان واضحاً — بناء منصة واحدة تجمع الذكاء الاصطناعي، الأتمتة والتحليلات لتمكين الوسطاء من التركيز على الإغلاق وخدمة العملاء بدلاً من الأعمال الروتينية.",
  },
  {
    id: "vision",
    Icon: Lightbulb,
    title: "رؤيتنا لتقنية العقارات",
    content:
      "نرى مستقبلاً تكون فيه كل مكتب عقاري يستخدم أدوات ذكية للرد الفوري، إدارة علاقات شفافة، وحملات تسويقية مبنية على البيانات. نعمل على توسيع مجموعة منتجات Masar AlAqar (صقر، CRM، أتمتة الحملات، تحليلات السوق) مع الحفاظ على البساطة والسعر المناسب. رؤيتنا أن نكون الشريك التقني الأول لفرق العقارات في السعودية والمنطقة.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-[#F0F4FF]">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              عن <span className="text-primary">Masar AlAqar</span>
            </h1>
            <p className="text-[#94A3B8] text-lg">
              مسار العقار — AI tools for modern real estate teams. منصة تقنية لخدمة المكاتب العقارية في السعودية
            </p>
          </div>

          <div className="space-y-8">
            {sections.map(({ id, Icon, title, content }, i) => (
              <section
                key={id}
                className="rounded-2xl border border-white/[0.08] bg-[#111E35]/60 p-8"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#F0F4FF] mb-3">{title}</h2>
                    <p className="text-[#94A3B8] leading-relaxed">{content}</p>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
