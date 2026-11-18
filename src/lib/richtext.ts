// TinaCMS stores rich text in JSON files as markdown. Render it to HTML at
// build time (zero client JS). Top-level "#" headings are demoted so each page
// keeps a single <h1>.
import { marked } from "marked";

marked.use({
  gfm: true,
  renderer: {
    heading({ tokens, depth }) {
      const level = Math.max(2, depth);
      return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>`;
    },
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const ext = /^https?:/.test(href);
      return `<a href="${href}"${title ? ` title="${title}"` : ""}${ext ? ' target="_blank" rel="noopener"' : ""}>${text}</a>`;
    },
  },
});

export function richText(md?: string | null): string {
  if (!md || typeof md !== "string") return "";
  const html = marked.parse(md, { async: false }) as string;
  // Same treatment as blog tables (astro.config.mjs): a focusable scroll box.
  return html
    .replace(/<table>/g, '<div class="table-scroll" role="region" tabindex="0" aria-label="Table"><table>')
    .replace(/<\/table>/g, "</table></div>");
}

// Plain text for JSON-LD (FAQPage answers etc.): strip tags and decode the
// entities marked emits, so Google sees "don't", not "don&#39;t".
const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
export function plainText(md?: string | null): string {
  return richText(md)
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e: string) => {
      if (e[0] === "#") {
        const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : m;
      }
      return ENTITIES[e.toLowerCase()] ?? m;
    })
    .replace(/\s+/g, " ")
    // Tags become spaces above, so "<a>call</a>." would read "call ." here.
    .replace(/ ([.,;:!?)])/g, "$1")
    .trim();
}
