export type ReportKind = "pvsyst" | "sld";
export const REPORT_LABEL: Record<ReportKind, string> = { pvsyst: "تقرير PVsyst", sld: "مخطط SLD" };

/** Why a report request cannot be sent, or null if it can. */
export function sendBlocker(req: { status: string }, file: { path: string } | null | undefined): string | null {
  if (req.status !== "pending") return "تم إرسال هذا الطلب مسبقاً";
  if (!file) return "ارفع ملف التقرير لهذه المنظومة أولاً";
  return null;
}
