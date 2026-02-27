export function buildPrompt(problem: string): string {
  return `You are an expert DSA teacher creating a gamified, visual, step-by-step learning experience for a LeetCode problem. Break it down so the learner derives the solution themselves through progressive "aha moments."

PROBLEM:
${problem}

TASK: Return a strict JSON object with this structure:

{
  "title": "Short problem title",
  "difficulty": "Easy|Medium|Hard",
  "pattern": "Main algorithmic pattern name",
  "levels": [ /* 4-6 levels, each with sections */ ]
}

Each level:
{
  "title": "3-5 word title",
  "subtitle": "What the learner discovers here",
  "sections": [ /* array of section objects */ ]
}

SECTION TYPES — use these building blocks:

1. EXPLANATION — teach a concept:
{
  "type": "explanation",
  "title": "Heading",
  "paragraphs": ["Text paragraph 1 (supports **bold** and \`code\`)", "..."],
  "keyInsight": "One-line aha moment (optional)"
}

2. ARRAY_VIS — visualize an array/list with colored highlights:
{
  "type": "array_vis",
  "title": "Title (optional)",
  "description": "What this shows",
  "array": [1, 3, 2, 6],
  "highlights": [
    {"indices": [0, 2], "color": "green", "label": "Selected"},
    {"indices": [1], "color": "yellow", "label": "Current"}
  ],
  "showIndices": true
}
Valid colors: green, blue, yellow, red, purple, pink

3. QUIZ — multiple choice (used to gate progression):
{
  "type": "quiz",
  "question": "Question text?",
  "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "correctIndex": 1,
  "explanationCorrect": "Why correct",
  "explanationWrong": "Hint for wrong answer",
  "xp": 50
}

4. WALKTHROUGH — animated step-by-step algorithm trace (VERY IMPORTANT):
{
  "type": "walkthrough",
  "title": "Tracing Example 1",
  "description": "What we are demonstrating",
  "steps": [
    {
      "description": "What happens in this step",
      "array": [2, 7, 11, 15],
      "highlights": [{"indices": [0,1], "color": "green", "label": "Pair"}],
      "variables": {"target": 9, "sum": "2+7=9"},
      "note": "Optional insight (optional field)"
    }
  ]
}
IMPORTANT: every step MUST include "array" and "description". Include 4-8 meaningful steps.

5. SETS_VIS — show named groups of data (hash maps, sets, partitions, stacks, queues):
{
  "type": "sets_vis",
  "title": "Hash Map State",
  "description": "What this represents (optional)",
  "sets": [
    {"name": "Map", "items": ["2→0", "7→1"], "color": "green"},
    {"name": "Looking for", "items": ["7"], "color": "blue"}
  ]
}
Valid colors: green, blue, red, yellow, purple

6. CODE — final solution (use in last level):
{
  "type": "code",
  "title": "Complete Solution",
  "language": "python",
  "code": "class Solution:\\n    def solve(self, ...):\\n        ...",
  "explanation": "Brief line-by-line walkthrough"
}

7. INTERACTIVE — let user try selecting correct cells:
{
  "type": "interactive",
  "title": "Try it!",
  "description": "Select the correct elements...",
  "interactionType": "select_cells",
  "array": [2, 7, 11, 15],
  "correctIndices": [0, 1],
  "successMessage": "Correct! ...",
  "failMessage": "Not quite. ...",
  "xp": 75
}

RULES:
- Level 1: Understand the problem (explanation + array_vis + interactive or quiz).
- Level 2-3: Build intuition from brute force → key insight (explanation + walkthrough + quiz).
- Level 3-5: Show the optimal approach step by step (walkthrough with many steps + sets_vis if relevant).
- Last level: Full solution code + summary quiz.
- Include at LEAST 3 quiz sections total.
- Include at LEAST 1 walkthrough with 5+ steps using ACTUAL example data from the problem.
- Include at LEAST 1 interactive section.
- Use **bold** and \`code\` in text for emphasis.
- For the walkthrough "array" field: always include the full array, don't abbreviate.
- For intervals/2D problems, flatten or represent as needed in the array field.
- Ensure ALL JSON is valid. Use \\n for newlines in code strings.
- Return ONLY the JSON object. No other text.`;
}
