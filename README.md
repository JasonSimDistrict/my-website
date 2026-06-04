# ProjectHome.sg

Singapore property advisory website co-founded by **Jason Sim** and **Renee Lim**, District Directors at Huttons Asia. Pure static HTML/CSS/JS — no build step, no framework, no Node.js. Deploy to any static host by uploading the files.

## Live site

- Production: https://projecthome.sg
- Hosted on Cloudflare Pages

## Pages

| File | Description |
| --- | --- |
| `index.html` | Homepage — hero, services, roadmap preview, latest blog, testimonials, FAQ, contact |
| `guides.html` | 7-step Singapore home buying roadmap |
| `blog.html` | Blog index with featured post + category filter |
| `about.html` | About ProjectHome.sg — the story behind PH.sg, with founder preview cards linking to the dedicated profile pages |
| `jason-sim.html` | Jason Sim's full profile page (photo, bio, credentials, professional disclosure) — reached via About → Jason Sim in the nav |
| `renee-lim.html` | Renee Lim's full profile page (photo, bio, credentials, professional disclosure) — reached via About → Renee Lim in the nav |
| `contact.html` | Contact form + WhatsApp channels |
| `blog/*.html` | Individual blog post pages |

## Project structure

```
projecthome-sg/
├── index.html
├── guides.html
├── blog.html
├── about.html             # Story behind PH.sg + founder preview cards
├── jason-sim.html         # Jason Sim's profile page
├── renee-lim.html         # Renee Lim's profile page
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
│       ├── jason-sim.jpg       # Profile photo (Jason Sim)
│       ├── renee-lim.jpg       # Profile photo (Renee Lim)
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

## Lead form wiring

The form is wired through a **Cloudflare Pages Function** at `functions/api/lead.js` that posts to **[Resend](https://resend.com)**. Submissions arrive in `projecthome.sg@gmail.com` (or whatever `LEAD_TO_EMAIL` env var is set to) within seconds, sent from `enquiries@projecthome.sg`. The visitor's email address is set as `Reply-To` so hitting Reply in Gmail goes straight to the lead.

### Architecture

```
[ Visitor fills form ]
          │
          ▼  POST /api/lead  (JSON body)
[ functions/api/lead.js ] ──── Cloudflare Pages Function (free tier)
          │
          ├── Server-side email validation
          ├── Honeypot check (silently drops bots)
          │
          ▼  POST https://api.resend.com/emails
[ Resend ] ────── (3,000 free emails/month, sends from verified domain)
          │
          ▼
[ projecthome.sg@gmail.com ]
```

### Required environment variables (set in Cloudflare Pages dashboard)

| Variable | Type | Value | Required |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | Secret | `re_...` (from https://resend.com/api-keys) | **yes** |
| `LEAD_TO_EMAIL` | Plaintext | e.g. `projecthome.sg@gmail.com` | no — defaults to `projecthome.sg@gmail.com` |

Cloudflare Pages → your project → **Settings** → **Variables and Secrets** → add for both **Production** and **Preview** environments.

### Required DNS records (in Cloudflare DNS for `projecthome.sg`)

Verified via the Resend domains dashboard:

- **TXT** `projecthome.sg` — SPF (`v=spf1 include:amazonses.com ~all`)
- **MX** `send.projecthome.sg` (or similar) — bounce subdomain, value `feedback-smtp.resend.com`
- **TXT** `resend._domainkey.projecthome.sg` — DKIM public key

DNS records must be **DNS-only** (orange-cloud OFF) — proxying breaks email auth.

### Anti-spam

A hidden `name="website"` field (`.hp-field` CSS class) is rendered into every form. Real users never see it. Bots that auto-fill all inputs trip it, and `functions/api/lead.js` returns `{ ok: true }` without sending an email. No CAPTCHA needed at this scale.

### Failure mode

If Resend is down or the API key is invalid, the function returns `{ ok: false, error: "..." }` and the page surfaces a friendly error message pointing the visitor at WhatsApp `+65 8282 2486` and `projecthome.sg@gmail.com` as backup channels. The submit button re-enables so they can retry.

### Changing the "From" or "To" address

- **From:** edit the `FROM_ADDRESS` constant at the top of `functions/api/lead.js`. Must be `you@projecthome.sg` since that domain is what's verified at Resend.
- **To:** change the `LEAD_TO_EMAIL` env var in Cloudflare Pages — no code change needed.

WhatsApp `+65 8282 2486` works without any backend changes — the floating action button and inline channels are direct deep links to wa.me.

## SEO checklist (already in place)

- Per-page `<title>`, meta description, canonical URL
- Open Graph + Twitter Card meta tags on every page
- Geo-targeting: `geo.region=SG`, `content-language=en-SG`, `og:locale=en_SG`
- JSON-LD structured data: `RealEstateAgent` (with `founder` + `employee` arrays for both Jason Sim and Renee Lim) + `WebSite` on home; `HowTo` (guides), `Blog` + `BreadcrumbList` (blog index), `BlogPosting` + `BreadcrumbList` (each article), `AboutPage` + two `Person` entities (about), `ContactPage` + `BreadcrumbList` (contact)
- `robots.txt` and `sitemap.xml` at the root
- `prefers-reduced-motion` honored across all CSS animations and JS counter animation
- Accessible focus rings (`:focus-visible`), skip-to-content link, ARIA labels on icon-only links and interactive elements

## Professional licence

Jason Sim · District Director · RES Reg No: **R052528Z** · WhatsApp **+65 8282 2486**
Renee Lim · District Director · RES Reg No: **R047234H** · WhatsApp **+65 8827 5656**
Huttons Asia Pte Ltd · Agency Licence No: **L3008899K**

Direct WhatsApp deep links:
- Jason: [https://wa.me/6582822486](https://wa.me/6582822486)
- Renee: [https://wa.me/6588275656](https://wa.me/6588275656)

---

## Why static HTML

This site previously used Astro 5 (a modern static-site generator). It built fine locally but the Cloudflare Pages build kept failing for configuration reasons we couldn't diagnose. Switching to pure static HTML eliminates every variable: no Node version, no framework preset, no build command, no output directory. Cloudflare just serves the files exactly as they sit in the repo.
