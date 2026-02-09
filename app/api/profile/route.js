//app/api/profile/route.js
import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import { requireAdmin } from "@/lib/adminMiddleware";

export async function GET() {
  await connectDB();
  const projects = await Profile.find().sort({ order: 1 });
  return Response.json(projects);
}

export async function POST(req) {
  await connectDB();
  const admin = requireAdmin(req);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const project = await Profile.create(data);
  return Response.json(project);
}

export async function PUT(req) {
  await connectDB();
  const admin = requireAdmin(req);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...data } = await req.json();
  await Profile.findByIdAndUpdate(id, data);
  return Response.json({ message: "Updated" });
}

export async function DELETE(req) {
  await connectDB();
  const admin = requireAdmin(req);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await Profile.findByIdAndDelete(id);
  return Response.json({ message: "Deleted" });
}
