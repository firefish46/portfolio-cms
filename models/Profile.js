// models/Profile.js
import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  name: String,
  title: String, // e.g., "Full Stack Developer"
  bio: String,
  avatar: String,
  email: String,
  location: String,
  socials: {
    github: String,
    linkedin: String,
    twitter: String
  }
}, { timestamps: true });

export default mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);