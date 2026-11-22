import { defineConfig, type Template } from "tinacms";
import { settingsFields, TITLE_CASE } from "./family-settings";

// ---------------------------------------------------------------------------
// BLOCK LIBRARY (Vertical Wealth)
// Apprentices build pages by stacking these approved sections. They edit the
// words, images and links inside each block, but cannot break the layout.
// To add a block: add a template here, a component in src/components/blocks/,
// register it in src/components/BlockRenderer.astro, and mark its editable
// elements with data-tina-field (see README).
//
// All blocks share one GraphQL union, so a field name must have the same type
// in every block. Where a block needs a different type under the same JSON key,
// give it a unique `name` and keep the key with `nameOverride`.
// ---------------------------------------------------------------------------

const tone = (options = ["white", "black", "purple"]) => ({
  type: "string" as const, name: "tone", label: "Background (white unless set)", options,
});
const anchor = { type: "string" as const, name: "anchor", label: "Jump link name (optional, e.g. estate)" };
const button = {
  type: "object" as const, name: "buttons", label: "Buttons", list: true,
  ui: { itemProps: (i: any) => ({ label: i?.label || "Button" }) },
  fields: [
    { type: "string" as const, name: "label", label: "Label", required: true, description: TITLE_CASE },
    { type: "string" as const, name: "href", label: "Link (e.g. /book-a-call)", required: true },
    { type: "string" as const, name: "style", label: "Style", options: ["primary", "secondary"] },
  ],
};

const hero: Template = {
  name: "hero", label: "Hero (top of page)",
  ui: { defaultItem: { headline: "New headline", buttons: [] } },
  fields: [
    { type: "string", name: "eyebrow", label: "Small purple tag above the headline", description: TITLE_CASE },
    { type: "string", name: "headline", label: "Headline (six words or fewer)", required: true },
    { type: "string", name: "body", label: "Intro text", ui: { component: "textarea" } },
    { type: "image", name: "image", label: "Photo (shown in black and white)" },
    { type: "string", name: "imageAlt", label: "Photo description (for SEO and screen readers)" },
    button,
  ],
};
const imageText: Template = {
  name: "imageText", label: "Image + text",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "rich-text", name: "richBody", nameOverride: "body", label: "Body", description: "For a quote, use the Quotes or Scripture block instead of a quote here." },
    { type: "string", name: "bullets", label: "Bullet points", list: true },
    { type: "image", name: "image", label: "Photo (shown in black and white)" },
    { type: "string", name: "imageAlt", label: "Photo description (for SEO and screen readers)" },
    { type: "string", name: "imageSide", label: "Photo side", options: ["right", "left"] },
    tone(), anchor, button,
  ],
};
const cards: Template = {
  name: "cards", label: "Cards (2 to 5 side by side)",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "body", label: "Intro text", ui: { component: "textarea" } },
    {
      type: "object", name: "items", label: "Cards", list: true,
      ui: { itemProps: (i: any) => ({ label: i?.title || "Card" }) },
      fields: [
        { type: "image", name: "image", label: "Image or logo (optional)" },
        { type: "string", name: "imageAlt", label: "Image description" },
        { type: "boolean", name: "imageIsLogo", label: "This image is a logo (keep its colors, show it small)" },
        { type: "string", name: "eyebrow", label: "Small label above the title" },
        { type: "string", name: "title", label: "Title", required: true },
        { type: "string", name: "body", label: "Text (markdown allowed)", ui: { component: "textarea" } },
        { type: "string", name: "linkLabel", label: "Link label", description: TITLE_CASE },
        { type: "string", name: "linkHref", label: "Link (e.g. /services)" },
      ],
    },
    { type: "string", name: "style", label: "Card style", options: ["boxed", "plain"] },
    tone(), anchor, button,
  ],
};
const richText: Template = {
  name: "richText", label: "Text section",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "rich-text", name: "richBody", nameOverride: "body", label: "Body", description: "For a quote, use the Quotes or Scripture block instead of a quote here." },
    tone(), anchor, button,
  ],
};
const video: Template = {
  name: "video", label: "YouTube video",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "body", label: "Intro text", ui: { component: "textarea" } },
    { type: "string", name: "youtubeId", label: "YouTube video ID (the part after watch?v=)", required: true },
    { type: "string", name: "videoTitle", label: "Video title (for screen readers)" },
    tone(),
  ],
};
const ctaBanner: Template = {
  name: "ctaBanner", label: "Call-to-action banner",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "body", label: "Text", ui: { component: "textarea" } },
    tone(["purple", "black", "white"]), button,
  ],
};
const faq: Template = {
  name: "faq", label: "FAQ (questions and answers)",
  ui: { defaultItem: { heading: "Questions", items: [] } },
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "body", label: "Intro text", ui: { component: "textarea" } },
    {
      type: "object", name: "items", label: "Questions", list: true,
      ui: { itemProps: (i: any) => ({ label: i?.question || "Question" }) },
      fields: [
        { type: "string", name: "question", label: "Question", required: true },
        { type: "string", name: "answer", label: "Answer (markdown allowed, e.g. [link](/book-a-call))", ui: { component: "textarea" }, required: true },
      ],
    },
    tone(), anchor, button,
  ],
};
const embed: Template = {
  name: "embed", label: "HighLevel form or calendar",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "body", label: "Text beside the form", ui: { component: "textarea" } },
    { type: "string", name: "kind", label: "Type", options: ["form", "booking"], required: true },
    { type: "string", name: "widgetId", label: "HighLevel widget ID", description: "The ID at the end of the HighLevel embed URL", required: true },
    { type: "number", name: "height", label: "Height in px (default 720)" },
    tone(), anchor,
  ],
};
const testimonials: Template = {
  name: "testimonials", label: "Client stories",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "note", label: "Small print under the stories (required)", ui: { component: "textarea" }, description: "Stories speak to character, faith and family growth, never investment performance. Say whether each person is a current client and whether they were paid. Get compliance sign-off before publishing." },
    {
      type: "object", name: "items", label: "Quotes", list: true,
      ui: { itemProps: (i: any) => ({ label: i?.name || "Quote" }) },
      fields: [
        { type: "string", name: "quote", label: "Quote", ui: { component: "textarea" } },
        { type: "string", name: "name", label: "Name" },
        { type: "string", name: "role", label: "Role or company" },
      ],
    },
    tone(),
  ],
};
const verse: Template = {
  name: "verse", label: "Scripture or pull quote",
  fields: [
    { type: "string", name: "text", label: "Text", ui: { component: "textarea" } },
    { type: "string", name: "reference", label: "Reference (e.g. Ephesians 3:20)" },
    tone(),
  ],
};
const stats: Template = {
  name: "stats", label: "Numbers row",
  fields: [
    {
      type: "object", name: "items", label: "Numbers", list: true,
      ui: { itemProps: (i: any) => ({ label: `${i?.value || ""} ${i?.label || ""}` }) },
      fields: [
        { type: "string", name: "value", label: "Big number (e.g. 15)" },
        { type: "string", name: "label", label: "Label" },
      ],
    },
    tone(),
  ],
};
const steps: Template = {
  name: "steps", label: "Numbered steps",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "body", label: "Intro text", ui: { component: "textarea" } },
    { type: "string", name: "stepItems", nameOverride: "items", label: "Steps (in order)", list: true },
    tone(), button,
  ],
};
const postList: Template = {
  name: "postList", label: "Latest blog posts",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "category", label: "Only this category (optional)", options: ["Stewardship", "Planning", "Giving", "News"] },
    { type: "number", name: "limit", label: "How many (default 3)" },
    tone(),
  ],
};

const blockTemplates = [hero, imageText, cards, richText, video, ctaBanner, faq, embed, testimonials, verse, stats, steps, postList];
const link = (name: string, label: string, extra: any[] = []) => ({
  type: "object" as const, name, label, list: true,
  ui: { itemProps: (i: any) => ({ label: i?.label || "Link" }) },
  fields: [
    { type: "string" as const, name: "label", label: "Label", required: true, description: TITLE_CASE },
    { type: "string" as const, name: "href", label: "Link", required: true },
    ...extra,
  ],
});

export default defineConfig({
  branch: process.env.TINA_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main",
  // Set TINA_CLIENT_ID and TINA_TOKEN in Vercel once the Tina Cloud project exists.
  clientId: process.env.TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,
  build: { outputFolder: "admin", publicFolder: "public" },
  media: { tina: { mediaRoot: "uploads", publicFolder: "public" } },
  schema: {
    collections: [
      {
        name: "page", label: "Pages", path: "content/pages", format: "json",
        ui: { router: ({ document }) => (document._sys.filename === "home" ? "/" : `/${document._sys.filename}`) },
        fields: [
          { type: "string", name: "title", label: "Page title (browser tab + Google)", required: true, isTitle: true },
          { type: "string", name: "description", label: "Meta description (what Google shows, about 155 characters)", ui: { component: "textarea" } },
          { type: "boolean", name: "noindex", label: "Hide from Google" },
          { type: "object", name: "blocks", label: "Sections", list: true, templates: blockTemplates },
        ],
      },
      {
        name: "post", label: "Blog posts", path: "content/posts", format: "md",
        ui: { router: ({ document }) => `/blog/${document._sys.filename}` },
        defaultItem: () => ({ date: new Date().toISOString(), author: "Vertical Wealth", draft: true }),
        fields: [
          { type: "string", name: "title", label: "Title (also the Google headline)", required: true, isTitle: true },
          { type: "string", name: "description", label: "Summary (Google snippet, about 155 characters)", ui: { component: "textarea" }, required: true },
          { type: "datetime", name: "date", label: "Publish date", required: true },
          { type: "datetime", name: "updated", label: "Last updated (optional)" },
          { type: "string", name: "author", label: "Author" },
          { type: "string", name: "category", label: "Category", options: ["Stewardship", "Planning", "Giving", "News"], required: true },
          { type: "image", name: "image", label: "Cover image" },
          { type: "string", name: "imageAlt", label: "Cover image description" },
          { type: "boolean", name: "draft", label: "Draft (hidden from the site)", description: "Posts inform; they never give individual advice. The general-information disclosure prints under every post." },
          {
            type: "object", name: "faqs", label: "FAQs (optional)", list: true,
            ui: { itemProps: (i: any) => ({ label: i?.question || "Question" }) },
            fields: [
              { type: "string", name: "question", label: "Question", required: true },
              { type: "string", name: "answer", label: "Answer", ui: { component: "textarea" }, required: true },
            ],
          },
          { type: "rich-text", name: "body", label: "Article", isBody: true },
        ],
      },
      {
        name: "settings", label: "Site settings (nav, footer)", path: "content/settings", format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: settingsFields,
      },
    ],
  },
});
