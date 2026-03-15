"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface KnowledgeCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  className?: string;
}

export function KnowledgeCard({ title, description, href, icon: Icon, className }: KnowledgeCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-2xl border border-white/[0.08] bg-[#111E35]/80 p-6 hover:border-primary/30 hover:bg-[#162444]/80 transition-all",
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:border-primary/30 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-bold text-[#F0F4FF] mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-[#94A3B8] text-sm">{description}</p>
    </Link>
  );
}
