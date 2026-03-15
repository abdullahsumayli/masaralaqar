"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCategorySection } from "@/components/product/ProductCategorySection";
import {
  MessageSquare,
  Users,
  Megaphone,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const productCategories = [
  {
    id: "communication",
    title: "أدوات التواصل",
    description: "رد فوري وتصنيف ذكي للعملاء",
    products: [
      {
        id: "saqr",
        title: "صقر",
        description: "رد آلي ذكي عبر واتساب. يرد على العملاء فوراً، يصنّف الجادّين، ويجدول المعاينات.",
        href: "/products/saqr",
        icon: MessageSquare,
        available: true,
      },
    ],
  },
  {
    id: "crm",
    title: "أدوات إدارة العملاء (CRM)",
    description: "إدارة علاقات العملاء والمتابعة",
    products: [
      {
        id: "crm",
        title: "CRM",
        description: "نظام متكامل لإدارة العملاء والعقارات والمتابعة الذكية.",
        href: "#",
        icon: Users,
        available: false,
      },
    ],
  },
  {
    id: "marketing",
    title: "أدوات التسويق",
    description: "أتمتة الحملات والتسويق الرقمي",
    products: [
      {
        id: "campaigns",
        title: "أتمتة الحملات",
        description: "حملات تلقائية موجّهة وإعلانات ذكية للعملاء المناسبين.",
        href: "#",
        icon: Megaphone,
        available: false,
      },
    ],
  },
  {
    id: "analytics",
    title: "أدوات التحليلات",
    description: "رؤى السوق والأداء",
    products: [
      {
        id: "insights",
        title: "رؤى السوق",
        description: "تحليلات السوق العقاري واتجاهات الأسعار والأداء التنافسي.",
        href: "#",
        icon: BarChart3,
        available: false,
      },
    ],
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background text-[#F0F4FF]">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p
              variants={fadeUp}
              className="text-primary text-sm font-medium mb-3"
            >
              منصة المنتجات
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              أدوات لفرق العقارات الحديثة
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-[#94A3B8] text-lg max-w-2xl mx-auto"
            >
              حلول متكاملة للتواصل، إدارة العملاء، التسويق والتحليلات — مصممة للمكاتب العقارية في السعودية
            </motion.p>
          </motion.div>

          {/* Product categories */}
          {productCategories.map((category) => (
            <motion.div
              key={category.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={stagger}
            >
              <ProductCategorySection
                title={category.title}
                description={category.description}
              >
                {category.products.map((product, i) => (
                  <motion.div key={product.id} variants={fadeUp}>
                    <ProductCard
                      title={product.title}
                      description={product.description}
                      href={product.href}
                      icon={product.icon}
                      available={product.available}
                    />
                  </motion.div>
                ))}
              </ProductCategorySection>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
