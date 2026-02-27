// ═══════════════════════════════════════════════════════════════
//  Quest / Section types
// ═══════════════════════════════════════════════════════════════

export type HighlightColor = "green" | "blue" | "yellow" | "red" | "purple" | "pink";

export interface Highlight {
  indices: number[];
  color: HighlightColor;
  label?: string;
}

// ── Section variants ──

export interface ExplanationSection {
  type: "explanation";
  title?: string;
  paragraphs: string[];
  keyInsight?: string;
}

export interface ArrayVisSection {
  type: "array_vis";
  title?: string;
  description?: string;
  array: (string | number)[];
  highlights?: Highlight[];
  showIndices?: boolean;
}

export interface QuizSection {
  type: "quiz";
  question: string;
  options: string[];
  correctIndex: number;
  explanationCorrect?: string;
  explanationWrong?: string;
  xp?: number;
}

export interface WalkthroughStep {
  description: string;
  array: (string | number)[];
  highlights?: Highlight[];
  variables?: Record<string, string | number>;
  note?: string;
}

export interface WalkthroughSection {
  type: "walkthrough";
  title?: string;
  description?: string;
  steps: WalkthroughStep[];
}

export interface SetItem {
  name: string;
  items: string[];
  color?: HighlightColor;
}

export interface SetsVisSection {
  type: "sets_vis";
  title?: string;
  description?: string;
  sets: SetItem[];
}

export interface CodeSection {
  type: "code";
  title?: string;
  language?: string;
  code: string;
  explanation?: string;
}

export interface InteractiveSection {
  type: "interactive";
  title?: string;
  description?: string;
  goal?: string;
  interactionType: "select_cells";
  array: (string | number)[];
  correctIndices: number[];
  successMessage?: string;
  failMessage?: string;
  xp?: number;
}

export type Section =
  | ExplanationSection
  | ArrayVisSection
  | QuizSection
  | WalkthroughSection
  | SetsVisSection
  | CodeSection
  | InteractiveSection;

export interface Level {
  title: string;
  subtitle?: string;
  sections: Section[];
}

export interface QuestData {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  pattern: string;
  levels: Level[];
}

export interface GameState {
  xp: number;
  maxXP: number;
  currentLevel: number;
  levelsCompleted: Set<number>;
  levelsUnlocked: Set<number>;
  questData: QuestData | null;
}
