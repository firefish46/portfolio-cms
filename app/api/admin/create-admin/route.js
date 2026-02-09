import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();

  const { email, password } = await req.json();

  const hashed = await bcrypt.hash(password, 10);

  await User.create({ email, password: hashed });

  return Response.json({ message: "Admin created" });
}
