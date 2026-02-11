import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/contact";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminMiddleware";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Create the document in the DB
    const newContact = await Contact.create(body);
    
    return NextResponse.json({ message: "Message sent!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  
}
export async function DELETE(req) {
  try {
    await connectDB();
    
    // 1. Check for admin authorization
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse the ID from the request body
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Message ID is required" }, { status: 400 });
    }

    // 3. Delete from MongoDB
    const deletedMessage = await Contact.findByIdAndDelete(id);

    if (!deletedMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Message deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}