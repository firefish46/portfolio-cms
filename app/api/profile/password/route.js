import { connectDB } from "@/lib/mongodb";
import User from "@/models/User"; 
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ message: "route is alive" });
}
export async function POST(req) {
  console.log("POST /api/profile/password hit"); // add this first
  try {
    console.log("Connecting to DB...");
    await connectDB();
    console.log("DB connected");
    
    const body = await req.json();
    console.log("Body received:", body);
    const current = body.current;
    const newPassword = body.new;
    const admin = await User.findOne({ email: "admin@mehedi" });
    console.log("Admin found:", admin);
    if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    // 2. Verify current password
    const isMatch = await bcrypt.compare(current, admin.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    // 3. Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 4. Update the user
    admin.password = hashedPassword;
    await admin.save();

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}