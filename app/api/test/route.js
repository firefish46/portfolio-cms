import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Projects";

export async function GET() {
  await connectDB();

  const count = await Project.countDocuments();

  return Response.json({ message: "Models working", projects: count });
}
