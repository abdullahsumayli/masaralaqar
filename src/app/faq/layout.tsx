import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة",
  description: "إجابات على الأسئلة الأكثر تكراراً عن منصة Masar AlAqar ونظام صقر — الخطط، الربط، الدفع، الأمان.",
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
