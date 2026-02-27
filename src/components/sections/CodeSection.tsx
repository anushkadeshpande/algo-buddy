"use client";

import { useState } from "react";
import { CodeSection as CodeSectionT } from "@/lib/types";
import { escapeHTML, fmt } from "@/lib/utils";

export default function CodeSection({ section }: { section: CodeSectionT }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="card">
      <h3>💻 {escapeHTML(section.title || "Solution Code")}</h3>
      {section.explanation && (
        <p style={{ marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: fmt(section.explanation) }} />
      )}
      {!revealed && (
        <button className="btn btn-secondary btn-sm" onClick={() => setRevealed(true)}>
          👁 Reveal Code
        </button>
      )}
      {revealed && (
        <div className="code-block">{escapeHTML(section.code || "")}</div>
      )}
    </div>
  );
}
