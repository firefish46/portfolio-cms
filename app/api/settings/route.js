//app/api/settings/route.js
import { connectDB } from "@/lib/mongodb";
import settings from "@/models/Settings";
import { requireAdmin } from "@/lib/adminMiddleware";

export async function GET() {
  await connectDB();
  // Use findOne so it returns {} instead of []
  const data = await settings.findOne(); 
  return Response.json(data || {});
}

export async function PUT(req) {
  await connectDB();
  const admin = requireAdmin(req);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();

  // Remove the need for an ID from the frontend. 
  // Just update the first document found.
  const updated = await settings.findOneAndUpdate({}, data, {
    new: true,
    upsert: true // Creates the document if the DB is empty
  });

  return Response.json(updated);
}
export async function POST(req) {
  await connectDB();
  const admin = requireAdmin(req);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const setting = await settings.create(data);
  return Response.json(setting);
}


export async function DELETE(req) {
  await connectDB();
  const admin = requireAdmin(req);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await settings.findByIdAndDelete(id);
  return Response.json({ message: "Deleted" });
}
