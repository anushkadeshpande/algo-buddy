"use client";

import { useState, useCallback } from "react";
import { QuestData } from "@/lib/types";
import { escapeHTML } from "@/lib/utils";
import { SAMPLE_TWO_SUM, SAMPLE_SLIDING_WINDOW, SAMPLE_MERGE } from "@/lib/samples";
import SectionRenderer from "@/components/SectionRenderer";
import { useConfetti } from "@/components/Confetti";

export default function Home() {
  // ── Game state ──
  const [xp, setXp] = useState(0);
  const [maxXP, setMaxXP] = useState(100);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelsCompleted, setLevelsCompleted] = useState<Set<number>>(new Set());
  const [levelsUnlocked, setLevelsUnlocked] = useState<Set<number>>(new Set([1]));
  const [questData, setQuestData] = useState<QuestData | null>(null);

  // ── UI state ──
  const [problemText, setProblemText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { shoot: shootConfetti, ConfettiCanvas } = useConfetti();

  // ── XP ──
  const addXP = useCallback(
    (n: number) => {
      setXp((prev) => Math.min(prev + n, maxXP));
    },
    [maxXP]
  );

  // ── Level completion ──
  const completeLevel = useCallback(
    (lvl: number) => {
      setLevelsCompleted((prev) => {
        if (prev.has(lvl)) return prev;
        const next = new Set(prev);
        next.add(lvl);
        const total = questData?.levels.length ?? 1;
        if (next.size === total) shootConfetti();
        return next;
      });
      setLevelsUnlocked((prev) => {
        const total = questData?.levels.length ?? 1;
        if (lvl < total) {
          const next = new Set(prev);
          next.add(lvl + 1);
          return next;
        }
        return prev;
      });
    },
    [questData, shootConfetti]
  );

  // ── Reset to landing ──
  function showLanding() {
    setQuestData(null);
    setXp(0);
    setMaxXP(100);
    setCurrentLevel(1);
    setLevelsCompleted(new Set());
    setLevelsUnlocked(new Set([1]));
    setError("");
  }

  // ── Generate ──
  async function handleGenerate() {
    setError("");
    const problem = problemText.trim();
    if (!problem) {
      setError("Please paste a LeetCode problem.");
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || `Server returned ${resp.status}`);
      startQuest(data as QuestData);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to generate. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function startQuest(data: QuestData) {
    let totalXP = 0;
    data.levels.forEach((l) =>
      l.sections.forEach((s) => {
        if ("xp" in s && typeof s.xp === "number") totalXP += s.xp;
        else if (s.type === "quiz") totalXP += 50;
        else if (s.type === "interactive") totalXP += 75;
      })
    );
    totalXP += data.levels.length * 25;

    setQuestData(data);
    setXp(0);
    setMaxXP(totalXP || 300);
    setCurrentLevel(1);
    setLevelsCompleted(new Set());
    setLevelsUnlocked(new Set([1]));
  }

  function handleLevelComplete(lvl: number) {
    addXP(25);
    completeLevel(lvl);
    const total = questData?.levels.length ?? 1;
    if (lvl < total) {
      setCurrentLevel(lvl + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      shootConfetti();
    }
  }

  // ── Render ──
  const xpPct = maxXP > 0 ? (xp / maxXP) * 100 : 0;
  const showQuest = questData !== null;

  return (
    <>
      <ConfettiCanvas />

      {/* ═══ TOP BAR ═══ */}
      <div className="topbar">
        <h1>🎮 Algo Buddy</h1>
        <div className="right">
          {showQuest && (
            <>
              <div className="xp-bar">
                <span className="xp-label">
                  {xp} / {maxXP} XP
                </span>
                <div className="xp-track">
                  <div className="xp-fill" style={{ width: `${xpPct}%` }} />
                </div>
              </div>
              <button className="back-btn" onClick={showLanding}>
                ← New Problem
              </button>
            </>
          )}
        </div>
      </div>

      {/* ═══ LANDING ═══ */}
      {!showQuest && (
        <div className="landing fade-in">
          <h2>
            🧩 <span>Algo Buddy</span>
          </h2>
          <p className="tagline">
            Paste any LeetCode problem → Get a gamified, visual, step-by-step explanation
          </p>

          <div className="input-group">
            <label>📝 LeetCode Problem</label>
            <textarea
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
              placeholder="Paste the full problem description here, including examples and constraints..."
            />
          </div>

          <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" /> Generating...
              </>
            ) : (
              "✨ Generate Visual Explanation"
            )}
          </button>

          {error && <div className="error-msg">{error}</div>}

          <div style={{ marginTop: 40, textAlign: "left" }}>
            <p style={{ color: "var(--text-dim)", fontSize: "0.88rem", marginBottom: 10 }}>
              Or try a sample problem:
            </p>
            <div className="samples-grid">
              <div className="sample-card" onClick={() => setProblemText(SAMPLE_TWO_SUM)}>
                <h4>#1. Two Sum</h4>
                <p>Find two numbers that add to target</p>
                <span className="tag tag-easy">Easy</span>
              </div>
              <div className="sample-card" onClick={() => setProblemText(SAMPLE_SLIDING_WINDOW)}>
                <h4>#239. Sliding Window Maximum</h4>
                <p>Maximum in each sliding window</p>
                <span className="tag tag-hard">Hard</span>
              </div>
              <div className="sample-card" onClick={() => setProblemText(SAMPLE_MERGE)}>
                <h4>#56. Merge Intervals</h4>
                <p>Merge overlapping intervals</p>
                <span className="tag tag-medium">Medium</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ LOADING OVERLAY ═══ */}
      {loading && (
        <div className="loading-overlay">
          <div className="big-spinner" />
          <p>Analyzing problem &amp; building levels...</p>
          <p className="substep">This may take 15-30 seconds...</p>
        </div>
      )}

      {/* ═══ QUEST VIEW ═══ */}
      {showQuest && (
        <>
          {/* Level Nav */}
          <div className="level-nav">
            {questData.levels.map((_, i) => {
              const n = i + 1;
              let cls = "level-btn";
              if (levelsCompleted.has(n)) cls += " completed";
              else if (n === currentLevel) cls += " active";
              else if (levelsUnlocked.has(n)) cls += " unlocked";
              return (
                <button
                  key={n}
                  className={cls}
                  onClick={() => {
                    if (levelsUnlocked.has(n)) {
                      setCurrentLevel(n);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                >
                  {n}
                </button>
              );
            })}
          </div>

          {/* Level Content */}
          <div className="main">
            <LevelContent
              questData={questData}
              currentLevel={currentLevel}
              addXP={addXP}
              onComplete={handleLevelComplete}
              levelsCompleted={levelsCompleted}
              xp={xp}
              showLanding={showLanding}
            />
          </div>
        </>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
//  Level content sub-component
// ═══════════════════════════════════════════════════════════════
function LevelContent({
  questData,
  currentLevel,
  addXP,
  onComplete,
  levelsCompleted,
  xp,
  showLanding,
}: {
  questData: QuestData;
  currentLevel: number;
  addXP: (n: number) => void;
  onComplete: (lvl: number) => void;
  levelsCompleted: Set<number>;
  xp: number;
  showLanding: () => void;
}) {
  const level = questData.levels[currentLevel - 1];
  if (!level) return null;
  const total = questData.levels.length;
  const allDone = levelsCompleted.size === total;

  return (
    <div className="fade-in" key={currentLevel}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div
          style={{
            display: "inline-block",
            fontSize: "0.72rem",
            fontWeight: 700,
            padding: "3px 12px",
            borderRadius: 20,
            background: "var(--accent2)",
            color: "white",
            marginBottom: 6,
          }}
        >
          LEVEL {currentLevel} of {total}
          {questData.pattern ? ` — ${escapeHTML(questData.pattern)}` : ""}
        </div>
        <h2 style={{ fontSize: "1.45rem", marginBottom: 4 }}>{escapeHTML(level.title)}</h2>
        <p style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>
          {escapeHTML(level.subtitle || "")}
        </p>
      </div>

      {/* Sections */}
      {level.sections.map((sec, si) => (
        <div key={si} className="fade-in" style={{ animationDelay: `${si * 0.08}s` }}>
          <SectionRenderer section={sec} onXP={addXP} />
        </div>
      ))}

      {/* Complete / Finish button */}
      {!allDone && (
        <div className="btn-row" style={{ marginTop: 24 }}>
          <button className="btn btn-success" onClick={() => onComplete(currentLevel)}>
            {currentLevel < total ? "Complete Level & Continue →" : "🏆 Finish Quest!"}
          </button>
        </div>
      )}

      {/* Quest complete card */}
      {allDone && (
        <div
          className="card fade-in"
          style={{ textAlign: "center", borderColor: "var(--green)", marginTop: 20 }}
        >
          <h3 style={{ color: "var(--green)", fontSize: "1.4rem" }}>🏆 Quest Complete!</h3>
          <p style={{ marginTop: 8 }}>
            You&apos;ve mastered <strong>{escapeHTML(questData.title)}</strong>!
          </p>
          <p style={{ marginTop: 4 }}>
            Total XP: <strong style={{ color: "var(--yellow)" }}>{xp}</strong>
          </p>
          <div className="btn-row" style={{ marginTop: 16 }}>
            <button className="btn btn-primary" onClick={showLanding}>
              ← Try Another Problem
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
