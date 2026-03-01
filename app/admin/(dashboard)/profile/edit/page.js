// app/admin/profile/edit/page.js
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import EditProfileClient from "./EditProfileClient";

const getProfile = unstable_cache(
  async () => {
    await connectDB();
    const data = await Profile.findOne().lean();
    return data ? JSON.parse(JSON.stringify(data)) : null;
  },
  ["admin-profile"],
  { tags: ["admin-profile"] }
);

export default async function EditProfilePage() {
  const profile = await getProfile();
  return <EditProfileClient initialProfile={profile} />;
}