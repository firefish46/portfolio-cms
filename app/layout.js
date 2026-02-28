import { Cal_Sans } from "next/font/google";
import { unstable_cache } from "next/cache";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";
import '@fortawesome/fontawesome-free/css/all.min.css';

const calSans = Cal_Sans({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cal-sans",
  preload: true,
  adjustFontFallback: false,
});

const getAccentColor = unstable_cache(
  async () => {
    await connectDB();
    const settings = await Settings.findOne().select("accentColor").lean();
    return settings?.accentColor ?? "#3b82f6";
  },
  ["site-settings"],
  { revalidate: 900 }
);

export const metadata = {
  title: "Mehedi Hasan | Portfolio",
  description: "Showcasing digital excellence and modern web solutions",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  const accentColor = await getAccentColor();

  return (
    <html lang="en" className={calSans.variable}>
      <head>
        <style>{`:root { --accent: ${accentColor}; }`}</style>
      </head>
      <body suppressHydrationWarning>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}