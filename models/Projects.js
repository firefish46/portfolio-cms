import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  role: String,           // Your role (e.g., Lead Developer)
  link: String,           // Visit/Checkout URL
  tools: [String],        // Array of tools (React, Node, etc.)
  images: [String],       // Array of Base64 strings or URLs
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);