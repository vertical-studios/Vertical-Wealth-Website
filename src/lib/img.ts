// Squarespace's CDNs can resize on the fly. Once images move into /public/uploads
// (see README), these helpers simply pass local paths through.
// Some imported posts point at http:// URLs; always serve https so pages never
// load mixed content.
const SQUARESPACE = /^(https?:)?\/\/(images\.squarespace-cdn\.com|static1\.squarespace\.com)\//;

export function sized(src?: string, width = 1500): string {
  if (!src) return "";
  if (SQUARESPACE.test(src)) {
    return `${src.split("?")[0].replace(/^(https?:)?\/\//, "https://")}?format=${width}w`;
  }
  return src;
}

export function srcset(src?: string): string | undefined {
  if (!src || !SQUARESPACE.test(src)) return undefined;
  return [500, 750, 1000, 1500, 2500].map((w) => `${sized(src, w)} ${w}w`).join(", ");
}
