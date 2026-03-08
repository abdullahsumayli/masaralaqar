"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/products/saqr", label: "نظام صقر" },
  { href: "/products/saqr#pricing", label: "الأسعار" },
  { href: "/blog", label: "المدونة" },
  { href: "/library", label: "المكتبة" },
  { href: "/contact", label: "تواصل" },
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
      {/* Top accent line */}
      {isScrolled && (
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#4F8EF7]/40 to-transparent" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative w-9 h-9 md:w-10 md:h-10">
              {/* Glow */}
              <div className="absolute inset-0 rounded-xl bg-[#4F8EF7]/20 blur-lg group-hover:bg-[#4F8EF7]/35 transition-all duration-500" />
              <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-[#4F8EF7] to-[#2B6DE8] flex items-center justify-center border border-[#4F8EF7]/30 shadow-[0_4px_12px_rgba(79,142,247,0.35)]">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-cairo font-bold text-base md:text-lg text-[#F0F4FF] tracking-tight">
                مسار العقار
              </span>
              <span className="text-[10px] text-[#4F8EF7]/80 font-medium hidden sm:block">
                PropTech Saudi
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 rounded-lg text-[#94A3B8] hover:text-[#F0F4FF] text-sm font-medium transition-all duration-200 hover:bg-white/[0.04] group"
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute inset-x-4 bottom-1 h-px bg-[#4F8EF7]/0 group-hover:bg-[#4F8EF7]/50 transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-[#94A3B8] hover:text-[#F0F4FF] text-sm font-medium transition-colors duration-200"
            >
              دخول
            </Link>
            <Link
              href="/auth/signup"
              className="btn-primary text-sm py-2.5 px-5"
            >
              جرب مجاناً
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative w-9 h-9 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-[#94A3B8] hover:text-[#F0F4FF] hover:border-[#4F8EF7]/30 transition-all"
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

        {/* Mobile Navigation */}
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
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-4 py-3 text-[#94A3B8] hover:text-[#F0F4FF] hover:bg-white/[0.04] rounded-xl transition-all font-medium text-sm"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="px-4 pb-5 pt-2 grid grid-cols-2 gap-2.5 border-t border-white/[0.06]">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="btn-outline text-sm py-2.5 justify-center"
                  >
                    دخول النظام
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary text-sm py-2.5 justify-center"
                  >
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
