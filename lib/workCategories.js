// Work categories shown on /works. A project's free-text `category` is mapped
// onto one of these, so older entries ("Web App", "Branding", ...) still land
// in the right place.

export const WORK_CATEGORIES = [
  {
    slug: "graphic-design",
    label: "Graphic Design",
    blurb: "Brand identity, logos, posters and visual systems.",
    keywords: ["graphic", "brand", "logo", "identity", "poster", "illustrat", "print", "visual", "ui/ux", "ux", "ui design", "figma", "design"],
  },
  {
    slug: "websites",
    label: "Websites",
    blurb: "Marketing sites, web apps and dashboards.",
    keywords: ["website", "web", "landing", "saas", "dashboard", "frontend", "front-end", "full stack", "fullstack", "cms", "e-commerce", "ecommerce", "next", "react"],
  },
  {
    slug: "mobile-app",
    label: "Mobile App",
    blurb: "iOS and Android apps, built to feel native.",
    keywords: ["mobile", "android", "ios", "iphone", "flutter", "react native", "kotlin", "swift"],
  },
  {
    slug: "others",
    label: "Others",
    blurb: "Experiments, tools and everything in between.",
    keywords: [],
  },
];

const BY_SLUG = Object.fromEntries(WORK_CATEGORIES.map((c) => [c.slug, c]));

export function getCategory(slug) {
  return BY_SLUG[slug] ?? null;
}

/** Map a project's category text to a category slug. */
export function categorize(text = "") {
  const t = String(text).toLowerCase().trim();
  if (!t) return "others";

  // Exact label or slug match first (what the admin dropdown saves)
  for (const c of WORK_CATEGORIES) {
    if (t === c.label.toLowerCase() || t === c.slug) return c.slug;
  }
  // Mobile before web, so "React Native" / "Mobile web app" go to Mobile App
  if (t === "app" || t === "apps") return "mobile-app";
  for (const slug of ["mobile-app", "graphic-design", "websites"]) {
    if (BY_SLUG[slug].keywords.some((k) => t.includes(k))) return slug;
  }
  return "others";
}
