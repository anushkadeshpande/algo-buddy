"use client";

import { SetsVisSection as SetsVisSectionT } from "@/lib/types";
import { escapeHTML, fmt } from "@/lib/utils";

export default function SetsVisSection({ section }: { section: SetsVisSectionT }) {
  return (
    <div className="card">
      {section.title && <h3>{escapeHTML(section.title)}</h3>}
      {section.description && (
        <p style={{ marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: fmt(section.description) }} />
      )}
      <div className="sets-row">
        {(section.sets || []).map((set, i) => (
          <div className="set-box" key={i}>
            <h4>{escapeHTML(set.name)}</h4>
            <div className="set-items">
              {(set.items || []).map((item, j) => (
                <span key={j} className={`set-item ${set.color || "blue"}`}>
                  {escapeHTML(String(item))}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
