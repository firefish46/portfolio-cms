// One-time migration: move base64 images stored in MongoDB to Cloudinary.
// GET  → how many inline images remain
// POST → migrate one batch and report what's left (the dashboard loops)
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/adminMiddleware";
import { refresh } from "@/lib/cache";
import Project from "@/models/Projects";
import Profile from "@/models/Profile";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const BATCH = 6; // keeps each request well inside serverless time limits
const INLINE = /^data:image\//;

async function countInline() {
  const [agg, avatar] = await Promise.all([
    Project.aggregate([
      { $project: { images: 1 } },
      { $unwind: "$images" },
      { $match: { images: { $regex: "^data:image/" } } },
      { $count: "n" },
    ]),
    Profile.countDocuments({ avatar: { $regex: "^data:image/" } }),
  ]);
  return (agg[0]?.n ?? 0) + avatar;
}

const upload = (dataUri, folder) =>
  cloudinary.uploader.upload(dataUri, { folder, resource_type: "image" }).then((r) => r.secure_url);

export async function GET(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  return NextResponse.json({ remaining: await countInline() });
}

export async function POST(req) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();

  let budget = BATCH;
  let migrated = 0;

  try {
    // Avatar first (it is on every page)
    const profile = await Profile.findOne({ avatar: { $regex: "^data:image/" } });
    if (profile) {
      profile.avatar = await upload(profile.avatar, "portfolio_profile");
      await profile.save();
      budget--; migrated++;
    }

    while (budget > 0) {
      const project = await Project.findOne({ images: { $regex: "^data:image/" } });
      if (!project) break;
      const images = [...project.images];
      for (let i = 0; i < images.length && budget > 0; i++) {
        if (INLINE.test(images[i])) {
          images[i] = await upload(images[i], "portfolio_projects");
          budget--; migrated++;
        }
      }
      project.images = images;
      await project.save();
    }
  } catch (error) {
    if (migrated) refresh();
    return NextResponse.json({ error: error.message, migrated }, { status: 500 });
  }

  if (migrated) refresh();
  return NextResponse.json({ migrated, remaining: await countInline() });
}
