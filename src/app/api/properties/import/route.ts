/**
 * Properties Excel Import API
 * POST /api/properties/import
 */

import { supabaseAdmin } from "@/lib/supabase";
import { getServerUser } from "@/lib/supabase-server";
import { invalidatePropertiesCache } from "@/lib/properties-cache";
import { OfficeService } from "@/services/office.service";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

const MAX_ROWS = 500;

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

type HeaderAr = (typeof HEADERS_AR)[number];

type PropertyType = "apartment" | "villa" | "land" | "commercial";
const isValidType = (t: string): t is PropertyType =>
  t === "apartment" || t === "villa" || t === "land" || t === "commercial";

function asString(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function asNumber(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function isRowEmpty(row: Record<string, unknown>): boolean {
  return HEADERS_AR.every((h) => {
    const val = row[h];
    if (val === null || val === undefined) return true;
    if (typeof val === "string") return val.trim() === "";
    return false;
  });
}

export async function POST(request: NextRequest) {
  try {
    // 1) تحقق المستخدم
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // 2) جيب office_id للمستخدم
    const office = await OfficeService.getOfficeByUserId(user.id);
    if (!office) {
      return NextResponse.json(
        { error: "لم يتم العثور على مكتب مرتبط بالحساب" },
        { status: 404 },
      );
    }

    // tenant_id (للتوافق مع RLS/الهيكلة الحالية)
    const { data: userRow } = await supabaseAdmin
      .from("users")
      .select("tenant_id")
      .eq("id", user.id)
      .single();
    const tenantId =
      (userRow?.tenant_id as string | null) ||
      office.legacyTenantId ||
      "default";

    // 3) اقرأ الملف كـ FormData
    const form = await request.formData();
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "الملف مطلوب (file)" },
        { status: 400 },
      );
    }

    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const sheetName = wb.SheetNames[0];
    if (!sheetName) {
      return NextResponse.json(
        { error: "ملف Excel لا يحتوي على أي Sheet" },
        { status: 400 },
      );
    }
    const ws = wb.Sheets[sheetName];

    // 4) اقرأ البيانات مع إلزام أسماء الأعمدة
    const rows = XLSX.utils.sheet_to_json<Record<HeaderAr, unknown>>(ws, {
      defval: "",
      raw: true,
    });

    // تحقق الحد الأقصى قبل المعالجة (بعد تجاهل الفارغ سيتم تقليلها)
    if (rows.length > MAX_ROWS) {
      return NextResponse.json(
        { error: `الحد الأقصى للاستيراد هو ${MAX_ROWS} صف لكل ملف` },
        { status: 400 },
      );
    }

    const errors: string[] = [];
    const toInsert: Array<Record<string, unknown>> = [];
    let skipped = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i] as Record<string, unknown>;
      const rowNum = i + 2; // +2 لأن الصف 1 رؤوس

      if (isRowEmpty(row)) {
        skipped++;
        continue;
      }

      const title = asString(row["اسم العقار"]);
      const type = asString(row["النوع"]);
      const price = asNumber(row["السعر"]);

      if (!title || !type || price === null) {
        errors.push(`صف ${rowNum}: الحقول الإلزامية ناقصة (اسم العقار/النوع/السعر)`);
        skipped++;
        continue;
      }

      if (!isValidType(type)) {
        errors.push(
          `صف ${rowNum}: نوع غير صحيح (${type}) — استخدم: apartment | villa | land | commercial`,
        );
        skipped++;
        continue;
      }

      const city = asString(row["المدينة"]);
      const district = asString(row["الحي"]);
      const area = asNumber(row["المساحة"]);
      const bedrooms = asNumber(row["الغرف"]);
      const bathrooms = asNumber(row["الحمامات"]);
      const floor = asString(row["الدور"]);
      const extraDesc = asString(row["وصف إضافي"]);

      const descriptionParts: string[] = [];
      if (floor) descriptionParts.push(`الدور: ${floor}`);
      if (extraDesc) descriptionParts.push(extraDesc);

      const description = descriptionParts.join("\n").trim();

      toInsert.push({
        office_id: office.id,
        tenant_id: tenantId,
        title,
        type,
        price,
        city: city || null,
        district: district || null,
        location: city || district || "—",
        area: area ?? null,
        bedrooms: bedrooms ?? null,
        bathrooms: bathrooms ?? null,
        description: description || "",
        images: [],
        status: "available",
        featured: false,
        views_count: 0,
        user_id: user.id, // للتوافق مع الحقل القديم إن كان موجوداً
      });
    }

    if (toInsert.length === 0) {
      return NextResponse.json({
        imported: 0,
        skipped,
        errors,
      });
    }

    // 6) Insert batch واحد
    const { error: insertError } = await supabaseAdmin
      .from("properties")
      .insert(toInsert);

    if (insertError) {
      console.error("Import insert error:", insertError);
      return NextResponse.json(
        {
          error: "فشل في استيراد العقارات",
          details: insertError.message,
          imported: 0,
          skipped,
          errors,
        },
        { status: 500 },
      );
    }

    invalidatePropertiesCache(office.id);

    return NextResponse.json({
      imported: toInsert.length,
      skipped,
      errors,
    });
  } catch (error) {
    console.error("POST /api/properties/import failed:", error);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

