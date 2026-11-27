import { unstable_cache } from "next/cache";
import { TAGS, CONTENT_TTL } from "@/lib/cache";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Projects";
import { WORK_CATEGORIES, categorize } from "@/lib/workCategories";

// All projects, cached like the home page (60s), each tagged with its work category.
export const getWorks = unstable_cache(
  async () => {
    await connectDB();
    const docs = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(docs)).map((p) => ({
      ...p,
      workCategory: categorize(p.category),
    }));
  },
  ["works-projects"],
  { revalidate: CONTENT_TTL, tags: [TAGS.content] }
);

export function countByCategory(works) {
  const counts = Object.fromEntries(WORK_CATEGORIES.map((c) => [c.slug, 0]));
  for (const w of works) counts[w.workCategory] += 1;
  return counts;
}
