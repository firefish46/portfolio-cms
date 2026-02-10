import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    lowercase: true,
    trim: true,
  },
  message: {
    type: String,
    required: [true, "Message cannot be empty"],
  },
  status: {
    type: String,
    enum: ["unread", "read", "replied"],
    default: "unread",
  }
}, { 
  timestamps: true // Automatically creates 'createdAt' and 'updatedAt'
});

export default mongoose.models.Contact || mongoose.model("Contact", ContactSchema);