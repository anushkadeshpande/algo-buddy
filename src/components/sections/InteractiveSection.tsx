"use client";

import { useState, useCallback } from "react";
import { InteractiveSection as InteractiveSectionT } from "@/lib/types";
import { escapeHTML, fmt } from "@/lib/utils";
import ArrayVis from "@/components/ArrayVis";

interface InteractiveSectionProps {
  section: InteractiveSectionT;
  onXP: (xp: number) => void;
}

export default function InteractiveSection({ section, onXP }: InteractiveSectionProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [answered, setAnswered] = useState(false);

  const correctSet = new Set(section.correctIndices || []);

  const handleCellClick = useCallback(
    (idx: number) => {
      if (answered) return;
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(idx)) next.delete(idx);
        else next.add(idx);
        return next;
      });
      setFeedback(null);
    },
    [answered]
  );

  function handleReset() {
    setSelected(new Set());
    setFeedback(null);
    setAnswered(false);
  }

  function handleCheck() {
    const sa = Array.from(selected).sort((a, b) => a - b);
    const ca = Array.from(correctSet).sort((a, b) => a - b);
    const ok = sa.length === ca.length && sa.every((v, i) => v === ca[i]);

    if (ok) {
      setFeedback({
        ok: true,
        msg: `✅ ${section.successMessage || "Correct!"}`,
      });
      setAnswered(true);
      onXP(section.xp || 75);
    } else {
      setFeedback({
        ok: false,
        msg: `❌ ${section.failMessage || "Not quite. Try again!"}`,
      });
    }
  }

  const highlights = [{ indices: Array.from(selected), color: "blue" as const, label: "Selected" }];

  return (
    <div className="card">
      <h3>🎮 {escapeHTML(section.title || "Try It!")}</h3>
      {(section.description || section.goal) && (
        <p
          style={{ marginBottom: 8 }}
          dangerouslySetInnerHTML={{ __html: fmt(section.description || section.goal || "") }}
        />
      )}

      <ArrayVis
        array={section.array || []}
        highlights={highlights}
        showIndices
        clickable={!answered}
        onCellClick={handleCellClick}
      />

      {feedback && (
        <div className={`feedback ${feedback.ok ? "success" : "error"}`}>{feedback.msg}</div>
      )}

      <div className="btn-row">
        <button className="btn btn-secondary btn-sm" onClick={handleReset}>
          Reset
        </button>
        <button className="btn btn-primary btn-sm" onClick={handleCheck} disabled={answered}>
          Check ✓
        </button>
      </div>
    </div>
  );
}
