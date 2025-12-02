# C# Learning Game

Lightweight React + Vite app for learning C# concepts through short quizzes.

Features
- Interactive quiz with difficulty levels: **Beginner**, **Intermediate**, **Advanced**
- Animated UI using Framer Motion and styled with Tailwind CSS
- Glossary of C# terms with search, add, per-term examples, and optional links to docs
- Export / import glossary as JSON
- Glossary persisted in `localStorage` (key: `csharp_glossary`)

Getting started

Requirements
- Node.js (16+ recommended)
- npm

Run locally
```powershell
cd 'C:\Users\Jamesila\Downloads\csharp_vite_github'
npm install
npm run dev
```

Open the app
- The Vite dev server usually serves at `http://localhost:5173` or the next free port (e.g. `5174`).

Debugging in VS Code
- A VS Code launch configuration is included to start the dev server and attach Firefox.
- Use the Run & Debug pane and select **Launch Firefox against Vite** (or **Attach Firefox** if you started the server manually).

Glossary (how to use)
- Open the Glossary from the start screen (`View Glossary of C# Terms`) or from the in-game header (`Glossary`).
- Search: type in the search box to filter terms and definitions.
- Add term: use the **Add Term** form to add a term, definition, and optional documentation link.
- Examples: add one-line examples for each term using the **Add** control under a term.
- Export: click **Export** to download the glossary as `glossary.json`.
- Import: click **Import** and select a previously exported JSON to merge terms (duplicates are merged by term name).
- Persistence: glossary changes persist in your browser using `localStorage`; clearing the browser storage will reset it.

Notes & next steps
- Terms are stored per browser (localStorage). If you'd like server-side persistence, I can add a small API and sync.
- I can add a `Reset glossary` button to clear saved data, or CSV export/import if you prefer.

Contributing
- Create a branch, add features or tests, and open a PR against `main`.

License
- This repo contains example/training code. Add your preferred license if you plan to publish.
# C# Learning Game (React + Vite)
GitHub-ready project. Insert full component code from canvas.