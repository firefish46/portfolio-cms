import { Geist, Geist_Mono, GFS_Neohellenic, Fredoka,Cal_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";

// Font initializations
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const gfsNeo = GFS_Neohellenic({ weight: ["400", "700"], subsets: ["greek", "latin"], variable: "--font-gfs-neo" });
const fredoka = Fredoka({ weight: ["300", "400", "500", "600", "700"], subsets: ["latin"],display: 'swap', variable: "--font-fredoka" });
const calSans = Cal_Sans({ weight: [ "400"], subsets: ["latin"],display: 'swap', variable: "--font-cal-sans" });


export const metadata = {
  title: " Mehedi Hasan | Portfolio",
  description: "Showcasing digital excellence and modern web solutions",
};

export default async function RootLayout({ children }) {
  // THEME ENGINE SYNC: Fetch accent color from your DB
  await connectDB();
  const siteSettings = await Settings.findOne();
  const accentColor = siteSettings?.accentColor || "#3b82f6";

  return (
    <html lang="en">
      <head>
        {/* Injects the custom accent color into CSS variables dynamically */}
        <style>{`
          :root {
            --accent: ${accentColor};
          }
        `}</style>
      </head>
      <body className={`${calSans.variable}`}suppressHydrationWarning>
        <Navbar/>      
        {children}
      </body>
    </html>
  );
}