"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MessageCircleQuestion, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Status = "pending" | "answered" | "ignored";

interface UnansweredQuestion {
  id: string;
  officeId: string;
  question: string;
  askedByPhone: string | null;
  timesAsked: number;
  status: Status;
  answer: string | null;
  answeredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

function formatDate(input?: string | null): string {
  if (!input) return "—";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("ar-SA", { dateStyle: "medium", timeStyle: "short" });
}

export default function UnansweredQuestionsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Status>("pending");
  const [items, setItems] = useState<UnansweredQuestion[]>([]);
  const [answerDraft, setAnswerDraft] = useState<Record<string, string>>({});
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    window.setTimeout(() => setToast(null), 2500);
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/unanswered-questions");
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "فشل في جلب البيانات");
      }
      setItems((data.questions || []) as UnansweredQuestion[]);
    } catch (e) {
      console.error(e);
      showToast("error", "تعذر جلب الأسئلة. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = useMemo(() => {
    const c = { pending: 0, answered: 0, ignored: 0 } as Record<Status, number>;
    for (const q of items) c[q.status] += 1;
    return c;
  }, [items]);

  const visible = useMemo(
    () => items.filter((q) => q.status === activeTab),
    [items, activeTab],
  );

  const saveAnswer = async (id: string) => {
    const answer = (answerDraft[id] || "").trim();
    if (!answer) {
      showToast("error", "اكتب الإجابة أولاً.");
      return;
    }

    // optimistic update
    setSavingIds((p) => ({ ...p, [id]: true }));
    setItems((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              answer,
              status: "answered",
              answeredAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : q,
      ),
    );

    try {
      const res = await fetch(`/api/unanswered-questions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "فشل في حفظ الإجابة");
      showToast("success", "تم حفظ الإجابة بنجاح.");
      setAnswerDraft((p) => {
        const next = { ...p };
        delete next[id];
        return next;
      });
    } catch (e) {
      console.error(e);
      showToast("error", "تعذر حفظ الإجابة. تم التراجع عن التغيير.");
      await fetchAll();
    } finally {
      setSavingIds((p) => ({ ...p, [id]: false }));
    }
  };

  const ignoreQuestion = async (id: string) => {
    if (!confirm("هل تريد تجاهل هذا السؤال؟")) return;

    setSavingIds((p) => ({ ...p, [id]: true }));
    // optimistic update
    setItems((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, status: "ignored", updatedAt: new Date().toISOString() }
          : q,
      ),
    );

    try {
      const res = await fetch(`/api/unanswered-questions/${id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "فشل في تجاهل السؤال");
      showToast("success", "تم تجاهل السؤال.");
    } catch (e) {
      console.error(e);
      showToast("error", "تعذر تجاهل السؤال. تم التراجع عن التغيير.");
      await fetchAll();
    } finally {
      setSavingIds((p) => ({ ...p, [id]: false }));
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface" dir="rtl">
      {toast && (
        <div className="fixed top-4 left-4 z-50">
          <div
            className={`px-4 py-3 rounded-xl border shadow-lg text-sm ${
              toast.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-200"
                : "bg-red-500/10 border-red-500/20 text-red-200"
            }`}
          >
            {toast.text}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-sm text-text-secondary hover:text-primary transition-colors"
              >
                لوحة التحكم
              </Link>
              <span className="text-border">/</span>
              <div className="flex items-center gap-2">
                <MessageCircleQuestion className="w-5 h-5 text-primary" />
                <h1 className="text-lg font-bold text-text-primary">
                  أسئلة بدون إجابة
                </h1>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {counts.pending} بانتظار
                </span>
              </div>
            </div>

            <Button variant="secondary" onClick={fetchAll} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  تحديث...
                </>
              ) : (
                "تحديث"
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {([
            ["pending", "بانتظار الإجابة"],
            ["answered", "تمت الإجابة"],
            ["ignored", "تم تجاهله"],
          ] as Array<[Status, string]>).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                activeTab === key
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-background border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              {label}
              <span className="mr-2 text-xs text-text-muted">({counts[key]})</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-16 bg-background rounded-xl border border-border">
            <MessageCircleQuestion className="w-14 h-14 mx-auto text-text-muted mb-4" />
            <p className="text-text-secondary">
              لا توجد عناصر في هذا التبويب حالياً.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visible.map((q) => (
              <Card key={q.id} className="bg-background border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <CardTitle className="text-base text-text-primary leading-relaxed">
                        {q.question}
                      </CardTitle>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-text-muted">
                        <span className="px-2 py-1 rounded-full bg-surface border border-border">
                          تكررت: {q.timesAsked} مرة
                        </span>
                        <span className="px-2 py-1 rounded-full bg-surface border border-border">
                          أول مرة: {formatDate(q.createdAt)}
                        </span>
                        {q.askedByPhone ? (
                          <span className="px-2 py-1 rounded-full bg-surface border border-border">
                            من: {q.askedByPhone}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${
                          q.status === "pending"
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-200"
                            : q.status === "answered"
                              ? "bg-green-500/10 border-green-500/20 text-green-200"
                              : "bg-gray-500/10 border-gray-500/20 text-gray-200"
                        }`}
                      >
                        {q.status === "pending"
                          ? "بانتظار"
                          : q.status === "answered"
                            ? "تمت الإجابة"
                            : "تم تجاهله"}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {q.status === "pending" ? (
                    <div className="space-y-3">
                      <textarea
                        value={answerDraft[q.id] ?? ""}
                        onChange={(e) =>
                          setAnswerDraft((p) => ({ ...p, [q.id]: e.target.value }))
                        }
                        rows={4}
                        placeholder="اكتب الإجابة التي تريد أن يستخدمها البوت لاحقاً..."
                        className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                      />

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => saveAnswer(q.id)}
                          disabled={!!savingIds[q.id]}
                        >
                          {savingIds[q.id] ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              جاري الحفظ...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              حفظ الإجابة
                            </>
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => ignoreQuestion(q.id)}
                          disabled={!!savingIds[q.id]}
                        >
                          <Trash2 className="w-4 h-4" />
                          تجاهل
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-text-secondary space-y-2">
                      <div className="rounded-lg border border-border bg-surface p-4 whitespace-pre-wrap leading-relaxed">
                        {q.answer || "—"}
                      </div>
                      <p className="text-xs text-text-muted">
                        {q.status === "answered"
                          ? `تمت الإجابة: ${formatDate(q.answeredAt)}`
                          : `آخر تحديث: ${formatDate(q.updatedAt)}`}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

