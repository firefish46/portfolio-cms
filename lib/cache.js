import { revalidateTag } from "next/cache";

// Cache tags for public data. Pages cache for an hour, and every admin
// write calls refresh(), so edits still show up on the next request.
export const TAGS = {
  content: "content",   // profile, about, skills, projects, experience
  settings: "settings", // accent colour
};

export const CONTENT_TTL = 3600;

/** Expire cached public data immediately (use after admin writes). */
export function refresh(tag = TAGS.content) {
  revalidateTag(tag, { expire: 0 });
}
