// VERTICAL FAMILY SHELL: site checks, identical in every site repo.
// Run after `npm run build`:  npm run check
// Checks the built HTML for banned phrases, broken internal links, SEO basics and
// JSON-LD. Site-specific phrases and known exceptions live in scripts/check.config.json.
// Exits 1 if anything fails, so it can gate a push.
import fs from "node:fs";
import path from "node:path";

const dist = fs.existsSync("dist/client") ? "dist/client" : "dist";
if (!fs.existsSync(dist)) { console.error("No build found. Run `npm run build` first."); process.exit(1); }
const cfg = JSON.parse(fs.readFileSync("scripts/check.config.json", "utf8"));
const redirects = new Set((JSON.parse(fs.readFileSync("vercel.json", "utf8")).redirects || []).map((r) => r.source));

// Rules every Vertical site shares. Add site-only phrases to check.config.json, not here.
const FAMILY_BANNED = [
  "\u2014", "\u2013",                                   // em and en dashes
  "\\bthe vertical life\\b",                           // the parent is "Vertical Life", no article
  "college alternative", "alternative to college", "instead of college",
];
const banned = new RegExp([...FAMILY_BANNED, ...(cfg.banned || [])].join("|"), "gi");
const allow = (cfg.allow || []).map((a) => ({ page: a.page, re: new RegExp(a.pattern, "i"), why: a.why }));

const files = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== "_astro") walk(p); } else files.push(path.relative(dist, p));
  }
};
walk(dist);
const html = files.filter((f) => f.endsWith(".html"));
const routes = new Set(files.map((f) => "/" + f.replace(/\\/g, "/")));
for (const f of html) {
  const r = "/" + f.replace(/\\/g, "/").replace(/\.html$/, "").replace(/(^|\/)index$/, "");
  routes.add(r === "" ? "/" : r.replace(/\/$/, "") || "/");
}

const unescape = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
let fail = 0;
const out = (label, lines) => {
  console.log(`== ${label}: ${lines.length ? lines.length + " issue(s)" : "ok"}`);
  lines.slice(0, 40).forEach((l) => console.log("  " + l));
  if (lines.length > 40) console.log(`  ...and ${lines.length - 40} more`);
};

// 1. Banned phrases in visible text and meta (skips scripts, styles and the footer's required disclosures)
const phraseHits = [];
const titles = new Map(), descs = new Map(), seo = [], ld = [];
const broken = new Map(), viaRedirect = new Map();
for (const f of html) {
  if (f.startsWith("admin")) continue;
  const raw = fs.readFileSync(path.join(dist, f), "utf8");
  const s = raw.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "").replace(/<div class="wrap disc"[\s\S]*?<\/div>/g, "");
  const attrs = [...s.matchAll(/(?:content|alt|title|aria-label)="([^"]*)"/g)].map((m) => m[1]).join(" ");
  const text = unescape(s.replace(/<[^>]+>/g, " ") + " " + attrs).replace(/\s+/g, " ");
  for (const m of text.matchAll(banned)) {
    const near = text.slice(Math.max(0, m.index - 50), m.index + m[0].length + 40);
    if (allow.some((a) => (a.page === f || a.page === "*") && a.re.test(near))) continue;
    phraseHits.push(`${f}: "${m[0]}" in ...${near.trim()}...`);
  }

  // 2. Internal links
  for (const m of raw.matchAll(/href="(\/[^"#?]*)/g)) {
    let h = m[1].replace(/\/$/, "") || "/";
    if (h.startsWith("/_astro") || routes.has(h) || routes.has(decodeURI(h))) continue;
    const bucket = redirects.has(h) ? viaRedirect : broken;
    if (!bucket.has(h)) bucket.set(h, new Set());
    bucket.get(h).add(f);
  }

  // 3. SEO basics (pages marked noindex are skipped)
  if (/name="robots" content="noindex/.test(raw)) continue;
  const title = unescape((raw.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "");
  const desc = unescape((raw.match(/name="description" content="([^"]*)"/) || [])[1] || "");
  const h1s = (raw.match(/<h1[\s>]/g) || []).length;
  titles.set(title, [...(titles.get(title) || []), f]);
  descs.set(desc, [...(descs.get(desc) || []), f]);
  if (h1s !== 1) seo.push(`${f}: ${h1s} h1 tags (want 1)`);
  if (title.length < 25 || title.length > 70) seo.push(`${f}: title is ${title.length} characters (want 25 to 70)`);
  if (desc.length < 100 || desc.length > 165) seo.push(`${f}: description is ${desc.length} characters (want 100 to 165)`);
  for (const m of raw.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { ld.push(`${f}: invalid JSON-LD (${e.message.slice(0, 60)})`); }
  }
}
for (const [t, fs_] of titles) if (fs_.length > 1) seo.push(`duplicate title "${t}" on ${fs_.join(", ")}`);
for (const [d, fs_] of descs) if (fs_.length > 1) seo.push(`duplicate description "${d.slice(0, 50)}..." on ${fs_.join(", ")}`);

const brokenLines = [...broken].map(([h, s]) => `${h} <- ${[...s].slice(0, 4).join(", ")}`);
const redirLines = [...viaRedirect].map(([h, s]) => `${h} (redirects; link to the final URL) <- ${[...s].slice(0, 4).join(", ")}`);

out("banned phrases", phraseHits);
out(`internal links (${html.length} pages)`, brokenLines);
out("links that go through a redirect (warning only)", redirLines);
out("SEO basics", seo);
out("JSON-LD", ld);
fail = phraseHits.length + brokenLines.length + seo.length + ld.length;
console.log(fail ? `\nFAILED: ${fail} issue(s)` : "\nAll checks passed");
process.exit(fail ? 1 : 0);
