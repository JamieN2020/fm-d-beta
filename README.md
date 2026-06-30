# Frome Media & Design — Website

Static HTML, CSS, and JavaScript — no build step required.

## Pages

| File | Purpose |
|---|---|
| **`index.html`** | Minimal landing page — video hero, short services list, contact. Fast entry point for visitors. |
| **`home.html`** | Full site — hero, doodles, services cards, about, contact, animations. |
| **`portfolio.html`** | Simple portfolio — flat layout, linked from the landing page. |
| **`work.html`** | Original portfolio page (full site styling — kept for reference). |

Shared brand colours and fonts live in **`css/variables.css`** — edit that file to change colours site-wide.

## File structure

```
/
├── index.html              ← simple landing page
├── home.html               ← full marketing site
├── portfolio.html        ← simple portfolio (linked from index.html)
├── work.html             ← original portfolio (full site style)
├── css/
│   ├── variables.css       ← brand colours & tokens (shared)
│   ├── portfolio.css       ← styles for portfolio.html only
│   ├── simple.css          ← styles for index.html only
│   └── styles.css          ← full site styles (home.html, work.html)
├── js/
│   ├── portfolio.js        ← portfolio.html card rendering
│   ├── simple.js           ← index.html only (video + scroll reveal)
│   ├── script.js           ← home.html & work.html
│   └── work-data.js        ← Work page project list
├── assets/
│   ├── logo.png
│   ├── hero-video.mp4      ← shared by index.html & home.html
│   ├── hero-poster.jpg
│   ├── about-photo.jpg     ← home.html about section
│   └── favicon files
└── README.md
```

## Updating your work page

All case study cards on **work.html** are built from one list in **`js/work-data.js`**.

Open that file and edit the `WORK_PROJECTS` array. Each entry is one project card:

| Field | What it does |
|---|---|
| `title` | Project name on the card |
| `category` | Small tag above the title (e.g. `"Web Design"`, `"Branding"`, `"SEO"`) |
| `image` | Path to a project image (e.g. `"assets/work/project-1.jpg"`). Leave as `""` for a coloured placeholder block |
| `imageColor` | Placeholder colour when `image` is empty: `"blue"`, `"deepblue"`, `"magenta"`, `"ink"`, or `"mist"` |
| `description` | 1–2 sentences shown on the card |
| `status` | Badge text (e.g. `"Case study coming soon"`) |

To add a fourth project, copy an existing `{ ... }` block inside the array and change the values. Save and refresh **work.html** — no HTML or CSS editing needed.

## Open locally

Use a local web server (GSAP and video need HTTP, not `file://`):

```bash
cd path/to/code
python -m http.server 8080
```

Visit `http://localhost:8080` (loads **index.html** by default).

## Deploy

Upload all files to your web root. **`index.html`** is the default document on Apache and Cloudflare Pages.

Build settings for Cloudflare Pages: **None** — output directory `/`.

## Editing

| What to change | Where |
|---|---|
| Simple landing copy | `index.html` |
| Full site copy | `home.html` |
| Work / case studies | `js/work-data.js` |
| Brand colours | `css/variables.css` |
| Background shapes | `home.html` / `work.html` — search for `bg-shapes` |
| Animation timing | `js/script.js` or `js/simple.js` |
| Logo | Replace `assets/logo.png` |

## Dependencies (CDN)

- **index.html:** GSAP + ScrollTrigger only
- **home.html / work.html:** GSAP + ScrollTrigger + Lenis
- **Google Fonts** on all pages

No npm install required.
