# Static HTML version (archived)

This folder contains the **original hand-written static HTML version** of ProjectHome.sg, kept for reference. The live site is built from the Astro project at the **root of this repository** — that's what Cloudflare Pages deploys.

## What's here

| File | Description |
| --- | --- |
| `index.html` | Homepage (hero, features, roadmap preview, blog teaser, testimonials, FAQ, contact) |
| `guides.html` | 7-step Singapore home buying roadmap |
| `blog.html` | Blog listing with featured post + filter chips |
| `blog-post.html` | Single article template (Q1 2026 market report) |
| `contact.html` | Contact page with lead form + WhatsApp channels |
| `assets/css/style.css` | Full design system stylesheet |
| `assets/js/main.js` | Mobile nav, animated counters, FAQ accordion, blog filter, reveal-on-scroll |
| `assets/images/logo.png` | ProjectHome.sg brand mark |
| `robots.txt` | Crawler directives (points at `sitemap.xml`) |
| `sitemap.xml` | Hand-maintained sitemap (Astro version uses `@astrojs/sitemap` for auto-generation) |

## How to view it

Open any of the `.html` files directly in a browser, or serve the folder with any static server, e.g.:

```bash
cd static-version
npx serve .
# then visit http://localhost:3000
```

No build step required — just plain HTML, CSS, and JavaScript.

## Why keep it?

- A single-file-per-page reference if you want to copy a section into another project
- A fallback in case you ever want to deploy without a build pipeline
- A historical record of how the site looked before the Astro migration

The Astro version (root of repo) is the source of truth for the live site.
