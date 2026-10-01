# Astra explorations (LunaV2.0)

Week-1 brainstorm site for **Astra’s Writing Adventure** design directions — for Kennady review, **not** the final product.

Three clickable concepts share the same section structure:

| Tab | Working title | Vibe |
| --- | --- | --- |
| **A** | Soft world | Enchanted twilight woodland; writing opens gates; characters lead |
| **B** | Clear studio | Calm writing tool first; world as light frame |
| **C** | Journal-as-map | No quests; mentor-as-editor; path is the Writer’s Journal |

Shared lesson skill on every tab: **Evidence or Examples** (grades 4–5 Short Responses), with gray-box steps Warm-up → Learn → Notice → Try → Build → Apply → Reflect.

## Live URL

**https://emily-clear-k12.github.io/LunaV2.0/**

> Private repo Pages: only people with repo access can view the site when logged into GitHub. After the first push, if Pages is not live yet, open **Settings → Pages**, set **Source** to **GitHub Actions**, and re-run the **Deploy to GitHub Pages** workflow if needed.

## Local development

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173/LunaV2.0/`).

```bash
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## How Pages is set up

- Vite `base` is `/LunaV2.0/` (GitHub Pages project site).
- Workflow: [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)
  - On push to `main` (and manual `workflow_dispatch`): `npm ci` → `npm run build` → upload `dist` → deploy with `actions/deploy-pages`.
- One-time (if not already done): **Repo Settings → Pages → Build and deployment → Source: GitHub Actions**.

## How to edit concepts

Placeholder copy lives in one file:

```text
src/data/concepts.ts
```

Edit hook, world, lesson beats, video rethink, keep/add/cut, and the “why this one” placeholder text. The notes textarea on each tab saves to `localStorage` in the browser only (not committed).

UI shell: `src/App.tsx` · styles: `src/index.css`.

## Stack

Vite + React + TypeScript · Manrope via Google Fonts · mobile-friendly layout.
