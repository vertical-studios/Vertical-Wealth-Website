# Vertical Wealth website

Astro static site with the TinaCMS editor (click-to-edit), deployed on Vercel. Content lives in `/content` as JSON (pages, settings) and Markdown (Insights posts). Every edit, by a person or by AI, is a Git commit, so anything can be rolled back.

The design and structure follow the Vertical Wealth Site Foundation board, signed off Nov 18, 2026: white ground, black nav and footer, purple (#663399) for accents, yellow for buttons, flat surfaces (no texture, no drop shadows), square corners, black-and-white photos, Bebas Neue Pro (mixed case, -0.02em tracking, sizes from the shared Vertical family scale) for headlines up to six words, Roboto body at 18px. Weekly Lessons is the first step for cold visitors; the discovery call is the second.

## Compliance rules for anyone editing

- Never mention SPVs or private placements.
- Posts and guides inform; they never give individual advice. No performance numbers, guarantees or promised outcomes.
- Client stories speak to character, faith and family growth, never investment performance, and need compliance sign-off plus the small print in the Client stories block.
- The disclosure footer (Site settings, "Footer disclosures") stays on every page.

## Go live

1. **GitHub.** `vertical-studios/Vertical-Wealth-Website`, public, so Tina saves deploy on Vercel's free plan.
2. **Vercel.** Import the repo. Build command `npm run build`.
3. **TinaCMS.** Create a Tina Cloud project for the repo, then add `TINA_CLIENT_ID` and `TINA_TOKEN` in Vercel environment variables and redeploy. The editor appears at `/admin`.
4. **Analytics.** Add the Vertical Wealth Google Tag Manager ID as `PUBLIC_GTM_ID`. Tags fire on verticalwealth.life, and on previews only when Tag Assistant is open.
5. **Fonts.** Bebas Neue Pro loads from the Adobe Fonts kit `xhb8qju` ("Vertical Wealth Website"), licensed for verticalwealth.life, www.verticalwealth.life, *.vercel.app and localhost.
6. **HighLevel.** Set the discovery call calendar's confirmation redirect to `https://www.verticalwealth.life/thank-you`, and match its length to the 15 minutes the site promises (today it books 30).
7. **Domain.** Point www.verticalwealth.life at Vercel once images are moved off Squarespace (see below). Old Squarespace URLs redirect in `vercel.json`.

## Before switching the domain

- [ ] Move images, logos and the guide PDF off Squarespace and SharePoint into `public/uploads/`, then swap the URLs in `/content`.
- [ ] Brian confirms the regulatory disclosures the site must carry (registration statement, Form ADV and Form CRS links if required).
- [ ] Brian sets the soft account-size guide and confirms the life insurance profit-sharing wording.
- [ ] Confirm the purple against the brand guide.
- [ ] Re-submit the sitemap in Google Search Console after launch.

## Running locally

```
npm install
npm run dev        # site + editor at localhost:4321/admin (local mode saves to your files)
npm run build      # full static build (runs inside `tinacms build`)
```

## Adding a new section type

1. Add a template in `tina/config.ts`
2. Add a component in `src/components/blocks/`
3. Register it in `src/components/BlockRenderer.astro`
4. Mark editable elements with `data-tina-field={tf(Astro.props, "fieldName")}` (and `tf(item, "field")` for list items). If a field uses `nameOverride`, pass the schema name.

## How click-to-edit works

- `src/lib/tina.ts` loads pages and posts through Tina's client and converts the result back to the file shape the components expect.
- `src/lib/islands.ts` lists the editable regions (page sections, blog articles). Each page wraps them in `<TinaIsland>`.
- `src/pages/tina-island/[name].ts` is the only on-demand route: it re-renders a region while someone types. Every other page is static HTML.
