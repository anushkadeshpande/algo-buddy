"use client";

import { useState } from "react";
import { QuizSection as QuizSectionT } from "@/lib/types";
import { fmt } from "@/lib/utils";

interface QuizSectionProps {
  section: QuizSectionT;
  onXP: (xp: number) => void;
}

export default function QuizSection({ section, onXP }: QuizSectionProps) {
  const [chosen, setChosen] = useState<number | null>(null);

  const correct = section.correctIndex ?? 0;

  function handleClick(i: number) {
    if (chosen !== null) return; // already answered
    setChosen(i);
    if (i === correct) onXP(section.xp || 50);
  }

  return (
    <div className="card">
      <h3>❓ Quiz</h3>
      <p style={{ marginBottom: 10 }} dangerouslySetInnerHTML={{ __html: fmt(section.question) }} />
      {(section.options || []).map((opt, i) => {
        let cls = "quiz-option";
        if (chosen !== null) {
          if (i === correct) cls += " correct";
          else if (i === chosen && chosen !== correct) cls += " wrong";
        }
        return (
          <button
            key={i}
            className={cls}
            onClick={() => handleClick(i)}
            style={chosen !== null ? { pointerEvents: "none" } : undefined}
            dangerouslySetInnerHTML={{ __html: fmt(opt) }}
          />
        );
      })}
      {chosen !== null && (
        <div className={`feedback ${chosen === correct ? "success" : "error"}`}>
          {chosen === correct
            ? `✅ ${section.explanationCorrect || "Correct!"}`
            : `❌ ${section.explanationWrong || "Not quite. The correct answer is highlighted above."}`}
        </div>
      )}
    </div>
  );
}
