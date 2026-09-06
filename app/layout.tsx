import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "თორნიკე & ქრისტინა — 24 სექტემბერი 2026",
};

const davitGuramishvili = localFont({
  src: "../fonts/DavitGuramishvili.ttf",
  variable: "--font-display",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka" className={davitGuramishvili.variable}>
      <body>
        <Navbar />
        <main className="min-h-[calc(100vh-8rem)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
