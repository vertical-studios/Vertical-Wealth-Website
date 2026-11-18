import type { APIRoute } from "astro";
import { getPosts, postUrl } from "../lib/posts";

const SITE = "https://www.verticalwealth.life";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.data.title)}</title>
      <link>${SITE}${postUrl(p)}</link>
      <guid>${SITE}${postUrl(p)}</guid>
      <pubDate>${p.data.date.toUTCString()}</pubDate>
      <category>${esc(p.data.category)}</category>
      <description>${esc(p.data.description)}</description>
    </item>`
    )
    .join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Vertical Wealth Insights</title>
    <link>${SITE}/blog</link>
    <description>Straight answers about calling, careers, faith and the path after high school, for students and parents.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>`;
  return new Response(body, { headers: { "Content-Type": "application/rss+xml" } });
};
