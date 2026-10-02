# Astra explorations (LunaV2.0)

Week-1 brainstorm site for **Astra’s Writing Adventure** design directions — for Kennady review, **not** the final product.

Three clickable concepts share the same section structure:

| Tab | Working title | Vibe |
| --- | --- | --- |
| **A** | Deep forest immersion | Fully in the woodland; writing opens paths/bridges/gates; characters lead; most magical |
| **B** | Forest with a clear desk | Same forest home/map; cream desk cards mid-lesson; skill names first; forest frames |
| **C** | Living forest journal | Journal pages as clearings; collect/revise changes the woods; mentor-as-editor |

**Brand lock:** every concept is the enchanted forest — differentiation is immersion density vs desk clarity vs journal-as-woods, never leaving the brand.

Shared lesson skill on every tab: **Evidence or Examples** (grades 4–5 Short Responses), with steps Warm-up → Learn → Notice → Try → Build → Apply → Reflect.

## Live URL (when Pages is on)

**https://emily-clear-k12.github.io/LunaV2.0/**

Built assets are already on the **`gh-pages`** branch (with `.nojekyll`). Vite `base` is `/LunaV2.0/`.

### One-time: enable GitHub Pages

1. Open **https://github.com/emily-clear-k12/LunaV2.0/settings/pages**
2. Under **Build and deployment → Source**, choose **Deploy from a branch**
3. Branch: **`gh-pages`** / folder: **`/`** (root) → Save

**Note:** GitHub Pages on a **private** repo requires a paid plan (Pro / Team / Enterprise). On a free personal plan, either upgrade, or temporarily set the repo to **Public** if you want the site publicly viewable. The API returned: *“Your current plan does not support GitHub Pages for this repository.”* until that is resolved.

After Pages is enabled, the URL above should serve this site. Private Pages (Pro+) are only visible to users logged in with repo access.

## Local development

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/LunaV2.0/`).

```bash
npm run build    # production build → dist/
npm run preview  # preview production build
```

## Redeploy to gh-pages

After editing and committing to `main`:

```bash
npm run build
touch dist/.nojekyll
# orphan-push dist to gh-pages (example):
rm -rf /tmp/luna-gh-pages && mkdir /tmp/luna-gh-pages && cp -a dist/. /tmp/luna-gh-pages/
cd /tmp/luna-gh-pages && git init && git checkout -b gh-pages
git add -A && git commit -m "Deploy Astra explorations"
git remote add origin https://github.com/emily-clear-k12/LunaV2.0.git
git push -u origin gh-pages --force
```

(Optional later: add a GitHub Actions workflow that builds on push to `main` and deploys to Pages. Pushing `.github/workflows/*` needs a token with the `workflow` scope.)

## How to edit concepts

Placeholder copy lives in one file:

```text
src/data/concepts.ts
```

Edit hook, world, lesson beats, video rethink, keep/add/cut, and the “why this one” placeholder. The notes textarea on each tab saves to **browser `localStorage` only** (not committed).

UI shell: `src/App.tsx` · styles: `src/index.css`.

## Stack

Vite + React + TypeScript · Manrope · mobile-friendly · enchanted-forest brand on all three tabs (A densest, B cream desk over woods, C journal + moss).

## Package A skeleton walkthrough

Plain student click-through for **Package A · Details and Evidence** (no art — wireframe only):

- Source: [`public/package-a-skeleton/`](public/package-a-skeleton/)
- Pages URL: **https://emily-clear-k12.github.io/LunaV2.0/package-a-skeleton/**
- Docs note: [`docs/package-a-walkthrough/`](docs/package-a-walkthrough/)

Linked from the explorations site footer after deploy.

## Package B skeleton walkthrough

Plain student click-through for **Package B · Details and Evidence** dense 1:1 Luna map (no art — wireframe only):

- Source: [`public/package-b-skeleton/`](public/package-b-skeleton/)
- Pages URL: **https://emily-clear-k12.github.io/LunaV2.0/package-b-skeleton/**
- Docs note: [`docs/package-b-walkthrough/`](docs/package-b-walkthrough/)

Linked from the explorations site footer next to Package A after deploy.

