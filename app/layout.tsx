import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "EasyBMC - Business Model Canvas Tool",
  description:
    "Create and manage your Business Model Canvas online with EasyBMC, a simple tool for organizing your business ideas efficiently.",
  keywords:
    "Business Model Canvas, EasyBMC, Business Planning, BMC, Startup, Business Management",
  robots: "index, follow",
  authors: {
    name: "Patcharaphon Srida",
  },
  openGraph: {
    title: "EasyBMC - Business Model Canvas Tool",
    description:
      "Create and manage your Business Model Canvas online with EasyBMC.",
    url: "https://easybmc.vercel.app", // ใส่ URL ของเว็บคุณ
    siteName: "EasyBMC",
    images: [
      {
        url: "https://easybmc.vercel.app/og-image.png", // ใส่ URL ของรูปภาพที่ต้องการใช้สำหรับแชร์
        width: 1024,
        height: 1024,
        alt: "EasyBMC - Business Model Canvas Tool",
      },
    ],
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
