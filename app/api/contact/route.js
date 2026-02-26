// app/api/contact/route.js
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/contact";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminMiddleware";

export async function GET(req) {
  try {
    await connectDB();
    // Pass the whole req object so middleware can read cookies
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await Contact.find({}).sort({ createdAt: -1 });
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const newContact = await Contact.create(body);
    return NextResponse.json({ message: "Message sent!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  try {
    console.log("Delete request received at /api/contact"); // Debugging
    await connectDB();
    
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Message ID is required" }, { status: 400 });
    }

    const deletedMessage = await Contact.findByIdAndDelete(id);
    if (!deletedMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Message deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}