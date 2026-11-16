# Alex Tran Portfolio

A static, highly-interactive personal portfolio in a dark burgundy / champagne "glass"
style (Outfit + Doto dot-matrix type): tilting glass hero, scrambled name, count-ups,
custom cursor, magnetic buttons, an interactive career timeline, a project switcher and
skill tabs. Built with no frontend framework — plain HTML, CSS, and JS — no build step.

There is also a separate Next.js app, `meet-alex-ai/`, which powers AlexB — the AI chat
experience linked from the site (`ai.html` embeds it). It uses the same design language.

## Directory Structure

```
/
├── index.html            # The live site — hand-authored, edit this directly
├── ai.html               # Shell page embedding the meet-alex-ai app (loader + back button)
├── README.md             # This documentation
├── assets/
│   └── media/            # Portrait, AI preview, Loki demo video + poster, favicon
├── css/
│   └── site.css          # All styling for the live site (palette tokens at the top)
├── js/
│   └── site.js           # Interactions + timeline/project/skill data + project figures
├── Resume/               # Résumé PDF + DOCX
├── meet-alex-ai/         # Next.js AI chat app (deployed separately on Vercel)
├── _backup/              # Pre-redesign copy of the old site (not published by GitHub Pages)
└── cms-legacy/           # RETIRED Python CMS — see warning below
```

## How to Edit Your Website

Edit `index.html`, `css/site.css`, and `js/site.js` directly. There is no build step.

- Section text lives in `index.html`.
- The career timeline entries (`EXPS`), project switcher labels (`PROJ`) and skill tabs
  (`SKILLS`) live at the top of `js/site.js`.
- Colours are CSS variables at the top of `css/site.css` (`--g1`…`--g5`, `--pink`,
  `--acc`, …).
- Projects 02–04 show generated figures (heatmap, spatial spots, UMAP) drawn on
  `<canvas data-viz=…>`. To use a real screenshot instead, replace that `<canvas>` with an
  `<img>` inside the same `.slide-media` box.

To preview locally:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

### Backups and legacy files

The pre-redesign site (Nov 2026) is preserved two ways:

- git branch `backup/pre-redesign-2026-11-15` (the last commit before the redesign)
- `_backup/pre-redesign-2026-11-15/` (old `index.html`, `ai.html`, `css/`, `js/`, and the
  AI app's `src/` + `content/`)

`css/portfolio.css`, `css/story.css`, `css/lux.css`, `js/portfolio.js`, `css/styles.css`
and `js/script.js` belong to older designs. Nothing references them any more; they're
kept only so an old look can be restored. Safe to delete.

## ⚠️ The retired CMS (`cms-legacy/`)

The site used to be **generated** by `cms-legacy/cms.py` from `content.json`. That
generator still contains the **old, pre-redesign** markup, so running it against the
repo root would wipe out the current design.

It has been defused: by default it now writes to `cms-legacy/index.legacy.html` — a
harmless preview — and leaves the live `index.html` alone. Publishing the old design
over the live site requires an explicit flag, and takes a timestamped backup first:

```bash
cd cms-legacy
python3 cms.py            # safe: writes index.legacy.html only
python3 cms.py --force    # DESTRUCTIVE: overwrites the live index.html
```

If you want a CMS again, `generate_index_html()` needs to be rewritten to emit the
redesign's markup, and `content.json` expanded to cover its sections.

## Deployment

The site is pure static HTML/CSS/JS with no build step, so the repo root can be
deployed as-is on:

- **GitHub Pages**
- **Vercel**
- **Netlify**

Just push and it goes live.

Note: `meet-alex-ai/` is a separate Next.js deployment and needs an `OPENAI_API_KEY`
environment variable set on its host.
