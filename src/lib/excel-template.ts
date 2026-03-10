import * as XLSX from "xlsx";

/**
 * قالب استيراد العقارات (Excel)
 *
 * أسماء الأعمدة المطلوبة (لا تعدلها):
 * - اسم العقار -> title
 * - النوع -> type (apartment | villa | land | commercial)
 * - السعر -> price
 * - المساحة -> area
 * - الغرف -> bedrooms
 * - الحمامات -> bathrooms
 * - المدينة -> city
 * - الحي -> district
 * - الدور -> (يُدمج داخل الوصف)
 * - وصف إضافي -> description
 */

const HEADERS_AR = [
  "اسم العقار",
  "النوع",
  "السعر",
  "المساحة",
  "الغرف",
  "الحمامات",
  "المدينة",
  "الحي",
  "الدور",
  "وصف إضافي",
] as const;

export function generatePropertiesTemplate(): { filename: string; blob: Blob } {
  const exampleRow = [
    "شقة فاخرة بحي النرجس",
    "apartment",
    950000,
    140,
    3,
    2,
    "الرياض",
    "النرجس",
    2,
    "واجهة شمالية، قريبة من الخدمات",
  ];

  const ws = XLSX.utils.aoa_to_sheet([Array.from(HEADERS_AR), exampleRow]);

  // تعليق في الخلية الأولى: لا تعدل أسماء الأعمدة
  const a1 = ws["A1"] as XLSX.CellObject | undefined;
  if (a1) {
    (a1 as any).c = [{ a: "Masaralaqar", t: "لا تعدل أسماء الأعمدة" }];
  }

  // تحسين عرض الأعمدة
  ws["!cols"] = HEADERS_AR.map((h) => ({
    wch: Math.max(14, h.length + 2),
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "العقارات");

  const arrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([arrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  return { filename: "قالب-استيراد-العقارات.xlsx", blob };
}

