# 🎮 Algo Buddy

**Gamified, visual, step-by-step explanations for LeetCode problems — powered by AI.**

Paste any LeetCode problem and Algo Buddy generates an interactive, multi-level quest that walks you through the solution with array visualizations, quizzes, code walkthroughs, and more.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Azure OpenAI](https://img.shields.io/badge/Azure%20OpenAI-GPT-orange?logo=microsoft-azure)

---

## ✨ Features

- **AI-Powered Explanations** — Generates structured, multi-level breakdowns using Azure OpenAI
- **Gamified Learning** — XP system, level progression, and confetti celebrations 🎉
- **Interactive Visualizations** — Array highlighting, step-by-step walkthroughs with auto-play
- **Quizzes** — Test your understanding at each level with instant feedback
- **Code Reveal** — Annotated solution code with a reveal toggle
- **Set Visualizations** — Visual groupings for problems involving sets, maps, or partitions
- **Interactive Challenges** — Select cells in arrays to test your problem-solving
- **Sample Problems** — Try built-in samples (Two Sum, Sliding Window Maximum, Merge Intervals) or paste your own

---

## 🛠️ Tech Stack

| Layer      | Technology                     |
| ---------- | ------------------------------ |
| Framework  | Next.js 16 (App Router)        |
| Language   | TypeScript                     |
| Styling    | Tailwind CSS 4                 |
| AI Backend | Azure OpenAI (server-side API) |
| Runtime    | React 19                       |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/generate/route.ts   # Server-side Azure OpenAI endpoint
│   ├── globals.css             # All custom styles
│   ├── layout.tsx              # Root layout & metadata
│   └── page.tsx                # Main app (landing, quest view, game state)
├── components/
│   ├── sections/
│   │   ├── ArrayVisSection.tsx     # Array visualization with highlights
│   │   ├── CodeSection.tsx         # Code reveal toggle
│   │   ├── ExplanationSection.tsx  # Text explanations with key insights
│   │   ├── InteractiveSection.tsx  # Cell-selection challenges
│   │   ├── QuizSection.tsx         # Multiple-choice quizzes
│   │   ├── SetsVisSection.tsx      # Set/group visualizations
│   │   └── WalkthroughSection.tsx  # Step-by-step walkthrough with auto-play
│   ├── ArrayVis.tsx            # Reusable array visualization component
│   ├── Confetti.tsx            # Confetti animation hook
│   └── SectionRenderer.tsx     # Section type dispatcher
└── lib/
    ├── prompt.ts               # LLM prompt builder
    ├── samples.ts              # Sample problem texts
    ├── types.ts                # TypeScript type definitions
    └── utils.ts                # Utility functions
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Azure OpenAI** resource with a deployed model

### 1. Clone the repo

```bash
git clone https://github.com/anushkadeshpande/dsa-questions-visualizer.git
cd dsa-questions-visualizer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example env file and fill in your Azure OpenAI credentials:

```bash
cp .env.example .env
```

```env
AZURE_INFERENCE_ENDPOINT=https://your-resource.cognitiveservices.azure.com/openai
AZURE_INFERENCE_CREDENTIAL=your-api-key-here
LLM_MODEL=gpt-4o
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start solving problems!

---

## 🎯 How It Works

1. **Paste** any LeetCode problem description (or pick a sample)
2. **Generate** — the AI analyzes the problem and builds a multi-level quest
3. **Play** through levels: read explanations, explore visualizations, answer quizzes
4. **Earn XP** for correct answers and completing levels
5. **Finish** the quest and celebrate with confetti! 🎉

---

## 📦 Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start development server   |
| `npm run build` | Create production build    |
| `npm run start` | Start production server    |
| `npm run lint`  | Run ESLint                 |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
