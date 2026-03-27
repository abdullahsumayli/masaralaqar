"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

/** يمرّر إلى `#id` عند فتح الصفحة أو التنقل إليها بـ hash (مثلاً من Link). */
export function ScrollToHashOnMount() {
  useEffect(() => {
    const raw = window.location.hash;
    if (!raw || raw.length <= 1) return;
    const id = raw.slice(1);
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}

/**
 * رابط يمرّر بسلاسة إلى عنصر على الصفحة (يعمل مع App Router حيث Link + hash قد لا يمرّر).
 */
export function HashScrollLink({
  hash,
  className,
  children,
  ...props
}: {
  hash: string;
  className?: string;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">) {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const href = `#${id}`;

  return (
    <a
      href={href}
      className={cn(className)}
      onClick={(e) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${href}`);
        }
      }}
      {...props}
    >
      {children}
    </a>
  );
}
