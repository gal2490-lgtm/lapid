# לפיד (Lapid) — personal learning feed

A single-screen, vertical-scroll feed in Hebrew that replaces social-media scrolling with
learning content only: core-idea cards from leading books (one idea per card, not chapter summaries), talks by thought leaders and
articles from selected publications. No goals, no streaks, no notifications, no tabs.

## How it works
- `index.html` — the whole app (vanilla HTML/CSS/JS, mobile-first, RTL). No build step.
- `data/index.json` — the catalog of interests (id, Hebrew name, hue, week epoch).
- `data/interests/<id>.json` — per interest: 30 books, 10 thought leaders (2 verified
  YouTube videos each), 5 publications (3 recent articles each) and chapter cards.
- On first open the reader picks interests. The feed is assembled locally from the chosen
  interests: chapter cards, videos, articles, "meet the leader" and "book to know" cards,
  interleaved and shuffled with a daily seed. Items already seen sink to the end.
- Weekly cadence: for each book that has chapter cards, the card shown is chapter
  `min(week, chapters available)`, where `week` counts from `week_epoch`.
- Saved items, seen items, theme and chosen interests live in `localStorage` only.

## Content rules
See `PIPELINE.md`. Nothing is invented: every video and article URL was copied from a
search result, chapter cards cite their grounding sources, and quotes appear only when
seen verbatim. Run `node scripts/validate.cjs` from the repo root to check the data.

## Where it runs
- GitHub Pages serves the `gh-pages` branch; `.github/workflows/pages.yml` mirrors `main` into it on every push.
  Live at https://gal2490-lgtm.github.io/lapid/
  There YouTube plays inline and book covers load from Open Library.
- As a claude.ai artifact (no external images allowed there) it falls back to typographic
  covers and posters, and videos open on YouTube.

## Weekly refresh
Re-run the pipeline in `PIPELINE.md` for each interest: add the next chapter card for
every active book, refresh articles, add new talks. Validate, commit, republish.
