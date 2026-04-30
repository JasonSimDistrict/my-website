# ProjectHome.sg

Singapore property advisory website by **Jason Sim, District Director at Huttons Asia**. Pure static HTML/CSS/JS — no build step, no framework, no Node.js. Deploy to any static host by uploading the files.

## Live site

- Production: https://projecthome.sg
- Hosted on Cloudflare Pages

## Pages

| File | Description |
| --- | --- |
| `index.html` | Homepage — hero, services, roadmap preview, latest blog, testimonials, FAQ, contact |
| `guides.html` | 7-step Singapore home buying roadmap |
| `blog.html` | Blog index with featured post + category filter |
| `about.html` | About Jason Sim — bio, credentials, professional disclosure |
| `contact.html` | Contact form + WhatsApp channels |
| `blog/*.html` | Individual blog post pages |

## Project structure

```
projecthome-sg/
├── index.html
├── guides.html
├── blog.html
├── about.html
├── contact.html
├── blog/
│   ├── q1-2026-private-property-review.html
│   ├── q2-2026-new-launch-watchlist.html
│   ├── bto-vs-resale-2026.html
│   ├── district-19-spotlight.html
│   ├── should-you-decouple-2026.html
│   └── hdb-resale-2025-recap.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── images/
│       ├── logo.png            # ProjectHome.sg logo
│       ├── jason-sim.png       # Profile photo
│       └── huttons-logo.png    # Huttons Asia logo
├── robots.txt
├── sitemap.xml
└── README.md
```

## Local development

No build step needed. Two ways to view locally:

**Option 1 — Open in browser directly**

Double-click `index.html` (works in modern browsers, but some features like the FAQ accordion need a real HTTP server).

**Option 2 — Run a tiny local server (recommended)**

```bash
# Using Python (already installed on most systems)
python -m http.server 8000
# Then visit http://localhost:8000

# Or with Node.js
npx serve .
# Or with PHP
php -S localhost:8000
```

## Deploying to Cloudflare Pages

This is the simplest possible deploy because there's no build step.

1. https://dash.cloudflare.com → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. Pick `JasonSimDistrict/my-website`
3. **On the build settings page, set:**
   - **Framework preset:** `None` (or leave blank)
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/`
   - **Root directory:** `/`
4. Click **Save and Deploy**

Cloudflare Pages will copy the repository contents to its edge network. No Node.js, no npm, no build. The site is live in under a minute.

### Custom domain

After the `*.pages.dev` URL is serving:

1. Pages project → **Custom domains** tab → **Set up a custom domain**
2. Enter `projecthome.sg`
3. Cloudflare auto-creates DNS records (or shows you what to add at your registrar)
4. SSL cert auto-issues via Universal SSL

## Adding a new blog post

1. **Copy a template:** Duplicate any file in `blog/` (e.g. `blog/q2-2026-new-launch-watchlist.html`) and rename it with your new slug, e.g. `blog/may-2026-rcr-launch-review.html`
2. **Edit the head:** Update `<title>`, `<meta name="description">`, all `og:`/`twitter:` meta tags, the `<link rel="canonical">`, and the `application/ld+json` block (headline, description, image, datePublished, articleSection)
3. **Edit the breadcrumb** in `.post-hero` to match the new post title
4. **Edit the `.post-meta` line** with your category, date, and reading time
5. **Edit the `<h1>`** with your post title
6. **Replace the article body** inside `<article class="post-content">` with your content
7. **Add a card to `blog.html`** in the `.blog-grid` section — copy an existing `<article class="post-card" data-category="…">` block, update the link, image, category, date, title, and excerpt. The `data-category` value drives the filter chips (`launch`, `report`, `guide`, or `district`)
8. **Add an entry to `sitemap.xml`** with the new URL and `lastmod` date
9. **Optional:** Add a card to the homepage (`index.html`) in the "Latest Insights" section if you want it to appear there too

That's it. Commit and push — Cloudflare auto-deploys.

### Image guidance

Cover images come from Unsplash with these search themes (free for commercial use):
- **Singapore skylines / Marina Bay** — for market reports
- **Modern condominium developments** — for new launches
- **HDB blocks with greenery** — for HDB-related content
- **Asian families / couples at home** — for buyer guides
- **Asian professionals reviewing documents** — for finance/decoupling content

Use `?auto=format&fit=crop&w=1400&q=80` URL params for hero images, `&w=900` for card thumbnails.

## Wiring the lead form

The lead form in `contact.html` and `index.html` currently shows a confirmation message client-side without sending data anywhere. To accept submissions:

- **Formspree / Basin / Web3Forms (easiest):** Set the form's `action` attribute to your endpoint, change `method` to `POST`, and remove the `e.preventDefault()` line in `assets/js/main.js`
- **Cloudflare Pages Functions:** Add `functions/api/lead.js` to the repo — Pages runs it as a serverless function. Email yourself via Resend or MailChannels
- **Custom API:** Modify the JS in `assets/js/main.js` to `fetch('/api/lead', { method: 'POST', body: new FormData(form) })`

WhatsApp `+65 8282 2486` works without any backend changes.

## SEO checklist (already in place)

- Per-page `<title>`, meta description, canonical URL
- Open Graph + Twitter Card meta tags on every page
- Geo-targeting: `geo.region=SG`, `content-language=en-SG`, `og:locale=en_SG`
- JSON-LD structured data: `RealEstateAgent` + `WebSite` + `Person` (Jason Sim) on home; `HowTo` (guides), `Blog` + `BreadcrumbList` (blog index), `BlogPosting` + `BreadcrumbList` (each article), `AboutPage` + `Person` (about), `ContactPage` + `BreadcrumbList` (contact)
- `robots.txt` and `sitemap.xml` at the root
- `prefers-reduced-motion` honored across all CSS animations and JS counter animation
- Accessible focus rings (`:focus-visible`), skip-to-content link, ARIA labels on icon-only links and interactive elements

## Professional licence

Jason Sim · District Director · RES Reg No: **R052528Z**
Huttons Asia Pte Ltd · Agency Licence No: **L3008899K**

WhatsApp: **+65 8282 2486** · [https://wa.me/6582822486](https://wa.me/6582822486)

---

## Why static HTML

This site previously used Astro 5 (a modern static-site generator). It built fine locally but the Cloudflare Pages build kept failing for configuration reasons we couldn't diagnose. Switching to pure static HTML eliminates every variable: no Node version, no framework preset, no build command, no output directory. Cloudflare just serves the files exactly as they sit in the repo.
