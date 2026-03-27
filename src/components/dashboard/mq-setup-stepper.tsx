"use client";

import { Building2, Bot, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "ربط واتساب", icon: MessageCircle },
  { id: 2, label: "إضافة عقار", icon: Building2 },
  { id: 3, label: "تشغيل MQ", icon: Bot },
] as const;

export function MQSetupStepper({
  activeStep,
  className,
}: {
  /** 1–3 */
  activeStep: number;
  className?: string;
}) {
  const progress = Math.min(100, Math.max(0, (activeStep / STEPS.length) * 100));

  return (
    <div className={cn("w-full space-y-4", className)}>
        <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-mq-green transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const done = activeStep > step.id;
          const current = activeStep === step.id;
          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center text-center gap-2 rounded-xl border px-2 py-3 sm:px-3",
                done && "border-mq-green/35 bg-mq-green/5",
                current && !done && "border-mq-green/50 bg-mq-green/10 ring-1 ring-mq-green/20",
                !done && !current && "border-white/[0.06] bg-card-hover/40",
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  done || current ? "bg-mq-green/15 text-mq-green" : "bg-slate-100 text-text-muted",
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={cn(
                  "text-[10px] sm:text-xs font-semibold leading-tight",
                  done || current ? "text-text-primary" : "text-text-muted",
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
