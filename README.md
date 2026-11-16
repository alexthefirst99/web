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
└── meet-alex-ai/         # Next.js app for AlexB, the AI chat (deployed on Vercel)
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

### Restoring the old design

The pre-redesign site (old design, old CSS/JS, the retired `cms-legacy/` generator and the
original AI chat with its 3D scene) is commit `0bd8357` in the git history. To look at it:

```bash
git checkout 0bd8357 -- <path>   # e.g. css/portfolio.css
```

## Deployment

One push to `main` deploys both parts:

- **GitHub Pages** builds the portfolio from the repo root →
  <https://alexthefirst99.github.io/web/>
- **Vercel** (connected to this repo) builds `meet-alex-ai/` →
  <https://meet-alex-ai.vercel.app/>. It needs an `OPENAI_API_KEY` environment variable
  set in the Vercel project; without one it answers with built-in mock replies.

`.gitignore` keeps local-only files out of the repo (macOS `.DS_Store`, zips, `_backup/`,
`assets/media/old.MP4`).
