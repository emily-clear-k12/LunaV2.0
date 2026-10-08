#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
npm run build
# Astra student dashboards: Plan A (React) → dist/dashboard-a/.
# Plans B–D (Crystal Railways, Pop Up Mounts, Forest Guides) are static pages in public/dashboard-b … dashboard-d,
# copied into dist/ by the root build above. dist/dashboard/ is a redirect stub for the retired map-style Plan B.
( cd student-dashboard && { [ -d node_modules ] || npm install --no-audit --no-fund; } && npm run build:a && \
  if [ -f ../dist/dashboard-a/index-a.html ] && [ ! -f ../dist/dashboard-a/index.html ]; then
    mv ../dist/dashboard-a/index-a.html ../dist/dashboard-a/index.html
  fi
)
touch dist/.nojekyll
TMP="$(mktemp -d)"
cp -a dist/. "$TMP/"
cd "$TMP"
git init -b gh-pages
git config user.email "${GIT_AUTHOR_EMAIL:-emily@cleark12.com}"
git config user.name "${GIT_AUTHOR_NAME:-emily-clear-k12}"
git add -A
git commit -m "Deploy Astra explorations to GitHub Pages"
git remote add origin https://github.com/emily-clear-k12/LunaV2.0.git
git push -u origin gh-pages --force
echo "Pushed dist → origin/gh-pages"
