import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import { requireAdmin } from "@/lib/adminMiddleware";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const profile = await Profile.findOne().lean();
  
  if (!profile) return Response.json({});
  
  // Ensure the ID is a string if the frontend needs it
  profile._id = profile._id.toString();
  
  return Response.json(profile);
}

export async function PUT(req) {
  await connectDB();
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  
  // We remove 'id' from the logic. 
  // This finds the first document (empty filter {}) and updates it, 
  // or creates it if it doesn't exist (upsert: true).
  const updatedProfile = await Profile.findOneAndUpdate(
    {}, 
    { $set: data }, 
    { upsert: true, new: true }
  );

  return NextResponse.json(updatedProfile);
}

// POST is redundant with the UPSERT logic above, but kept for compatibility
export async function POST(req) {
  await connectDB();
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const project = await Profile.create(data);
  return NextResponse.json(project);
}