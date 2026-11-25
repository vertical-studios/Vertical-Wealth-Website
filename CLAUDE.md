# CLAUDE.md: Vertical Wealth website

## The company

Vertical Wealth is a fiduciary, fee-based financial planning and investment firm in Indianapolis for Christian families and busy professionals who want their money to serve their family and the Kingdom. Brian Wheeler founded it at his dining room table to build a fee-based, holistic practice. Advice is grounded in biblical stewardship: clarity, confidence, calling.

- **Tagline:** Live boldly. Give generously. Leave a legacy.
- **Services:** wealth plan, portfolio management, estate planning, life goals blueprinting, risk management, business development and transitions, real estate services. Advisory fees are a percentage of assets managed (Form ADV on request).
- **Who it serves:** busy professionals (physicians, attorneys, executives), established stewards in their late 40s and 50s, couples nearing retirement, business owners in transition, and people who have lost a spouse.
- **Process:** a free 15-minute discovery call with Brian, then a deep dive, a clear plan and ongoing guidance. Transparent, educational, relational.
- **The funnel:** Weekly Lessons (one short email a week with scripture and one usable idea) is the first step for cold visitors; the discovery call (Book a Call, the header button) is the second.
- **Four stewardship principles:** God owns it all. Seek contentment, not just more. Live with an open hand. Your life is an adventure.
- **Advisors:** Brian Wheeler (Chief Vision Officer and Financial Planner, in the business since 2000) and Chris Herrmann (Wealth Advisor, 25+ years).
- **Client logins:** MoneyGuidePro (planning) and Schwab (accounts), in the strip above the header.
- **Contact:** info@verticalwealth.life, (317) 794-2148. The blog is called Insights.
- **Compliance:** this is a financial advisor's site. Never promise returns or outcomes, keep general content from reading as personal advice, and keep the footer disclosures and the disclosures, privacy and terms pages intact.

## Design and visual parameters

| Token | Hex | Role |
| --- | --- | --- |
| `--black` | #000000 | Text, header, footer, dark sections |
| `--white` | #FFFFFF | Default background |
| `--purple` | #663399 | Vertical Wealth's color: header and footer rules, tags, markers, link underlines, card top borders, accent sections |
| `--yellow` | #FCC602 | Buttons (black text), nav hover, footer headings, accents on dark |
| `--yellow-light` | #F4D75F | Only to highlight text on black |

- Calm and clear: white ground, black header and footer, purple accents, yellow buttons.
- Surfaces: `.on-white` (purple accents), `.on-black` and `.on-purple` (yellow accents, white text). Buttons hover to black, or to white on dark.
- Flat: no texture and no drop shadows. Cards (`.box`) have a 2px border and a 6px purple top border. Square corners.
- Photos in black and white (`.photo`).
- Fonts: Bebas Neue Pro from Adobe Fonts kit `xhb8qju` (licensed for verticalwealth.life, www.verticalwealth.life, *.vercel.app and localhost), Roboto from Google Fonts.

## Working notes

- Tina Cloud isn't connected yet, so `/admin` only works locally until `TINA_CLIENT_ID` and `TINA_TOKEN` are set in Vercel. The GTM ID (`PUBLIC_GTM_ID`) isn't set yet either.

<!-- VERTICAL FAMILY START: everything from here to VERTICAL FAMILY END is identical in all four site repos. Change it in one, copy it to the other three. -->

## The Vertical family

Vertical Life is a Kingdom-minded organization that builds and runs companies so people can live faith, purpose and work as one, Monday through Sunday. Its home is the Atrium, a coworking building near Carmel, Indiana. Three companies sit under it, each with its own site:

| Site | What it is | Repo (GitHub org `vertical-studios`) | Live build | Future domain |
| --- | --- | --- | --- | --- |
| Vertical Life | Parent organization and the Atrium coworking space | Vertical-Life-Website | vertical-life-website.vercel.app | thevertical.life |
| Vertical Immersive | Two-year, Christ-centered immersive program for young adults | Vertical-Immersive-Website (private) | vertical-immersive-website.vercel.app | verticalimmersive.life |
| Vertical Wealth | Fiduciary, fee-based financial planning | Vertical-Wealth-Website | vertical-wealth-website.vercel.app | www.verticalwealth.life |
| Vertical Studios | Full-service marketing team, senior-led and apprentice-powered | Vertical-Studios-Website | vertical-studios-website.vercel.app | www.verticalstudios.life |

The companies feed each other: Studios' apprentices are Immersive students, Studios runs marketing for the whole family, and everyone works out of the Atrium. The domains still serve the old Squarespace sites until each site's images are moved off Squarespace.

**Shared across all four**
- Name: the parent is "Vertical Life", never "The Vertical Life".
- Leadership: Brian Wheeler, Chief Vision Officer. Susan Rozzi, Chief Executive Officer. Kaitlyn Smith, Chief Operating Officer.
- The five Vertical values: Intention, Service, Innovation, Transformation, Achievement.
- The family verse is Ephesians 3:20, "immeasurably more than all we ask or imagine". Taglines riff on it.
- Voice: human, warm, direct and confident. Faith is stated plainly, never as decoration. No hype, filler or generic marketing language, and no em dashes or en dashes anywhere. Every page ends with a clear next step.
- Labels (nav, dropdowns, footer links and headings, buttons, card links, hero eyebrows) are Title Case: "Book a Call", "How We Work", with a, an, the, and, or, for, of and to lowercase unless first. Headlines and body copy are sentence case.

## Shared design system

Every site uses the same layout, type and components. Only colors, textures and names change per site (see the site section above).

- **Type:** Bebas Neue Pro for headings, labels, buttons and nav (weight 600, -0.02em tracking, line height 0.95, mixed case, headlines up to about six words). Roboto for body text at 18px with 1.6 line height. Each site loads Bebas from its own Adobe Fonts kit.
- **Type scale** (`--fs-*` tokens): h1 80px desktop and 52px phone, h2 60px and 40px, h3 34px and 28px, card titles 30px, lede about 21px, pull quotes and verses up to 51px, big stats up to 64px, buttons and nav 24px, small text about 15px.
- **Layout:** 1240px content width, 16 to 40px side gutters, 64 to 112px section padding. Square corners (Immersive's cards keep a 3px radius).
- **Header:** black bar, 84px tall, 4px bottom rule in the site's brand color, 210px logo on the left, 24px nav with flat dropdowns, the header button on the right. Full nav at 1241px and up; phone menu at 1240px and below. An optional thin strip above it holds client logins.
- **Buttons:** 52px tall, square, 24px Bebas label, 2px border. Primary is a solid fill; secondary is an outline in the text color. On hover the fill inverts. One style on every site.
- **Footer:** black, with a 4px top rule in the brand color. Columns: logo, tagline and verse; contact details with the header button; link columns. Then a row of family logos ("Part of Vertical Life"), then copyright, social and legal links, and disclosures where a site needs them.
- **Surfaces:** each section sets `--bg --fg --accent --accent-ink --line` through a surface class, so blocks look right on any background without one-off overrides.
- **Shared colors:** black #000000, white #FFFFFF, Bold Yellow #FCC602 (the Vertical Life anchor) and Light Yellow #F4D75F (text highlights on black only). Vertical Life itself is black and yellow; each company adds its own color (Immersive two greens, Wealth purple, Studios red). No gray as a color, and no gradients beyond the faint metallic sheen under the grain texture on Life and Studios.

## Stack and commands

Astro 7 (static, `build.format: "file"`) with TinaCMS 3 click-to-edit, deployed on Vercel. Content is files in the repo, so every edit (person, Tina or AI) is a Git commit and can be rolled back.

```bash
npm install
npm run dev          # site + editor at localhost:4321/admin
npm run build        # scripts/build.mjs: tinacms build (local mode without TINA_TOKEN)
npm run check        # after a build: banned phrases, internal links, SEO basics, JSON-LD
npx tinacms audit    # content against the Tina schema
PORT=4321 HOST=127.0.0.1 node dist/server/entry.mjs   # serve the built site
```

- Pages load content through Tina's client, so Astro must run inside `tinacms`. `astro dev` on its own breaks pages.
- The local server 404s a route when both `x.html` and `x/` exist (for example `/blog`). Open `/blog.html` locally; Vercel serves `/blog` fine.
- Cloud sandboxes usually block Adobe Fonts, Squarespace images and `*.vercel.app`. Screenshots there show fallback fonts and broken images. Verify deploys with the Vercel MCP tools (`get_deployment`, `web_fetch_vercel_url`).

## Where things live

- `content/pages/*.json`: one file per page. `blocks` is the ordered list of sections; `_template` names the block. These files are the source of truth for prices, names and numbers.
- `content/posts/*.md`: blog posts (frontmatter plus Markdown).
- `content/settings/site.json`: site name, logos, header nav, header button, footer, contact details, family logos, social and legal links.
- `tina/config.ts`: schema for pages, blocks and posts. `tina/family-settings.ts`: the Site settings fields (shared).
- `src/components/blocks/`: one component per block template, registered in `src/components/BlockRenderer.astro`.
- `src/styles/family.css` (shared layout, type and buttons) loads first, then `src/styles/global.css` (this site's colors and textures only).
- `src/lib/tina.ts`, `src/lib/islands.ts`, `src/pages/tina-island/[name].ts`: click-to-edit plumbing. `tina-island` is the only on-demand route.
- `vercel.json`: redirects and headers. Add a redirect whenever a URL changes.

To add a block: add a template in `tina/config.ts`, a component in `src/components/blocks/`, register it in `BlockRenderer.astro`, and mark every editable element with `data-tina-field={tf(Astro.props, "field")}` (`tf(item, "field")` for list items).

## Family shell: keep it identical

These files are byte-identical in all four repos: `src/styles/family.css`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/Buttons.astro`, `tina/family-settings.ts`, `scripts/check.mjs`, and this family block of CLAUDE.md.

- They own everything in "Shared design system" above. A site changes only colors and textures, through tokens in its `global.css` (`--btn-*`, `--hdr-*`, `--ftr-*` and its surface classes). Blocks size text with the `--fs-*` tokens, never raw sizes.
- Never restyle the header, footer, buttons or type scale inside one site. If the shell has to change, change it here, copy the file to the other three repos, confirm with `md5sum`, and ship all four together. If the sibling repos aren't in this session, finish here and tell the user exactly which files still need syncing.
- Site-only banned phrases and allowed exceptions for `npm run check` go in `scripts/check.config.json`, not in `check.mjs`.

## Before you push

1. `npm run build && npm run check && npx tinacms audit` all pass.
2. Look at every changed page at 1440px and 390px (Playwright is available in cloud sessions): no horizontal scroll, header and footer intact.
3. One logical change per commit, with a message that says what changed and why.

Pushing `main` deploys production in about a minute. Push only when the user asks.

<!-- VERTICAL FAMILY END -->
