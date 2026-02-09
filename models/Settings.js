import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  primaryColor: String,
  glassOpacity: Number,
  blurAmount: Number,
});

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
