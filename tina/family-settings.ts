// VERTICAL FAMILY SHELL: shared Site settings fields, identical in every site repo.
// The header and footer read these, so every site edits its nav, button, contact details
// and footer the same way.

// Shown under every nav, button and header label in the editor so new ones stay in Title Case.
export const TITLE_CASE = "Use Title Case, e.g. Book a Call or How We Work. Keep a, an, the, and, or, for, of and to lowercase unless they come first.";

const link = (name: string, label: string, extra: any[] = []) => ({
  type: "object" as const, name, label, list: true,
  ui: { itemProps: (i: any) => ({ label: i?.label || "Link" }) },
  fields: [
    { type: "string" as const, name: "label", label: "Label", required: true, description: TITLE_CASE },
    { type: "string" as const, name: "href", label: "Link", required: true },
    ...extra,
  ],
});

export const settingsFields: any[] = [
  { type: "string", name: "siteName", label: "Site name (logo text, copyright)" },
  { type: "image", name: "logo", label: "Header logo (light version for the dark bar)" },
  { type: "image", name: "logoStacked", label: "Footer logo (leave empty to reuse the header logo)" },
  { type: "image", name: "favicon", label: "Favicon" },
  { type: "image", name: "ogImage", label: "Default social share image" },
  {
    type: "object", name: "nav", label: "Header navigation", list: true,
    ui: { itemProps: (i: any) => ({ label: i?.label || "Menu item" }) },
    fields: [
      { type: "string", name: "label", label: "Label", required: true, description: TITLE_CASE },
      { type: "string", name: "href", label: "Link (for a single link)" },
      link("links", "Dropdown links", [{ type: "string" as const, name: "section", label: "Column heading (optional)", description: TITLE_CASE }]),
    ],
  },
  { type: "string", name: "utilityLabel", label: "Top strip label (e.g. Client Login)", description: TITLE_CASE },
  link("clientLogins", "Top strip links (optional; shows a thin strip above the header)"),
  { type: "object", name: "navCta", label: "Header button", fields: [
    { type: "string", name: "label", label: "Label", description: TITLE_CASE },
    { type: "string", name: "short", label: "Short label for phones", description: TITLE_CASE },
    { type: "string", name: "href", label: "Link" },
  ] },
  { type: "string", name: "tagline", label: "Footer tagline" },
  { type: "string", name: "verse", label: "Footer verse (optional)" },
  { type: "string", name: "contactHeading", label: "Footer contact heading (e.g. Talk With Us)", description: TITLE_CASE },
  { type: "string", name: "locationNote", label: "Footer location note (optional)" },
  { type: "string", name: "address", label: "Address" },
  { type: "string", name: "phone", label: "Phone" },
  { type: "string", name: "email", label: "Email" },
  link("footerActions", "Extra footer links under the button (optional)"),
  link("footerLinks", "Footer link columns", [{ type: "string" as const, name: "section", label: "Column heading", description: TITLE_CASE }]),
  { type: "string", name: "familyHeading", label: "Footer family heading (e.g. Part of Vertical Life)", description: TITLE_CASE },
  link("family", "Family logos", [{ type: "image" as const, name: "logo", label: "Logo (light version)" }]),
  link("social", "Social links"),
  link("legal", "Legal links"),
  { type: "string", name: "disclosures", label: "Footer disclosures (one paragraph per item)", list: true, ui: { component: "textarea" } },
];
