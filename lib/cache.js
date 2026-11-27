import { revalidateTag } from "next/cache";
import { after } from "next/server";
import { headers } from "next/headers";
import { WORK_CATEGORIES } from "@/lib/workCategories";

// Cache tags for public data. Pages are prebuilt and cached for an hour;
// admin writes call refresh() so edits reach the live site right away.
export const TAGS = {
  content: "content",   // profile, about, skills, projects, experience
  settings: "settings", // accent colour
};

export const CONTENT_TTL = 3600;

// Public pages to rebuild in the background after an edit
const PUBLIC_PATHS = ["/", "/works", ...WORK_CATEGORIES.map((c) => `/works/${c.slug}`)];

/**
 * Mark cached public data stale after an admin write.
 *
 * Uses stale-while-revalidate ("max"): visitors keep getting the cached page
 * instantly while it is rebuilt in the background. (Expiring it outright made
 * the next visitor wait for a cold function + MongoDB connection with a blank
 * screen.) After the response is sent, we request the public pages once
 * ourselves so that rebuild happens now instead of on a real visitor.
 */
export function refresh(tag = TAGS.content) {
  revalidateTag(tag, "max");

  after(async () => {
    try {
      const h = await headers();
      const host = h.get("x-forwarded-host") || h.get("host");
      if (!host) return;
      const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
      const origin = `${proto}://${host}`;
      // First request serves the stale page and triggers the rebuild
      await Promise.allSettled(
        PUBLIC_PATHS.map((p) => fetch(origin + p, { cache: "no-store", headers: { "x-warmup": "1" } }))
      );
    } catch {
      /* warm-up is best effort */
    }
  });
}
