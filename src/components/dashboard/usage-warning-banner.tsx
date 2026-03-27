"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

/**
 * UsageWarningBanner
 *
 * Shows a warning when the office is approaching or has exceeded
 * its plan message/interaction limits.
 * Reads from the office subscription data in Supabase.
 */
export function UsageWarningBanner() {
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    async function checkUsage() {
      try {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data: office } = await supabase
          .from("offices")
          .select("id, plan, message_count, message_limit")
          .eq("owner_id", user.id)
          .single();

        if (!office || !office.message_limit) return;

        const usage = office.message_count || 0;
        const limit = office.message_limit;
        const ratio = usage / limit;

        if (ratio >= 1) {
          setWarning(
            `وصلت للحد الأقصى من الرسائل (${usage.toLocaleString("ar-SA")}/${limit.toLocaleString("ar-SA")}). قم بترقية باقتك لاستمرار الخدمة.`,
          );
        } else if (ratio >= 0.8) {
          setWarning(
            `استخدمت ${Math.round(ratio * 100)}% من رسائلك الشهرية (${usage.toLocaleString("ar-SA")}/${limit.toLocaleString("ar-SA")}).`,
          );
        }
      } catch {
        // Silently fail — banner is non-critical
      }
    }

    checkUsage();
  }, []);

  if (!warning) return null;

  return (
    <div className="bg-[#E5B84A]/10 border-b border-[#E5B84A]/20 px-4 py-3 flex items-center gap-3 text-sm">
      <AlertTriangle className="w-4 h-4 text-[#E5B84A] flex-shrink-0" />
      <span className="text-[#E5B84A]">{warning}</span>
    </div>
  );
}
