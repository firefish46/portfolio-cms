//app/api/settings/route.js
import { connectDB } from "@/lib/mongodb";
import settings from "@/models/Settings";
import { requireAdmin } from "@/lib/adminMiddleware";

export async function GET() {
  await connectDB();
  const projects = await settings.find().sort({ order: 1 });
  return Response.json(projects);
}

export async function POST(req) {
  await connectDB();
  const admin = requireAdmin(req);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const setting = await settings.create(data);
  return Response.json(setting);
}

export async function PUT(req) {
  await connectDB();
  const admin = requireAdmin(req);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...data } = await req.json();
  await settings.findByIdAndUpdate(id, data);
  return Response.json({ message: "Updated" });
}

export async function DELETE(req) {
  await connectDB();
  const admin = requireAdmin(req);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await settings.findByIdAndDelete(id);
  return Response.json({ message: "Deleted" });
}
