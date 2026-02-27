"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { WalkthroughSection as WalkthroughSectionT } from "@/lib/types";
import { escapeHTML, fmt } from "@/lib/utils";
import ArrayVis from "@/components/ArrayVis";

export default function WalkthroughSection({ section }: { section: WalkthroughSectionT }) {
  const steps = section.steps || [];
  const [cur, setCur] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playing, setPlaying] = useState(false);

  const stopAuto = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setPlaying(false);
  }, []);

  useEffect(() => {
    return () => stopAuto();
  }, [stopAuto]);

  if (!steps.length) return null;
  const step = steps[cur];

  function prev() { stopAuto(); setCur((c) => Math.max(0, c - 1)); }
  function next() { stopAuto(); setCur((c) => Math.min(steps.length - 1, c + 1)); }
  function reset() { stopAuto(); setCur(0); }
  function toggleAuto() {
    if (playing) { stopAuto(); return; }
    setPlaying(true);
    timerRef.current = setInterval(() => {
      setCur((c) => {
        if (c >= steps.length - 1) { stopAuto(); return c; }
        return c + 1;
      });
    }, 1200);
  }

  return (
    <div className="card">
      <h3>🔄 {escapeHTML(section.title || "Step-by-Step Walkthrough")}</h3>
      {section.description && (
        <p style={{ marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: fmt(section.description) }} />
      )}

      <div className="step-counter">
        Step {cur + 1} / {steps.length}
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${((cur + 1) / steps.length) * 100}%` }} />
      </div>

      {step.array && <ArrayVis array={step.array} highlights={step.highlights} showIndices />}

      {step.variables && Object.keys(step.variables).length > 0 && (
        <div className="step-display">
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            {Object.entries(step.variables).map(([k, v]) => (
              <div key={k}>
                <span className="label">{escapeHTML(k)}</span>
                <br />
                <span className="val">{escapeHTML(String(v))}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="explanation-box" dangerouslySetInnerHTML={{ __html: fmt(step.description) }} />
      {step.note && (
        <div style={{ marginTop: 6, fontSize: "0.8rem", color: "var(--accent3)" }}>
          💡 <span dangerouslySetInnerHTML={{ __html: fmt(step.note) }} />
        </div>
      )}

      <div className="step-controls" style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
        <button className="btn btn-secondary btn-sm" onClick={prev} disabled={cur <= 0}>
          ← Prev
        </button>
        <button className="btn btn-primary btn-sm" onClick={next} disabled={cur >= steps.length - 1}>
          Next →
        </button>
        <button className="btn btn-secondary btn-sm" onClick={toggleAuto}>
          {playing ? "⏸ Pause" : "▶ Auto"}
        </button>
        <button className="btn btn-secondary btn-sm" onClick={reset}>
          ↺
        </button>
      </div>
    </div>
  );
}
