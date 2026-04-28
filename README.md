# ProjectHome.sg

Singapore property advisory website by Jason Sim, District Director at Huttons Asia. Built with [Astro](https://astro.build).

## Stack

- **Astro 5** — static-first, zero JS by default
- **TypeScript** strict mode
- **Content Collections** for type-safe blog posts (markdown)
- **@astrojs/sitemap** auto-generated sitemap-index
- **Vanilla CSS** — design tokens via CSS custom properties (corporate teal `#063943`, copper `#d19557`)
- **Montserrat + Nourd** typography (Google Fonts fallback to Nunito Sans)

## Pages

| Route | Description |
| --- | --- |
| `/` | Homepage — hero, services, roadmap preview, latest blog, testimonials, FAQ, contact |
| `/guides` | 7-step Singapore home buying roadmap |
| `/blog` | Blog index with featured post + category filter |
| `/blog/[slug]` | Dynamic blog post route, content from `src/content/blog/*.md` |
| `/about` | About Jason Sim — bio, credentials, professional disclosure |
| `/contact` | Contact form + WhatsApp channels |

## Project structure

```
my-website/
├── public/
│   ├── assets/
│   │   └── images/
│   │       ├── logo.png            # ProjectHome.sg logo
│   │       ├── jason-sim.png       # Profile photo
│   │       └── huttons-logo.png    # Huttons Asia logo
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
│   │   ├── config.ts               # Blog schema (Zod-validated)
│   │   └── blog/                   # Markdown blog posts
│   ├── layouts/
│   │   └── BaseLayout.astro        # html/head/body, header, footer, FAB, JS
│   ├── pages/
│   │   ├── index.astro
│   │   ├── guides.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   └── blog/
│   │       ├── index.astro
│   │       └── [...slug].astro
│   ├── styles/
│   │   └── global.css
│   └── env.d.ts
├── .nvmrc                          # Pins Node 20 for Cloudflare/Vercel
├── astro.config.mjs
├── package.json
├── package-lock.json               # Reproducible installs
└── tsconfig.json
```

## Getting started

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # Static output in dist/
npm run preview      # Preview the production build
npm run check        # TypeScript check
```

## Adding a new blog post

Create a new `.md` file inside `src/content/blog/`:

```markdown
---
title: "Your post title"
description: "One-sentence summary for search results and social cards."
pubDate: 2026-05-01
category: report          # launch | report | guide | district
categoryLabel: "Market Report"
coverImage: "https://images.unsplash.com/..."
coverImageAlt: "Description for accessibility"
readingTime: "6 min read"
featured: false           # true to surface on the blog index hero
draft: false              # true to hide from production builds
---

## Your content

Markdown body here. Internal links like [contact me](/contact) work.
```

Save the file. Run `npm run build`. The post automatically:

- Appears at `/blog/<filename-without-extension>/`
- Shows up in the blog listing, sorted by date
- Gets indexed in the auto-generated sitemap
- Receives full BlogPosting JSON-LD with publisher attribution to Jason Sim
- Is recommended on related-posts rails on other articles

## Adding new pages

Drop an `.astro` file in `src/pages/`. The filename becomes the route. Use the existing pages as templates — most just need `BaseLayout` plus your content.

## Deploying

The site is fully static — `dist/` can deploy to any static host:

| Host             | Build command       | Output dir |
| ---------------- | ------------------- | ---------- |
| Cloudflare Pages | `npm run build`     | `dist`     |
| Vercel           | (auto-detected)     | (auto)     |
| Netlify          | `npm run build`     | `dist`     |
| GitHub Pages     | `npm run build`     | `dist`     |

Node version is pinned to **20** via `.nvmrc` — most hosts read this automatically.

## Wiring the lead form

The lead form (`src/components/LeadForm.astro`) currently shows a confirmation message client-side without sending data anywhere. To accept submissions:

- **Formspree / Basin / Web3Forms** — set the form's `action` attribute and remove the JS `preventDefault` in `BaseLayout.astro`
- **Netlify Forms** — add `data-netlify="true"` and a hidden `form-name` input
- **Cloudflare Pages Functions** — write `functions/api/lead.ts`, post the form to it
- **Custom API** — `fetch('/api/lead', { method: 'POST', body: new FormData(form) })`

## SEO checklist (already in place)

- Per-page `<title>`, meta description, canonical URL
- Open Graph + Twitter Card on every page
- Geo meta (`geo.region=SG`, `content-language=en-SG`, `og:locale=en_SG`)
- JSON-LD: `RealEstateAgent` + `WebSite` + `Person` (Jason) site-wide; `HowTo`, `Blog`, `BlogPosting`, `AboutPage`, `ContactPage`, `BreadcrumbList` per page
- Auto-generated sitemap-index at `/sitemap-index.xml` (via `@astrojs/sitemap`)
- `robots.txt` at `/robots.txt`
- `prefers-reduced-motion` honored across all animations
- Accessible focus rings (`:focus-visible`), skip-to-content link, keyboard-navigable

## Professional licence

Jason Sim · District Director · RES Reg No: **R052528Z**
Huttons Asia Pte Ltd · Agency Licence No: **L3008899K**

WhatsApp: **+65 8282 2486** · [https://wa.me/6582822486](https://wa.me/6582822486)
