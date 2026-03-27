"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { KnowledgeDropdown } from "@/components/nav/KnowledgeDropdown";
import { ProductsDropdown } from "@/components/nav/ProductsDropdown";

const mainNav = [
  { type: "dropdown" as const, key: "products", Component: ProductsDropdown },
  { type: "link" as const, href: "/pricing", label: "الأسعار" },
  { type: "link" as const, href: "/affiliate", label: "برنامج الإحالة" },
  { type: "dropdown" as const, key: "knowledge", Component: KnowledgeDropdown },
  { type: "link" as const, href: "/about", label: "عن المنصة" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-[#070B14]/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          : "bg-transparent"
      )}
    >
      {isScrolled && (
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0" aria-label="MQ - الصفحة الرئيسية">
            <div className="relative w-9 h-9 md:w-10 md:h-10">
              <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg group-hover:bg-primary/35 transition-all duration-500" />
              <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center border border-primary/30 shadow-button-blue">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-cairo font-bold text-base md:text-lg text-[#F0F4FF] tracking-tight">
                MQ
              </span>
              <span className="text-[10px] text-primary/90 font-medium hidden sm:block">
                MQ · AI tools for real estate
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {mainNav.map((item) =>
              item.type === "dropdown" ? (
                <item.Component key={item.key} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 rounded-lg text-[#94A3B8] hover:text-[#F0F4FF] text-sm font-medium transition-all duration-200 hover:bg-white/[0.04] group"
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute inset-x-4 bottom-1 h-px bg-primary/0 group-hover:bg-primary/50 transition-all duration-300" />
                </Link>
              )
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-[#94A3B8] hover:text-[#F0F4FF] text-sm font-medium transition-colors duration-200"
            >
              دخول
            </Link>
            <Link href="/auth/signup" className="btn-primary text-sm py-2.5 px-5">
              جرب مجاناً
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative w-9 h-9 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-[#94A3B8] hover:text-[#F0F4FF] hover:border-primary/30 transition-all"
            aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="w-4.5 h-4.5" />
                </motion.div>
              ) : (
                <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu className="w-4.5 h-4.5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </nav>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden"
            >
              <div className="border-t border-white/[0.06] bg-[#0D1526]/95 backdrop-blur-2xl rounded-b-2xl">
                <div className="py-4 px-2 space-y-1">
                  <Link href="/products" onClick={() => setIsOpen(false)} className="flex px-4 py-3 text-[#94A3B8] hover:text-[#F0F4FF] hover:bg-white/[0.04] rounded-xl font-medium text-sm">
                    المنتجات
                  </Link>
                  <Link href="/products/saqr" onClick={() => setIsOpen(false)} className="flex px-6 py-2 text-[#94A3B8] hover:text-[#F0F4FF] text-sm">
                    MQ
                  </Link>
                  <Link href="/pricing" onClick={() => setIsOpen(false)} className="flex px-4 py-3 text-[#94A3B8] hover:text-[#F0F4FF] hover:bg-white/[0.04] rounded-xl font-medium text-sm">
                    الأسعار
                  </Link>
                  <Link href="/affiliate" onClick={() => setIsOpen(false)} className="flex px-4 py-3 text-[#94A3B8] hover:text-[#F0F4FF] hover:bg-white/[0.04] rounded-xl font-medium text-sm">
                    برنامج الإحالة
                  </Link>
                  <Link href="/knowledge" onClick={() => setIsOpen(false)} className="flex px-4 py-3 text-[#94A3B8] hover:text-[#F0F4FF] hover:bg-white/[0.04] rounded-xl font-medium text-sm">
                    المعرفة
                  </Link>
                  <Link href="/knowledge/blog" onClick={() => setIsOpen(false)} className="flex px-6 py-2 text-[#94A3B8] hover:text-[#F0F4FF] text-sm">
                    المدونة
                  </Link>
                  <Link href="/knowledge/library" onClick={() => setIsOpen(false)} className="flex px-6 py-2 text-[#94A3B8] hover:text-[#F0F4FF] text-sm">
                    المكتبة
                  </Link>
                  <Link href="/about" onClick={() => setIsOpen(false)} className="flex px-4 py-3 text-[#94A3B8] hover:text-[#F0F4FF] hover:bg-white/[0.04] rounded-xl font-medium text-sm">
                    عن المنصة
                  </Link>
                  <Link href="/partners" onClick={() => setIsOpen(false)} className="flex px-4 py-3 text-[#94A3B8] hover:text-[#F0F4FF] hover:bg-white/[0.04] rounded-xl font-medium text-sm">
                    الشركاء
                  </Link>
                </div>
                <div className="px-4 pb-5 pt-2 grid grid-cols-2 gap-2.5 border-t border-white/[0.06]">
                  <Link href="/login" onClick={() => setIsOpen(false)} className="btn-outline text-sm py-2.5 justify-center">
                    دخول
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsOpen(false)} className="btn-primary text-sm py-2.5 justify-center">
                    جرب مجاناً
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
