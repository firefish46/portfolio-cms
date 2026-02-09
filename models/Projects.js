import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  techStack: [String],
  githubLink: String,
  liveLink: String,
  images: [String],
  featured: Boolean,
  order: Number,
});

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
