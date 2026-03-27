"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { KnowledgeCard } from "@/components/knowledge/KnowledgeCard";
import { BookOpen, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function KnowledgeHubPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium px-4 py-1.5">
              MQ
            </span>
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-cairo text-4xl font-bold mb-4 md:text-5xl"
          >
            مركز <span className="text-primary">المعرفة</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-ibm-arabic text-lg text-text-secondary"
          >
            مقالات، أدلة وموارد من منصة MQ لمساعدتك في تطوير عملك العقاري
          </motion.p>
        </div>
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <KnowledgeCard
              title="المدونة"
              description="مقالات متخصصة في العقار، الأتمتة، الذكاء الاصطناعي والتسويق العقاري."
              href="/knowledge/blog"
              icon={FileText}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <KnowledgeCard
              title="المكتبة"
              description="كتب إلكترونية، أدلة، نماذج وإنفوجرافيك للوسيط العقاري."
              href="/knowledge/library"
              icon={BookOpen}
            />
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
