import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  tags: [String],
  image: { type: String }, // For later use
  link: { type: String },
  order: { type: Number, default: 0 },
}, { timestamps: true });

// This prevents the "Cannot overwrite model once compiled" error
export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);