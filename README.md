# ProjectHome.sg — Astro

Singapore property advisory website built with [Astro](https://astro.build).

## Stack

- **Astro 4** — static-first, zero JS by default
- **TypeScript** strict mode
- **Content Collections** for type-safe blog posts (markdown)
- **@astrojs/sitemap** auto-generated sitemap-index
- **Vanilla CSS** — design tokens via CSS custom properties (corporate teal `#063943`, copper `#d19557`)
- **Montserrat + Nourd** typography (Google Fonts fallback to Nunito Sans)

## Project structure

```
projecthome-sg-astro/
├── public/
│   ├── assets/images/logo.png
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Breadcrumbs.astro
│   │   ├── CtaStrip.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── JsonLd.astro
│   │   ├── LeadForm.astro
│   │   ├── PostCard.astro
│   │   ├── Seo.astro
│   │   └── WhatsAppFab.astro
│   ├── content/
│   │   ├── config.ts                  # Blog schema
│   │   └── blog/                      # Markdown posts
│   ├── layouts/
│   │   └── BaseLayout.astro           # html/head/body, header, footer, FAB, JS
│   ├── pages/
│   │   ├── index.astro                # Homepage
│   │   ├── guides.astro               # 7-step buyer roadmap
│   │   ├── contact.astro              # Contact + lead form
│   │   └── blog/
│   │       ├── index.astro            # Blog listing
│   │       └── [...slug].astro        # Single post (dynamic)
│   ├── styles/
│   │   └── global.css
│   └── env.d.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server (http://localhost:4321)
npm run dev

# 3. Type-check the project
npm run check

# 4. Build for production (outputs to dist/)
npm run build

# 5. Preview the production build locally
npm run preview
```

## Adding a blog post

Create a new `.md` file in `src/content/blog/`:

```markdown
---
title: "Your post title"
description: "One-sentence summary for search results and social cards."
pubDate: 2026-05-01
category: report          # launch | report | guide | district
categoryLabel: "Market Report"
coverImage: "https://images.unsplash.com/..."
coverImageAlt: "Description for screen readers"
readingTime: "6 min read"
featured: false           # true to surface on the blog index hero
---

## Your content

Markdown body goes here.
```

The post will automatically appear at `/blog/<filename-without-extension>` and in the blog listing.

## Deploying

The site is fully static — deploy `dist/` to any static host:

| Host            | One-line deploy                                                   |
| --------------- | ----------------------------------------------------------------- |
| Cloudflare Pages | Connect the repo, framework preset: Astro                         |
| Netlify         | Drag-drop `dist/`, or connect repo (build cmd: `npm run build`)   |
| Vercel          | Connect repo — Astro is auto-detected                             |
| GitHub Pages    | Add `@astrojs/github-pages` adapter, or push `dist/` to `gh-pages` |

After deploy, update `site` in `astro.config.mjs` to your final domain (currently `https://projecthome.sg`).

## Wiring the lead form

The lead form (`src/components/LeadForm.astro`) currently shows a confirmation message client-side without sending data anywhere. To accept submissions, choose one:

- **Formspree / Basin / Web3Forms** — set the form's `action` attribute to your endpoint and remove the JS `preventDefault`.
- **Netlify Forms** — add `data-netlify="true"` and a hidden `form-name` input.
- **Cloudflare Pages Functions** — write `functions/api/lead.ts`, post the form to it.
- **Custom API** — `fetch('/api/lead', { method: 'POST', body: new FormData(form) })` from the existing JS in `BaseLayout.astro`.

## SEO checklist (already in place)

- Per-page `<title>`, meta description, canonical URL
- Open Graph + Twitter Card on every page
- Geo meta (`geo.region=SG`, `content-language=en-SG`, `og:locale=en_SG`)
- JSON-LD: `RealEstateAgent` + `WebSite` site-wide; `HowTo`, `Blog`, `BlogPosting`, `ContactPage`, `BreadcrumbList` per page
- Auto-generated sitemap-index at `/sitemap-index.xml` (via `@astrojs/sitemap`)
- `robots.txt` at `/robots.txt`
- `prefers-reduced-motion` honored across all animations
- Accessible focus rings (`:focus-visible`), skip-to-content link, keyboard-navigable

## Contact

WhatsApp **+65 8282 2486** · [https://wa.me/6582822486](https://wa.me/6582822486)
