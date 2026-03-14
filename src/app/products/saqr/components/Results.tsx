"use client";

import { motion, useInView } from "framer-motion";
import { Clock, Handshake, Target, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

function AnimatedNumber({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1200;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

const metrics = [
  {
    icon: TrendingUp,
    value: 10,
    suffix: "x",
    label: "زيادة سرعة الرد",
    description: "رد فوري بدل انتظار ساعات",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Clock,
    value: 0,
    suffix: "",
    label: "عدم فقدان أي استفسار",
    description: "كل رسالة تحصل على رد — ولا عميل يضيع",
    color: "text-blue-600",
    bg: "bg-blue-50",
    customDisplay: "صفر فقدان",
  },
  {
    icon: Target,
    value: 80,
    suffix: "%",
    label: "توفير وقت المسوق",
    description: "المسوق يركز على الإغلاق — صقر يتولى الاستقبال",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Handshake,
    value: 45,
    suffix: "%",
    label: "زيادة فرص إغلاق الصفقات",
    description: "عملاء مؤهلين = تحويلات أعلى",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

export default function SaqrResults() {
  return (
    <section className="bg-[#2F3E46] px-4 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="text-center mb-14"
        >
          <motion.span
            variants={fadeUp}
            className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80"
          >
            النتائج
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-cairo text-3xl md:text-4xl font-bold text-white"
          >
            أرقام تتكلم عن نفسها
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid gap-6 sm:grid-cols-2 md:grid-cols-4"
        >
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="rounded-2xl bg-white p-8 text-center"
            >
              <div
                className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${metric.bg}`}
              >
                <metric.icon className={`h-7 w-7 ${metric.color}`} />
              </div>
              <div
                className={`text-4xl font-extrabold ${metric.color} mb-2 font-cairo`}
              >
                {(metric as any).customDisplay ? (
                  (metric as any).customDisplay
                ) : (
                  <AnimatedNumber
                    target={metric.value}
                    suffix={metric.suffix}
                  />
                )}
              </div>
              <h3 className="text-lg font-bold text-[#2F3E46] mb-1">
                {metric.label}
              </h3>
              <p className="text-[#2F3E46]/60 text-sm">{metric.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
