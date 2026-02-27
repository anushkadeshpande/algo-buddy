"use client";

import { Section } from "@/lib/types";
import ExplanationSection from "./sections/ExplanationSection";
import ArrayVisSection from "./sections/ArrayVisSection";
import QuizSection from "./sections/QuizSection";
import WalkthroughSection from "./sections/WalkthroughSection";
import SetsVisSection from "./sections/SetsVisSection";
import CodeSection from "./sections/CodeSection";
import InteractiveSection from "./sections/InteractiveSection";
import { escapeHTML } from "@/lib/utils";

interface SectionRendererProps {
  section: Section;
  onXP: (xp: number) => void;
}

export default function SectionRenderer({ section, onXP }: SectionRendererProps) {
  switch (section.type) {
    case "explanation":
      return <ExplanationSection section={section} />;
    case "array_vis":
      return <ArrayVisSection section={section} />;
    case "quiz":
      return <QuizSection section={section} onXP={onXP} />;
    case "walkthrough":
      return <WalkthroughSection section={section} />;
    case "sets_vis":
      return <SetsVisSection section={section} />;
    case "code":
      return <CodeSection section={section} />;
    case "interactive":
      return <InteractiveSection section={section} onXP={onXP} />;
    default:
      return (
        <div className="card">
          <p style={{ color: "var(--text-dim)" }}>
            Section: {escapeHTML((section as { type?: string }).type || "unknown")}
          </p>
        </div>
      );
  }
}
