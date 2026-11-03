import type { ShareOk } from "./moved";

export function exportMovedMarkdown(
  left: string,
  moved: string,
  s: ShareOk
): string {
  return [
    "# Moved share (educational)",
    "",
    "> Not live Alcor. Arguments only.",
    "",
    `leftBehind: ${left}`,
    `moved: ${moved}`,
    "",
    `total: ${s.total.toString()}`,
    `moved bps: ${s.bps.toString()}`,
    `left bps: ${s.leftBps.toString()}`,
    `fullyMoved: ${s.fullyMoved}`,
    "",
  ].join("\n");
}

export function exportMovedCsv(row: {
  left: string;
  moved: string;
  total: string;
  bps: string;
  leftBps: string;
}): string {
  return [
    "left,moved,total,bps,left_bps",
    `${row.left},${row.moved},${row.total},${row.bps},${row.leftBps}`,
    "",
  ].join("\n");
}

export function downloadText(
  filename: string,
  content: string,
  mime = "text/plain;charset=utf-8"
): void {
  if (typeof document === "undefined") return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
