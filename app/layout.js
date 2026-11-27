import { Cal_Sans, Elms_Sans } from "next/font/google";
import { unstable_cache } from "next/cache";
import { TAGS } from "@/lib/cache";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";
import '@fortawesome/fontawesome-free/css/all.min.css';

// Elms Sans: body text and small headings (variable 100–900).
const elmsSans = Elms_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-elms",
});

// Cal Sans: heavy display face for the name and section titles only.
// It ships in a single weight, so it is used at 400 and never faux-bolded.
const calSans = Cal_Sans({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cal-sans",
});

const getAccentColor = unstable_cache(
  async () => {
    await connectDB();
    const settings = await Settings.findOne().select("accentColor").lean();
    return settings?.accentColor ?? "#3b82f6";
  },
  ["site-settings"],
  { revalidate: 86400, tags: [TAGS.settings] }
);

export const metadata = {
  title: "Mehedi Hasan | Portfolio",
  description: "Showcasing digital excellence and modern web solutions",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  // Browser chrome (mobile address bar) matches the page background
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "rgb(246, 246, 246)" },
    { media: "(prefers-color-scheme: dark)", color: "rgb(14, 14, 14)" },
  ],
};

// Painted before any stylesheet arrives, so there is never a white/black flash
const criticalCss = `
html{background:rgb(246,246,246);color:rgb(20,20,20)}
@media (prefers-color-scheme:dark){html{background:rgb(14,14,14);color:rgb(238,238,238)}}
`;

export default async function RootLayout({ children }) {
  const accentColor = await getAccentColor();

  return (
    <html lang="en" className={`${elmsSans.variable} ${calSans.variable}`}>
      <head>
        <style>{`${criticalCss}:root { --accent: ${accentColor}; }`}</style>
      </head>
      <body suppressHydrationWarning>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}