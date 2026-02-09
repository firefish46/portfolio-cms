import { Geist, Geist_Mono, GFS_Neohellenic, Fredoka } from "next/font/google";
import "./globals.css";

// 1. Initialize your fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gfsNeo = GFS_Neohellenic({
  weight: ["400", "700"],
  subsets: ["greek", "latin"],
  variable: "--font-gfs-neo",
});

const fredoka = Fredoka({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-fredoka",
});

export const metadata = {
  title: "Admin Portfolio | CMS",
  description: "Modern Admin Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={` ${fredoka.variable} ${gfsNeo.variable}${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}