import { HighlightColor } from "./types";

export function escapeHTML(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Convert markdown-like bold / code to HTML */
export function fmt(s: string): string {
  let o = escapeHTML(s);
  o = o.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  o = o.replace(/`(.*?)`/g, "<code>$1</code>");
  o = o.replace(/\n/g, "<br>");
  return o;
}

const COLOR_VAR_MAP: Record<string, string> = {
  green: "green",
  blue: "accent",
  yellow: "yellow",
  red: "red",
  purple: "accent2",
  pink: "accent3",
};

export function colorToVar(c: HighlightColor | string): string {
  return COLOR_VAR_MAP[c] || "accent";
}
