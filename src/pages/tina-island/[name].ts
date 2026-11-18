// The one on-demand route: re-renders an editable region while someone types
// in the TinaCMS editor. Every other page is static HTML.
import type { APIRoute } from "astro";
import { experimental_createIslandRoute } from "@tinacms/astro/experimental";
import { islands } from "../../lib/islands";

export const prerender = false;
export const ALL: APIRoute = experimental_createIslandRoute(islands);
