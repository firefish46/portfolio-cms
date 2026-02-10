'use server'
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/contact";

export async function handleContact(formData) {
  try {
    await connectDB();

    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    // Save to MongoDB
    await Contact.create(rawData);

    return { success: true, message: "Message sent successfully!" };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Failed to send message." };
  }
}