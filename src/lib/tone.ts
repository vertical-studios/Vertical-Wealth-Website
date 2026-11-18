// Section background: white (default), black or purple. Each class sets the surface tokens in global.css.
export const toneClass = (tone?: string) => (tone === "black" ? "on-black" : tone === "purple" ? "on-purple" : "on-white");
