# projecthome.sg — Astro port

This folder is the in-progress Astro version of projecthome.sg. The legacy
hand-written HTML files in the parent folder still serve production traffic —
nothing here is live yet.

## What's here right now (Stage 0)

| Piece | File | Status |
|---|---|---|
| Project scaffold | `package.json`, `astro.config.mjs`, `tsconfig.json` | Done |
| Asset sync (mirrors `../assets/` → `./public/assets/`) | `scripts/sync-public.mjs` | Done |
| Global page shell | `src/layouts/BaseLayout.astro` | Done |
| Header / Nav with active-state highlighting | `src/components/Nav.astro` | Done |
| Footer with auto-updating copyright year | `src/components/Footer.astro` | Done |
| Floating WhatsApp button (per-page context) | `src/components/WhatsAppFab.astro` | Done |
| Proof-of-concept page | `src/pages/disclaimer.astro` | Done |

## First-time setup (do this once)

You'll need Node 18+ installed (any recent version works).

```bash
cd astro
npm install
```

This installs Astro and pulls down its dependencies into `node_modules/`
(which is gitignored).

## Run the dev server (every time)

```bash
npm run dev
```

The first thing this does is run `scripts/sync-public.mjs`, which copies
the parent folder's `../assets/` directory into `./public/assets/` so that
the existing CSS, JS, fonts and images all resolve correctly. Then Astro
boots its dev server, usually at <http://localhost:4321>.

To see the proof-of-concept page, open <http://localhost:4321/disclaimer>.

It should look identical to <https://projecthome.sg/disclaimer> in
production. If anything looks off — colour, layout, broken icon, missing
font — flag it before we move to Stage 1.

## Build a static preview (optional)

```bash
npm run build
npm run preview
```

The build writes static HTML/CSS/JS into `dist/`. When we get to Stage 3
cutover, Cloudflare Pages will be pointed at this folder.

## Why is `public/assets/` gitignored?

The CSS, images, JS and downloads live at `../assets/` in the parent repo
and serve the legacy HTML site. We mirror them into `./public/assets/` at
build time so we don't have to duplicate 30+ MB into git. The sync script
runs automatically before `dev` and `build`, so you should never need to
think about it. If you ever do need to refresh manually:

```bash
npm run sync-public
```

## Where we're going next

| Stage | Scope | When |
|---|---|---|
| **0 — Scaffold** *(current)* | Astro project + global chrome + 1 test page | **Done** |
| **1 — Static pages** | Port the ~10 mostly-static pages (index, about, contact, services, profiles, guides, legal). | Next session |
| **2 — Blog + launch reviews** | Move 14 blog posts and 5 launch reviews into a content collection; the gallery becomes a reusable `<Gallery>` component; the launch calendar reads from a data file. | After Stage 1 |
| **3 — Cutover** | Switch Cloudflare Pages to build from `dist/`. Add `_redirects` mapping every `/page.html` → `/page` as a 301. Sitemap regenerated. The legacy HTML stays in the repo as fallback for a few weeks. | After Stage 2 |

## URLs

This build produces **clean URLs** (no `.html` extension):

- Legacy: `/disclaimer.html`
- Astro:  `/disclaimer`

All internal links inside the Astro project already use the clean form.
When we get to Stage 3, we'll add 301 redirects from every legacy `.html`
URL to its clean equivalent so existing inbound links and Google's index
both carry over without ranking loss.
