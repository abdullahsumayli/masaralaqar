import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Building2, Target, Lightbulb } from "lucide-react";

const sections = [
  {
    id: "what",
    Icon: Building2,
    title: "ما هي منصة MQ؟",
    content:
      "MQ منصة سعودية متخصصة في حلول تقنية للمكاتب العقارية والوسطاء. نقدم أدوات ذكية للرد على العملاء، إدارة العلاقات، التسويق والتحليلات — كل ذلك مصمم خصيصاً لسوق العقار في المملكة. نؤمن بأن كل مكتب عقاري يستحق أدوات احترافية بأسعار مناسبة.",
  },
  {
    id: "why",
    Icon: Target,
    title: "لماذا أُنشئت المنصة؟",
    content:
      "انطلقت MQ من تجربة مباشرة مع تحديات المكاتب العقارية: ضياع الفرص بسبب تأخر الرد، إدارة عملاء غير منظمة، ووقت مهدر في مهام متكررة. هدفنا كان واضحاً — بناء منصة واحدة تجمع الذكاء الاصطناعي، الأتمتة والتحليلات لتمكين الوسطاء من التركيز على الإغلاق وخدمة العملاء بدلاً من الأعمال الروتينية.",
  },
  {
    id: "vision",
    Icon: Lightbulb,
    title: "رؤيتنا لتقنية العقارات",
    content:
      "نرى مستقبلاً تكون فيه كل مكتب عقاري يستخدم أدوات ذكية للرد الفوري، إدارة علاقات شفافة، وحملات تسويقية مبنية على البيانات. نعمل على توسيع مجموعة منتجات MQ (نظام MQ، CRM، أتمتة الحملات، تحليلات السوق) مع الحفاظ على البساطة والسعر المناسب. رؤيتنا أن نكون الشريك التقني الأول لفرق العقارات في السعودية والمنطقة.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="font-cairo text-4xl md:text-5xl font-bold mb-4 text-text-primary">
              عن <span className="text-primary">MQ</span>
            </h1>
            <p className="font-ibm-arabic text-lg text-text-secondary leading-relaxed">
              منصة ذكاء اصطناعي وواتساب للعقار في السعودية —{" "}
              <span className="font-sora text-sm font-medium text-slate-600">masaralaqar.com</span>
            </p>
          </div>

          <div className="space-y-8">
            {sections.map(({ id, Icon, title, content }, i) => (
              <section
                key={id}
                className="rounded-2xl border border-border bg-card p-8 shadow-sm"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-cairo text-xl font-bold text-text-primary mb-3">{title}</h2>
                    <p className="font-ibm-arabic text-text-secondary leading-relaxed">{content}</p>
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
