import type { Metadata } from "next";
import SaqrLanding from "./SaqrLanding";

export const metadata: Metadata = {
  title: "نظام صقر — مساعد استقبال ذكي لمكاتب العقار عبر واتساب",
  description:
    "صقر يرد على عملاء مكتبك العقاري فوراً عبر واتساب، يؤهّل العملاء تلقائياً، ويحوّل الاستفسارات إلى صفقات جاهزة للإغلاق.",
  openGraph: {
    title: "نظام صقر — مساعد استقبال ذكي لمكاتب العقار عبر واتساب",
    description:
      "لا تضيع أي عميل بسبب تأخر الرد. صقر يستقبل استفسارات واتساب ويحوّلها إلى عملاء مؤهلين.",
    type: "website",
  },
};

export default function SaqrPage() {
  return <SaqrLanding />;
}
