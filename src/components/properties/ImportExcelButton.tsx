"use client";

import { generatePropertiesTemplate } from "@/lib/excel-template";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";

export function ImportExcelButton({
  onImported,
}: {
  onImported?: () => void | Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<
    | { type: "success" | "error"; text: string }
    | null
  >(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    window.setTimeout(() => setToast(null), 2800);
  };

  const downloadTemplate = () => {
    const { filename, blob } = generatePropertiesTemplate();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleFile = async (file: File) => {
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/properties/import", {
        method: "POST",
        body: form,
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          data?.error ||
          data?.details ||
          "تعذر استيراد الملف. تأكد من صحة القالب.";
        showToast("error", msg);
        return;
      }

      const imported = Number(data?.imported || 0);
      const skipped = Number(data?.skipped || 0);
      const errors = Array.isArray(data?.errors) ? (data.errors as string[]) : [];

      let message = `تم استيراد ${imported} عقار بنجاح`;
      if (skipped > 0) message += ` (تم تجاهل ${skipped} صف)`;
      if (errors.length > 0) message += ` — يوجد ملاحظات: ${Math.min(errors.length, 3)} خطأ`;
      showToast("success", message);

      if (onImported) await onImported();
    } catch (e) {
      console.error(e);
      showToast("error", "حدث خطأ أثناء الاستيراد. حاول مرة أخرى.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      {toast && (
        <div className="absolute -top-12 left-0 z-50">
          <div
            className={`px-3 py-2 rounded-xl border shadow-lg text-xs whitespace-nowrap ${
              toast.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-200"
                : "bg-red-500/10 border-red-500/20 text-red-200"
            }`}
          >
            {toast.text}
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />

      <Button
        variant="outline"
        onClick={downloadTemplate}
        disabled={isUploading}
      >
        <Download className="w-4 h-4" />
        تنزيل القالب
      </Button>

      <Button onClick={openPicker} disabled={isUploading}>
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            جاري الاستيراد...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            استيراد من Excel
          </>
        )}
      </Button>
    </div>
  );
}

export default ImportExcelButton;

