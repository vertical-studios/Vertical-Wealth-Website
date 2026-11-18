import type { APIRoute } from "astro";

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: https://www.verticalwealth.life/sitemap.xml\n`, {
    headers: { "Content-Type": "text/plain" },
  });
