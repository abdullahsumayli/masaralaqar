/**
 * Report Service — PDF report generation with pdfkit
 * Supports: Leads report, Properties report, Monthly activity
 */

import { supabaseAdmin } from "@/lib/supabase";
import PDFDocument from "pdfkit";

export type ReportType = "leads" | "properties" | "monthly";

interface ReportOptions {
  officeId: string;
  officeName: string;
  type: ReportType;
  from?: string; // ISO date
  to?: string; // ISO date
}

/** Generate a PDF report and return as Buffer */
export async function generateReport(options: ReportOptions): Promise<Buffer> {
  const { type, officeId, officeName } = options;

  switch (type) {
    case "leads":
      return generateLeadsReport(officeId, officeName, options);
    case "properties":
      return generatePropertiesReport(officeId, officeName);
    case "monthly":
      return generateMonthlyReport(officeId, officeName, options);
    default:
      throw new Error("نوع التقرير غير مدعوم");
  }
}

// ─── Helpers ────────────────────────────────────────────────

function createDoc(): PDFKit.PDFDocument {
  return new PDFDocument({
    size: "A4",
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    info: {
      Title: "تقرير مسار العقار",
      Author: "Masar Al Aqar",
    },
  });
}

function docToBuffer(doc: PDFKit.PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.end();
  });
}

function addHeader(doc: PDFKit.PDFDocument, title: string, officeName: string) {
  doc.fontSize(22).text("Masar Al Aqar", { align: "center" }).moveDown(0.3);

  doc
    .fontSize(10)
    .fillColor("#666")
    .text(officeName, { align: "center" })
    .moveDown(0.5);

  doc
    .fontSize(16)
    .fillColor("#25D366")
    .text(title, { align: "center" })
    .moveDown(0.3);

  doc
    .fontSize(9)
    .fillColor("#999")
    .text(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      {
        align: "center",
      },
    )
    .moveDown(1);

  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke("#ddd");

  doc.moveDown(0.5);
  doc.fillColor("#333");
}

function addTableRow(
  doc: PDFKit.PDFDocument,
  cols: string[],
  widths: number[],
  isHeader = false,
) {
  const startX = 50;
  const y = doc.y;

  if (isHeader) {
    doc
      .rect(startX, y - 2, 495, 18)
      .fill("#f0f4ff")
      .fillColor("#333");
    doc.font("Helvetica-Bold").fontSize(9);
  } else {
    doc.font("Helvetica").fontSize(8);
  }

  let x = startX;
  for (let i = 0; i < cols.length; i++) {
    doc.text(cols[i], x + 4, y, { width: widths[i] - 8, align: "left" });
    x += widths[i];
  }

  doc.y = y + 18;

  if (!isHeader) {
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke("#eee");
  }
}

// ─── Report Generators ──────────────────────────────────────

async function generateLeadsReport(
  officeId: string,
  officeName: string,
  options: ReportOptions,
): Promise<Buffer> {
  let query = supabaseAdmin
    .from("leads")
    .select("name, phone, status, source, created_at")
    .eq("office_id", officeId)
    .order("created_at", { ascending: false })
    .limit(200);

  if (options.from) query = query.gte("created_at", options.from);
  if (options.to) query = query.lte("created_at", options.to);

  const { data: leads } = await query;

  const doc = createDoc();
  addHeader(doc, "Leads Report", officeName);

  // Summary
  const total = leads?.length || 0;
  doc
    .fontSize(10)
    .text(`Total Leads: ${total}`, { align: "left" })
    .moveDown(0.8);

  // Table
  const widths = [120, 100, 80, 80, 115];
  addTableRow(
    doc,
    ["Name", "Phone", "Status", "Source", "Created"],
    widths,
    true,
  );

  for (const lead of leads || []) {
    if (doc.y > 750) {
      doc.addPage();
    }
    const row = lead as Record<string, string>;
    addTableRow(
      doc,
      [
        row.name || "-",
        row.phone || "-",
        row.status || "new",
        row.source || "-",
        new Date(row.created_at).toLocaleDateString("en-US"),
      ],
      widths,
    );
  }

  return docToBuffer(doc);
}

async function generatePropertiesReport(
  officeId: string,
  officeName: string,
): Promise<Buffer> {
  const { data: properties } = await supabaseAdmin
    .from("properties")
    .select(
      "title, type, city, district, price, status, views_count, created_at",
    )
    .eq("office_id", officeId)
    .order("created_at", { ascending: false })
    .limit(200);

  const doc = createDoc();
  addHeader(doc, "Properties Report", officeName);

  const total = properties?.length || 0;
  doc
    .fontSize(10)
    .text(`Total Properties: ${total}`, { align: "left" })
    .moveDown(0.8);

  const widths = [130, 65, 65, 75, 70, 45, 45];
  addTableRow(
    doc,
    ["Title", "Type", "City", "District", "Price", "Status", "Views"],
    widths,
    true,
  );

  for (const prop of properties || []) {
    if (doc.y > 750) doc.addPage();
    const p = prop as Record<string, unknown>;
    addTableRow(
      doc,
      [
        String(p.title || "-").slice(0, 30),
        String(p.type || "-"),
        String(p.city || "-"),
        String(p.district || "-"),
        p.price ? `${Number(p.price).toLocaleString()} SAR` : "-",
        String(p.status || "-"),
        String(p.views_count || 0),
      ],
      widths,
    );
  }

  return docToBuffer(doc);
}

async function generateMonthlyReport(
  officeId: string,
  officeName: string,
  options: ReportOptions,
): Promise<Buffer> {
  const from =
    options.from ||
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const to =
    options.to ||
    new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
    ).toISOString();

  const [
    { count: propertiesCount },
    { count: leadsCount },
    { count: messagesCount },
    { count: viewingsCount },
  ] = await Promise.all([
    supabaseAdmin
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("office_id", officeId)
      .gte("created_at", from)
      .lte("created_at", to),
    supabaseAdmin
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("office_id", officeId)
      .gte("created_at", from)
      .lte("created_at", to),
    supabaseAdmin
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .eq("office_id", officeId)
      .eq("type", "ai_message")
      .gte("created_at", from)
      .lte("created_at", to),
    supabaseAdmin
      .from("viewing_requests")
      .select("*", { count: "exact", head: true })
      .eq("office_id", officeId)
      .gte("created_at", from)
      .lte("created_at", to),
  ]);

  const doc = createDoc();
  addHeader(doc, "Monthly Activity Report", officeName);

  const period = `${new Date(from).toLocaleDateString("en-US")} — ${new Date(to).toLocaleDateString("en-US")}`;
  doc.fontSize(10).text(`Period: ${period}`, { align: "left" }).moveDown(1);

  const stats = [
    { label: "New Properties", value: propertiesCount || 0 },
    { label: "New Leads", value: leadsCount || 0 },
    { label: "AI Messages", value: messagesCount || 0 },
    { label: "Viewing Requests", value: viewingsCount || 0 },
  ];

  for (const stat of stats) {
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(`${stat.value}`, { continued: true })
      .font("Helvetica")
      .fontSize(10)
      .text(`  ${stat.label}`)
      .moveDown(0.5);
  }

  return docToBuffer(doc);
}
