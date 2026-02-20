import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema({
  highlights: [
    {
      title: String,
      desc: String,
    }
  ],
  aiTools: [
    {
      name: String,
      image: String, // e.g., "/icons/openai.svg"
      color: String, // e.g., "#10a37f"
      delay: String, // e.g., "1s"
    }
  ]
}, { timestamps: true });

export default mongoose.models.About || mongoose.model("About", AboutSchema);