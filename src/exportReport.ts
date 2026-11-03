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

export function downloadText(filename: string, content: string): void {
  if (typeof document === "undefined") return;
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
