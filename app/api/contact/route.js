import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/contact";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const messages = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// Keep your POST method here as well for the frontend form...