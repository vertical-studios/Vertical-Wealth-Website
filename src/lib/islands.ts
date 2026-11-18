// Editable regions the TinaCMS editor can refresh while someone types.
// Each entry: how to load the document, which component renders it, and the
// wrapper element (must match the <TinaIsland> on the page).
import type { IslandRegistry } from "@tinacms/astro/experimental";
import PageBody from "../components/islands/PageBody.astro";
import PostArticle from "../components/islands/PostArticle.astro";
import { getPage, getPost, toPost } from "./tina";

const wrapper = { tag: "div", className: "tina-island" };

export const islands: IslandRegistry = {
  page: {
    fetch: (_request, params) => getPage(params.get("slug") || "home"),
    component: PageBody,
    wrapper,
    propsFromData: (result: any) => ({ page: result?.data?.page }),
  },
  post: {
    fetch: (_request, params) => getPost(params.get("slug") || ""),
    component: PostArticle,
    wrapper,
    propsFromData: (result: any) => {
      const post = toPost(result?.data?.post);
      return { post, body: post?.body || "" };
    },
  },
};
