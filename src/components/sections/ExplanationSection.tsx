"use client";

import { ExplanationSection as ExplanationSectionT } from "@/lib/types";
import { escapeHTML, fmt } from "@/lib/utils";

export default function ExplanationSection({ section }: { section: ExplanationSectionT }) {
  return (
    <div className="card">
      <h3>{escapeHTML(section.title || "📖 Explanation")}</h3>
      {(section.paragraphs || []).map((p, i) => (
        <p key={i} style={{ marginTop: 8 }} dangerouslySetInnerHTML={{ __html: fmt(p) }} />
      ))}
      {section.keyInsight && (
        <div className="explanation-box" style={{ marginTop: 12 }}>
          💡 <strong>Key Insight:</strong>{" "}
          <span dangerouslySetInnerHTML={{ __html: fmt(section.keyInsight) }} />
        </div>
      )}
    </div>
  );
}
