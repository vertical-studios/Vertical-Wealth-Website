import { defineConfig } from "astro/config";
// Astro's built-in Markdown processor (a pinned dependency of astro itself).
import { satteri } from "@astrojs/markdown-satteri";
import tina from "@tinacms/astro/integration";
import { tinaAdminDevRedirect } from "@tinacms/astro/vite";

// Every page is prerendered to static HTML. The one on-demand route is
// /tina-island, which re-renders a section while someone edits in TinaCMS.
// Vercel builds get the Vercel adapter (one small serverless function);
// local builds use the Node adapter so `astro preview` still works.
async function adapter() {
  if (process.env.VERCEL) return (await import("@astrojs/vercel")).default();
  return (await import("@astrojs/node")).default({ mode: "standalone" });
}

// Blog tables scroll sideways on phones. Wrap each one in a labelled,
// focusable region so keyboard users can scroll it too, and turn an empty
// header cell (the blank top-left corner) into a plain cell, since screen
// readers announce empty headers as nothing.
const accessibleTables = {
  name: "accessible-tables",
  element: [
    {
      filter: ["th"],
      visit(node, ctx) {
        if (!ctx.textContent(node).trim()) ctx.setField(node, "tagName", "td");
      },
    },
    {
      filter: ["table"],
      visit(node, ctx) {
        const firstRow = ctx.textContent(node).trim() ? findFirstRow(node) : null;
        const heads = firstRow
          ? firstRow.children.filter((c) => c.type === "element").map((c) => ctx.textContent(c).trim()).filter(Boolean)
          : [];
        const label = heads.length ? `Table: ${heads.join(", ")}`.slice(0, 100) : "Table";
        ctx.wrapNode(node, {
          type: "element",
          tagName: "div",
          properties: { className: ["table-scroll"], role: "region", tabIndex: 0, ariaLabel: label },
          children: [],
        });
      },
    },
  ],
};
function findFirstRow(node) {
  for (const c of node.children || []) {
    if (c.type !== "element") continue;
    if (c.tagName === "tr") return c;
    const r = findFirstRow(c);
    if (r) return r;
  }
  return null;
}

export default defineConfig({
  site: "https://www.verticalwealth.life",
  trailingSlash: "never",
  build: { format: "file" },
  prefetch: { prefetchAll: true },
  markdown: { processor: satteri({ hastPlugins: [accessibleTables] }) },
  output: "static",
  adapter: await adapter(),
  integrations: [tina()],
  vite: {
    plugins: [tinaAdminDevRedirect()],
    // Bundle Tina's Astro helpers into the server build so the editing
    // route doesn't recompile them on a cold start.
    ssr: { noExternal: ["@tinacms/astro", "@tinacms/bridge"] },
  },
});
