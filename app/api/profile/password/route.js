import { connectDB } from "@/lib/mongodb";
import User from "@/models/User"; 
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { current, new: newPassword } = await req.json();

    // 1. Find the admin user (assuming role 'admin' or by fixed ID)
    const admin = await User.findOne({ role: 'admin' });
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