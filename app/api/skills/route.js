import { connectDB } from "@/lib/mongodb";
import Skill from "@/models/Skill"; // Use singular 'Skill' to match standard naming
import { requireAdmin } from "@/lib/adminMiddleware";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const skillsList = await Skill.find().sort({ order: 1 });
  return NextResponse.json(skillsList);
}

export async function POST(req) {
  await connectDB();
  // Ensure requireAdmin is awaited if it's an async function
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    // Ensure 'level' in your Mongoose model is String, not Number
    const skill = await Skill.create(data);
    return NextResponse.json(skill);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(req) {
  await connectDB();
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...data } = await req.json();
  await Skill.findByIdAndUpdate(id, data);
  return NextResponse.json({ message: "Updated" });
}

export async function DELETE(req) {
  await connectDB();
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // FIXED: Read ID from URL search params to avoid JSON parse errors
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  await Skill.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}