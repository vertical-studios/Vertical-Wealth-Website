import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const CATEGORIES = ["Stewardship", "Planning", "Giving", "News"] as const;

// Content lives in /content so TinaCMS and Astro read the same files.
export const collections = {
  pages: defineCollection({
    loader: glob({ pattern: "*.json", base: "./content/pages" }),
  }),
  settings: defineCollection({
    loader: glob({ pattern: "*.json", base: "./content/settings" }),
  }),
  posts: defineCollection({
    loader: glob({ pattern: "*.md", base: "./content/posts" }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional().nullable(),
      author: z.string().default("Vertical Wealth"),
      category: z.enum(CATEGORIES),
      image: z.string().optional().nullable(),
      imageAlt: z.string().optional().nullable(),
      draft: z.boolean().default(false),
      faqs: z
        .array(z.object({ question: z.string(), answer: z.string() }))
        .optional()
        .nullable(),
    }),
  }),
};
