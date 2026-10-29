# 397 Graphix Website

Clean, modern website for **397 Graphix** (`397graphix.co.nz`), built with **Astro**, **Tailwind CSS**, and **Cloudflare Pages Functions**.

## Project Structure

```text
├── src/
│   ├── components/
│   │   ├── PageHeader.astro     # Shared architectural page header
│   │   └── PhotoCard.astro      # Portfolio & lightbox card component
│   ├── data/
│   │   └── site.ts              # Central config: contact details, services, photos, process
│   ├── layouts/
│   │   └── BaseLayout.astro     # Shared header, footer, SEO/JSON-LD, and lightbox modal
│   ├── pages/
│   │   ├── index.astro          # Home page
│   │   ├── services.astro       # Services overview & specifications
│   │   ├── gallery.astro        # Filterable portfolio gallery
│   │   ├── about.astro          # About Ryan & 4-step process
│   │   ├── reviews.astro        # Customer reviews & feedback links
│   │   ├── contact.astro        # Quote request form & invoice payment info
│   │   └── 404.astro            # Custom 404 error page
│   └── styles/
│       └── global.css           # Tailwind layers, self-hosted Archivo font, dark theme tokens
├── public/
│   ├── assets/
│   │   ├── fonts/               # Self-hosted Archivo variable font (.woff2)
│   │   └── img/                 # Optimised & cropped WebP portfolio images, logo, favicon
│   ├── _headers                 # Cloudflare Pages security & cache headers
│   ├── robots.txt               # Search engine directives
│   ├── sitemap.xml              # XML sitemap
│   └── script.js                # Shared client interactions (menu, filters, lightbox, quote form)
├── functions/
│   └── api/
│       └── quote.js             # Cloudflare Pages Function for quote form emails (via Resend)
└── _originals/                  # Raw uncropped camera originals (git-ignored)
```

## Local Development

```bash
# Start local dev server (http://localhost:4321)
npm run dev

# Build static production output into ./dist
npm run build

# Preview production build locally
npm run preview
```

## Editing Site Content

All business details, services, portfolio captions, and external links are centralised in [`src/data/site.ts`](./src/data/site.ts):
- **Stripe Payment Link**: Replace `https://buy.stripe.com/REPLACE_ME` in `SITE.stripeLink` when ready (the "Pay Online by Card" button stays automatically hidden until updated).
- **Google Review Link**: Replace `https://g.page/r/REPLACE_ME/review` in `SITE.googleReviewLink` when the Google Business Profile is live.
- **Cloudflare Turnstile**: Replace `REPLACE_ME_TURNSTILE_SITE_KEY` in `SITE.turnstileSiteKey`.

## Deploying to Cloudflare Pages

1. Push this repository to GitHub (`_originals/` and `node_modules/` are ignored via `.gitignore`).
2. In Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**:
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. For the `/api/quote` form backend, add the following in **Settings → Variables and Secrets**:
   - `RESEND_API_KEY` (Secret): API key from [resend.com](https://resend.com)
   - `QUOTE_TO` (Text): `ryan@397graphix.co.nz`
   - `QUOTE_FROM` (Text): `397 Graphix Website <website@397graphix.co.nz>`
   - `TURNSTILE_SECRET_KEY` (Secret, optional): Cloudflare Turnstile secret key

