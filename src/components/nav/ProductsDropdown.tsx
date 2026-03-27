"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, MessageSquare, Package } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const products = [
  { href: "/products/saqr", label: "MQ", description: "رد آلي ذكي عبر واتساب", icon: MessageSquare },
  { href: "/products", label: "منتجات مستقبلية", description: "قريباً", icon: Package },
];

export function ProductsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1 px-4 py-2 rounded-lg text-text-secondary hover:text-text-primary text-sm font-medium transition-all hover:bg-card-hover"
        )}
      >
        المنتجات
        <ChevronDown className={cn("w-4 h-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 w-56 rounded-xl border border-border bg-surface/98 backdrop-blur-xl shadow-lg shadow-slate-900/10 py-2 z-50">
          {products.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="text-right">
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs text-text-muted">{item.description}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
