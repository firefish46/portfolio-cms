import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  name: String,
  title: String,
  about: String,
  avatar: String,
  resumeLink: String,
  socials: {
    github: String,
    linkedin: String,
    twitter: String,
  },
});

export default mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
