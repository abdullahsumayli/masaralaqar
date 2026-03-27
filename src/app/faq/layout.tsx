import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة",
  description: "إجابات على الأسئلة الأكثر تكراراً عن منصة MQ ونظام MQ — الخطط، الربط، الدفع، الأمان.",
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
