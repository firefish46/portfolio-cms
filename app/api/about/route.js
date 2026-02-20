import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import About from "@/models/about";

// GET: Fetch the About data for the frontend and admin panel
export async function GET() {
  try {
    await connectDB();
    
    // We fetch the first document. Since there's only one "About" section,
    // we don't need an ID.
    let about = await About.findOne();
    
    if (!about) {
      // Return an empty structure if nothing exists yet
      return NextResponse.json({ highlights: [], aiTools: [] });
    }
    
    return NextResponse.json(about);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch about data" }, { status: 500 });
  }
}

// PUT: Update the highlights and AI tools
export async function PUT(req) {
  try {
    await connectDB();
    const data = await req.json();

    // { upsert: true } creates the document if it doesn't exist
    // { new: true } returns the updated document
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
    return NextResponse.json({ error: "Failed to update about data" }, { status: 500 });
  }
}