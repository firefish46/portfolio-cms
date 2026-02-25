//app/api/about
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import About from "@/models/about";
import { requireAdmin } from "@/lib/adminMiddleware"; // Add this import

export async function GET() {
  try {
    await connectDB();
    const about = await About.findOne();
    return NextResponse.json(about || { highlights: [], aiTools: [] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    // 1. SECURITY CHECK
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const updatedAbout = await About.findOneAndUpdate(
      {}, 
      { 
        highlights: data.highlights, 
        aiTools: data.aiTools 
      }, 
      { upsert: true, new: true }
    );

    return NextResponse.json(updatedAbout);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}