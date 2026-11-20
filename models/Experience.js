import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true },       // e.g. Frontend Developer
    company: { type: String, required: true, trim: true },
    companyUrl: { type: String, trim: true },
    employmentType: { type: String, default: "Full-time" },   // Full-time, Internship, ...
    location: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },                    // null = current job
    current: { type: Boolean, default: false },
    description: { type: String, trim: true },
    tools: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);
