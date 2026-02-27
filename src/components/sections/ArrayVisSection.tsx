"use client";

import { ArrayVisSection as ArrayVisSectionT } from "@/lib/types";
import { escapeHTML, fmt, colorToVar } from "@/lib/utils";
import ArrayVis from "@/components/ArrayVis";

export default function ArrayVisSection({ section }: { section: ArrayVisSectionT }) {
  return (
    <div className="card">
      {section.title && <h3>{escapeHTML(section.title)}</h3>}
      {section.description && (
        <p style={{ marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: fmt(section.description) }} />
      )}
      <ArrayVis
        array={section.array || []}
        highlights={section.highlights}
        showIndices={section.showIndices !== false}
      />
      {section.highlights && section.highlights.length > 0 && (
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
          {section.highlights.map((hl, i) => (
            <span key={i} style={{ fontSize: "0.76rem", color: "var(--text-dim)" }}>
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  border: `2px solid var(--${colorToVar(hl.color)})`,
                  verticalAlign: "middle",
                  marginRight: 3,
                }}
              />
              {escapeHTML(hl.label || "")}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
