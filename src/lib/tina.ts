// Click-to-edit plumbing for TinaCMS.
//
// Pages and posts load through Tina's generated client so the editor can map
// every element back to its field. Tina returns GraphQL-shaped data (nulls,
// __typename, rich text as a document tree, schema field names), so the
// helpers below turn it back into the same shape the components already use
// for the JSON and Markdown files. Each object keeps its `_content_source`
// tag, which is what `tf()` reads to build the click-to-edit marker.
import { requestWithMetadata } from "@tinacms/astro/data";
import { tinaField } from "@tinacms/astro/tina-field";
import { serializeMDX } from "@tinacms/mdx";
import client from "../../tina/__generated__/client";

export const getPage = (slug: string) =>
  requestWithMetadata(client.queries.page({ relativePath: `${slug}.json` }), { priority: "primary" });

export const getPost = (slug: string) =>
  requestWithMetadata(client.queries.post({ relativePath: `${slug}.md` }), { priority: "primary" });

/** Click-to-edit marker for `data-tina-field`. Undefined (no attribute) when the data has no Tina tag. */
export const tf = (obj: any, field?: string, index?: number): string | undefined =>
  (obj && tinaField(obj, field as any, index)) || undefined;

// Fields saved under a different key in the files (Tina's `nameOverride`).
// Components read the file key; click-to-edit markers use the schema name.
const RENAMES: Record<string, Record<string, string>> = {
  imageText: { richBody: "body" },
  richText: { richBody: "body" },
  steps: { stepItems: "items" },
};
const ITEM_RENAMES: Record<string, Record<string, string>> = {};

const isRichText = (v: any) => v && typeof v === "object" && !Array.isArray(v) && v.type === "root";

function stripTags(v: any): any {
  if (Array.isArray(v)) return v.map(stripTags);
  if (v && typeof v === "object") {
    const out: any = {};
    for (const [k, x] of Object.entries(v)) if (k !== "_content_source") out[k] = stripTags(x);
    return out;
  }
  return v;
}

/** Rich-text tree back to markdown, so it renders through the same pipeline as the files. */
export function toMarkdown(v: any): string | undefined {
  if (typeof v === "string") return v;
  if (!isRichText(v)) return undefined;
  const md = serializeMDX(stripTags(v), { type: "rich-text", name: "body", templates: [] } as any, (u) => u);
  return typeof md === "string" ? md : undefined;
}

/** Drop nulls and __typename, keep `_content_source` tags, convert rich text. */
function clean(v: any): any {
  if (Array.isArray(v)) return v.filter((x) => x !== null && x !== undefined).map(clean);
  if (isRichText(v)) return toMarkdown(v);
  if (v && typeof v === "object") {
    const out: any = {};
    for (const [k, x] of Object.entries(v)) {
      if (x === null || x === undefined || k === "__typename") continue;
      out[k] = k === "_content_source" ? x : clean(x);
    }
    return out;
  }
  return v;
}

const templateOf = (typename = "") => {
  const t = typename.replace(/^PageBlocks/, "");
  return t.charAt(0).toLowerCase() + t.slice(1);
};

/** Page blocks from a Tina query, in the shape BlockRenderer expects (`_template`, file keys). */
export function toBlocks(page: any): any[] {
  return (page?.blocks ?? [])
    .filter(Boolean)
    .map((raw: any) => {
      const tpl = templateOf(raw.__typename);
      const b = clean(raw);
      for (const [from, to] of Object.entries(RENAMES[tpl] || {})) {
        if (from in b) {
          b[to] = b[from];
          delete b[from];
        }
      }
      const itemMap = ITEM_RENAMES[tpl];
      if (itemMap && Array.isArray(b.items)) {
        b.items = b.items.map((it: any) => {
          const o = { ...it };
          for (const [from, to] of Object.entries(itemMap)) if (from in o) { o[to] = o[from]; delete o[from]; }
          return o;
        });
      }
      b._template = tpl;
      return b;
    });
}

/** A post from a Tina query: frontmatter plus the body as markdown. */
export function toPost(post: any): any {
  if (!post) return undefined;
  return clean(post);
}
