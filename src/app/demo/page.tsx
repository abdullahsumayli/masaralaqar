"use client";

import { motion } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    BarChart3,
    Bot,
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    MessageCircle,
    Phone,
    Play,
    Send,
    Sparkles,
    Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MqLogo } from "@/components/mq/MqLogo";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Demo conversation simulation
const demoConversation = [
  {
    type: "client",
    message: "السلام عليكم، أبي شقة للإيجار في الرياض حي النرجس",
    time: "10:30 ص",
  },
  {
    type: "bot",
    message:
      "وعليكم السلام! 👋\n\nأهلاً بك، أنا مساعد MQ الذكي لمكتبك العقاري.\n\nممتاز، حي النرجس من الأحياء المميزة! عشان أساعدك بشكل أفضل:\n\n📐 كم عدد الغرف اللي تحتاجها؟",
    time: "10:30 ص",
  },
  {
    type: "client",
    message: "3 غرف",
    time: "10:31 ص",
  },
  {
    type: "bot",
    message: "تمام! 3 غرف 👍\n\n💰 كم ميزانيتك السنوية للإيجار؟",
    time: "10:31 ص",
  },
  {
    type: "client",
    message: "35 ألف",
    time: "10:32 ص",
  },
  {
    type: "bot",
    message:
      "ممتاز! عندنا خيارات مناسبة لميزانيتك 🏠\n\n📅 متى تقدر تحضر للمعاينة؟\n\n1️⃣ اليوم بعد العصر\n2️⃣ غداً الصباح\n3️⃣ غداً المساء",
    time: "10:32 ص",
  },
  {
    type: "client",
    message: "غداً الصباح",
    time: "10:33 ص",
  },
  {
    type: "bot",
    message:
      "تم حجز موعدك! ✅\n\n📍 المعاينة: غداً الساعة 10 صباحاً\n📌 الموقع: حي النرجس، الرياض\n👤 المندوب: أ. محمد\n📱 للتواصل: 0501234567\n\nسيتواصل معك المندوب قبل الموعد للتأكيد.\n\nشكراً لثقتك بمكتبنا! 🏢",
    time: "10:33 ص",
  },
];

const demoSteps = [
  {
    icon: MessageCircle,
    title: "استقبال الاستفسار",
    description: "العميل يرسل رسالة واتساب عادية",
  },
  {
    icon: Bot,
    title: "فهم الطلب بالذكاء الاصطناعي",
    description: "MQ يفهم احتياجات العميل ويسأل أسئلة ذكية",
  },
  {
    icon: Users,
    title: "تصنيف العميل",
    description: "تحديد جدية العميل وأولويته",
  },
  {
    icon: Calendar,
    title: "جدولة تلقائية",
    description: "حجز موعد المعاينة في التقويم",
  },
  {
    icon: CheckCircle,
    title: "إشعار فوري",
    description: "تنبيه المندوب بالموعد الجديد",
  },
];

const stats = [
  { value: "< 3 ثواني", label: "وقت الرد" },
  { value: "24/7", label: "متاح دائماً" },
  { value: "+85%", label: "معدل التحويل" },
  { value: "0", label: "عملاء ضائعين" },
];

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showFullDemo, setShowFullDemo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const startDemo = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(true);
    setCurrentStep(0);
    setShowFullDemo(true);

    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      if (step < demoConversation.length) {
        setCurrentStep(step);
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsPlaying(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark">
              <MqLogo onPrimary className="h-[70%] w-[70%]" />
            </div>
            <div>
              <span className="text-primary font-bold text-xl block leading-tight">
                MQ
              </span>
              <span className="text-gray-500 text-xs">masaralaqar.com</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              الرئيسية
            </Link>
            <Link
              href="/products/saqr"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              نظام MQ
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              تواصل معنا
            </Link>
          </nav>

          <Link
            href="/auth/signup"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-white rounded-lg font-medium hover:bg-secondary-dark transition-colors"
          >
            جرب MQ مجاناً
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <Play className="w-4 h-4" />
              العرض التوضيحي
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              شاهد كيف يعمل
              <span className="text-primary"> MQ</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
              محادثة توضيحية لكيفية رد MQ على عملائك وجدولة المعاينات تلقائياً
            </p>
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Phone Mockup */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="relative mx-auto"
            >
              <div className="w-[320px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                <div className="bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Phone Header */}
                  <div className="bg-[#075E54] text-white p-4">
                    <div className="flex items-center gap-3">
                      <ArrowRight className="w-5 h-5" />
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-medium">مكتب تجريبي</div>
                        <div className="text-xs text-white/70">متصل الآن</div>
                      </div>
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="h-[450px] bg-[#ECE5DD] p-3 overflow-y-auto space-y-3">
                    {!showFullDemo ? (
                      <div className="flex items-center justify-center h-full">
                        <button
                          type="button"
                          onClick={startDemo}
                          className="flex flex-col items-center gap-4 text-center"
                        >
                          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center animate-pulse">
                            <Play className="w-10 h-10 text-white mr-[-4px]" />
                          </div>
                          <span className="text-gray-600 font-medium">
                            اضغط لبدء العرض
                          </span>
                        </button>
                      </div>
                    ) : (
                      <>
                        {demoConversation
                          .slice(0, currentStep + 1)
                          .map((msg, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.3 }}
                              className={`flex ${msg.type === "client" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[85%] rounded-lg p-3 ${
                                  msg.type === "client"
                                    ? "bg-[#DCF8C6] rounded-tr-none"
                                    : "bg-white rounded-tl-none"
                                }`}
                              >
                                {msg.type === "bot" && (
                                  <div className="flex items-center gap-1 mb-1">
                                    <Sparkles className="w-3 h-3 text-primary" />
                                    <span className="text-xs text-primary font-medium">
                                      MQ AI
                                    </span>
                                  </div>
                                )}
                                <p className="text-sm whitespace-pre-line text-gray-800">
                                  {msg.message}
                                </p>
                                <div className="text-[10px] text-gray-500 text-left mt-1">
                                  {msg.time}
                                </div>
                              </div>
                            </motion.div>
                          ))}

                        {isPlaying &&
                          currentStep < demoConversation.length - 1 && (
                            <div className="flex justify-start">
                              <div className="bg-white rounded-lg p-3 rounded-tl-none">
                                <div className="flex gap-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                  <div
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.1s" }}
                                  ></div>
                                  <div
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                      </>
                    )}
                  </div>

                  {/* Input Area */}
                  <div className="bg-[#F0F0F0] p-2 flex items-center gap-2">
                    <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-gray-400">
                      اكتب رسالة...
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#075E54] flex items-center justify-center">
                      <Send className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -z-10 top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -z-10 bottom-10 -left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
            </motion.div>

            {/* Demo Info */}
            <div className="space-y-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h2 className="text-2xl font-bold mb-4">
                  ماذا حدث في هذه المحادثة؟
                </h2>
                <div className="space-y-4">
                  {demoSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                        showFullDemo && currentStep >= index * 2
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-surface"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          showFullDemo && currentStep >= index * 2
                            ? "bg-primary text-white"
                            : "bg-[#111E35] border border-[rgba(37,211,102,0.12)] text-text-muted"
                        }`}
                      >
                        <step.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">{step.title}</h3>
                        <p className="text-text-secondary text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Controls */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={startDemo}
                  disabled={isPlaying}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  <Play className="w-5 h-5" />
                  {showFullDemo ? "إعادة العرض" : "بدء العرض"}
                </button>
                <Link
                  href="/auth/signup"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-secondary-dark transition-colors"
                >
                  جرّب MQ الآن
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">
                  {stat.value}
                </div>
                <div className="text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">لماذا MQ مختلف؟</h2>
            <p className="text-text-secondary text-lg">
              ليس مجرد بوت — بل مساعد ذكي يفهم السوق السعودي
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Bot,
                title: "يفهم اللهجة السعودية",
                description:
                  'MQ يفهم "أبي"، "ودي"، "يعني" وكل العبارات المحلية',
              },
              {
                icon: Clock,
                title: "يرد فوراً",
                description:
                  "لا يترك العميل ينتظر — الرد خلال ثواني وليس ساعات",
              },
              {
                icon: BarChart3,
                title: "يتعلم ويتحسن",
                description: "كلما استخدمته أكثر، أصبح أذكى وأدق في الردود",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="bg-surface rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-secondary to-secondary-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              جاهز تجرب MQ؟
            </h2>
            <p className="text-white/80 text-lg mb-10">
              14 يوم مجاناً — بدون بطاقة ائتمانية
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#F0F4FF] text-[#070B14] rounded-xl font-bold hover:bg-white transition-colors"
              >
                ابدأ التجربة المجانية
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-colors"
              >
                <Phone className="w-5 h-5" />
                تواصل معنا
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-primary text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
              <MqLogo onPrimary className="h-[72%] w-[72%]" />
            </div>
            <span className="font-bold text-lg">MQ</span>
          </div>
          <p className="text-white/60 text-sm">
            © 2026 MQ — مسار العقار. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
