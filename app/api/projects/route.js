//app/api/projects/route.js
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Projects";
import { requireAdmin } from "@/lib/adminMiddleware";
import { NextResponse } from "next/server"; // Import this
import { refresh, TAGS } from "@/lib/cache";

export async function GET() {
  await connectDB();
  const projects = await Project.find().sort({ order: 1 }).lean();
  return NextResponse.json(projects);
}

export async function POST(req) {
  await connectDB();
  const admin = await requireAdmin(req); // Use await if requireAdmin is async
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const project = await Project.create(data);
  refresh(TAGS.content);
  return NextResponse.json(project);
}

export async function PUT(req) {
  await connectDB();
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...data } = await req.json();
  await Project.findByIdAndUpdate(id, data);
  refresh(TAGS.content);
  return NextResponse.json({ message: "Updated" });
}

export async function DELETE(req) {
  await connectDB();
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Extract ID from the URL (e.g., /api/projects?id=123)
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
  }

  await Project.findByIdAndDelete(id);
  refresh(TAGS.content);
  return NextResponse.json({ message: "Deleted" });
}