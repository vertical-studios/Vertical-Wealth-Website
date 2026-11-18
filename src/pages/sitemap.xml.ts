import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getPosts, postUrl } from "../lib/posts";

const SITE = "https://www.verticalwealth.life";

export const GET: APIRoute = async () => {
  const pages = (await getCollection("pages")).filter((p: any) => !p.data.noindex);
  const posts = await getPosts();
  const urls = [
    ...pages.map((p) => ({ loc: p.id === "home" ? `${SITE}/` : `${SITE}/${p.id}`, priority: p.id === "home" ? "1.0" : "0.8" })),
    { loc: `${SITE}/blog`, priority: "0.7" },
    ...posts.map((p) => ({ loc: `${SITE}${postUrl(p)}`, lastmod: (p.data.updated || p.data.date).toISOString().slice(0, 10), priority: "0.6" })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u: any) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}<priority>${u.priority}</priority></url>`)
  .join("\n")}
</urlset>`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
};
