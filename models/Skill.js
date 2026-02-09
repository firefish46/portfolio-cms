import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema({
  name: String,
  level: String,
  category: String,
  icon: String,
});

export default mongoose.models.Skill || mongoose.model("Skill", SkillSchema);
