"use client";

import { useAuth } from "@/hooks/useAuth";
import type { AIListing, ExportFormat } from "@/types/ai-listing";
import { motion } from "framer-motion";
import {
    Building2,
    ChevronRight,
    ClipboardCopy,
    Download,
    FileText,
    Globe,
    Instagram,
    Loader2,
    Sparkles,
    Twitter,
    X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface ListingWithProperty extends AIListing {
  property?: {
    title: string;
    city: string;
    price: number;
    type: string;
    images?: string[];
  };
}

const exportFormats: {
  id: ExportFormat;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "whatsapp", label: "واتساب", icon: FileText },
  { id: "twitter", label: "تويتر", icon: Twitter },
  { id: "instagram", label: "إنستغرام", icon: Instagram },
  { id: "portal", label: "بوابات العقار", icon: Globe },
  { id: "seo", label: "نسخة SEO", icon: FileText },
];

export default function AIListingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [listings, setListings] = useState<ListingWithProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedListing, setSelectedListing] =
    useState<ListingWithProperty | null>(null);
  const [exportContent, setExportContent] = useState("");
  const [exportFormat, setExportFormat] = useState<ExportFormat | null>(null);
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check for auto-generate from property page
  const autoGeneratePropertyId = searchParams.get("generate");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      // Get office listings
      const res = await fetch("/api/ai-listings?officeId=default");
      const data = await res.json();
      if (data.success && data.listings) {
        setListings(data.listings);
      }
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Auto-generate if coming from properties page
  useEffect(() => {
    if (autoGeneratePropertyId && !generating) {
      handleGenerate(autoGeneratePropertyId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoGeneratePropertyId]);

  const handleGenerate = async (propertyId: string) => {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai-listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", propertyId }),
      });
      const data = await res.json();
      if (data.success && data.listing) {
        setSelectedListing(data.listing);
        // Refresh the list
        fetchListings();
      } else {
        alert(data.error || "فشل في إنشاء الإعلان");
      }
    } catch (error) {
      console.error("Generate failed:", error);
      alert("حدث خطأ أثناء إنشاء الإعلان");
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = async (propertyId: string, format: ExportFormat) => {
    setExporting(true);
    setExportFormat(format);
    try {
      const res = await fetch("/api/ai-listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "export", propertyId, format }),
      });
      const data = await res.json();
      if (data.success) {
        setExportContent(data.content);
      } else {
        alert(data.error || "فشل في تصدير الإعلان");
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-1 text-text-secondary hover:text-primary transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
                <span className="text-sm">لوحة التحكم</span>
              </Link>
              <span className="text-border">/</span>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h1 className="text-lg font-bold text-text-primary">
                  الإعلانات الذكية
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Info banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-l from-amber-500/10 to-primary/10 rounded-xl p-6 border border-amber-500/20 mb-8"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-text-primary mb-1">
                مُولّد الإعلانات بالذكاء الاصطناعي
              </h2>
              <p className="text-text-secondary text-sm">
                حوّل بيانات عقاراتك إلى إعلانات تسويقية احترافية جاهزة للنشر على
                واتساب وتويتر وإنستغرام وبوابات العقار. يقوم الذكاء الاصطناعي
                بتحليل الصور واستخراج المميزات تلقائياً.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : listings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-background rounded-xl border border-border"
          >
            <FileText className="w-16 h-16 mx-auto text-text-muted mb-4" />
            <p className="text-text-secondary text-lg mb-2">
              لا توجد إعلانات بعد
            </p>
            <p className="text-text-muted text-sm mb-4">
              اذهب لصفحة العقارات واضغط &quot;إنشاء إعلان ذكي&quot; لأي عقار
            </p>
            <Link
              href="/dashboard/properties"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Building2 className="w-4 h-4" />
              الذهاب للعقارات
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-background rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => {
                  setSelectedListing(listing);
                  setExportContent("");
                  setExportFormat(null);
                }}
              >
                <div className="p-5">
                  <div className="flex items-start gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                    <h3 className="font-bold text-text-primary line-clamp-2">
                      {listing.title}
                    </h3>
                  </div>
                  <p className="text-text-secondary text-sm line-clamp-3 mb-4">
                    {listing.marketingDescription}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {listing.bulletFeatures.slice(0, 3).map((f, i) => (
                      <span
                        key={i}
                        className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                      >
                        {f}
                      </span>
                    ))}
                    {listing.bulletFeatures.length > 3 && (
                      <span className="text-xs text-text-muted">
                        +{listing.bulletFeatures.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>
                      {new Date(listing.createdAt).toLocaleDateString("ar-SA")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      تصدير
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Listing Detail/Export Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-border"
          >
            {/* Modal header */}
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-background z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-text-primary">
                  معاينة الإعلان
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedListing(null);
                  setExportContent("");
                  setExportFormat(null);
                }}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  العنوان التسويقي
                </label>
                <p className="text-lg font-bold text-text-primary">
                  {selectedListing.title}
                </p>
              </div>

              {/* Marketing description */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  الوصف التسويقي
                </label>
                <p className="text-text-secondary leading-relaxed">
                  {selectedListing.marketingDescription}
                </p>
              </div>

              {/* Bullet features */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-2">
                  نقاط المميزات
                </label>
                <ul className="space-y-1.5">
                  {selectedListing.bulletFeatures.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-text-secondary"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Target audience + SEO */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-2">
                    الجمهور المستهدف
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedListing.targetAudience.map((t, i) => (
                      <span
                        key={i}
                        className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full border border-green-500/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-2">
                    كلمات SEO
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedListing.seoKeywords.map((k, i) => (
                      <span
                        key={i}
                        className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full border border-blue-500/20"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Short ad copy */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  النسخة الإعلانية القصيرة
                </label>
                <div className="bg-surface rounded-lg p-3 border border-border">
                  <p className="text-sm text-text-primary">
                    {selectedListing.adCopyShort}
                  </p>
                </div>
              </div>

              {/* Image analysis results */}
              {selectedListing.imageAnalysis?.analyzed && (
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-2">
                    نتائج تحليل الصور
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedListing.imageAnalysis.hasModernKitchen && (
                      <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-1 rounded-full">
                        🍳 مطبخ حديث
                      </span>
                    )}
                    {selectedListing.imageAnalysis.hasBalcony && (
                      <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-1 rounded-full">
                        🏠 شرفة
                      </span>
                    )}
                    {selectedListing.imageAnalysis.hasView && (
                      <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-1 rounded-full">
                        🌅 إطلالة
                      </span>
                    )}
                    {selectedListing.imageAnalysis.hasParking && (
                      <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-1 rounded-full">
                        🚗 موقف سيارات
                      </span>
                    )}
                    {selectedListing.imageAnalysis.finishLevel && (
                      <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-1 rounded-full">
                        ✨ تشطيب{" "}
                        {selectedListing.imageAnalysis.finishLevel === "luxury"
                          ? "فاخر"
                          : selectedListing.imageAnalysis.finishLevel ===
                              "premium"
                            ? "ممتاز"
                            : selectedListing.imageAnalysis.finishLevel ===
                                "standard"
                              ? "جيد"
                              : "أساسي"}
                      </span>
                    )}
                    {selectedListing.imageAnalysis.detectedFeatures?.map(
                      (f, i) => (
                        <span
                          key={i}
                          className="text-xs bg-amber-500/10 text-amber-400 px-2 py-1 rounded-full"
                        >
                          📷 {f}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Export section */}
              <div className="border-t border-border pt-6">
                <label className="block text-sm font-medium text-text-primary mb-3">
                  تصدير الإعلان
                </label>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {exportFormats.map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() =>
                        handleExport(selectedListing.propertyId, fmt.id)
                      }
                      disabled={exporting}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all text-sm ${
                        exportFormat === fmt.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-text-secondary hover:border-primary/30 hover:bg-surface"
                      }`}
                    >
                      {exporting && exportFormat === fmt.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <fmt.icon className="w-5 h-5" />
                      )}
                      <span className="text-xs">{fmt.label}</span>
                    </button>
                  ))}
                </div>

                {/* Exported content */}
                {exportContent && (
                  <div className="relative">
                    <pre
                      className="bg-surface rounded-lg p-4 border border-border text-sm text-text-secondary whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto"
                      dir="rtl"
                    >
                      {exportContent}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(exportContent)}
                      className="absolute top-2 left-2 p-2 bg-background border border-border rounded-lg hover:bg-primary/10 transition-colors"
                      title="نسخ"
                    >
                      <ClipboardCopy className="w-4 h-4 text-text-secondary" />
                    </button>
                    {copied && (
                      <span className="absolute top-2 left-12 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
                        تم النسخ!
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Generating overlay */}
      {generating && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-xl p-8 border border-border text-center"
          >
            <Loader2 className="w-10 h-10 animate-spin text-amber-400 mx-auto mb-4" />
            <p className="text-text-primary font-bold mb-1">
              جاري إنشاء الإعلان...
            </p>
            <p className="text-text-secondary text-sm">
              الذكاء الاصطناعي يحلل العقار والصور
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
