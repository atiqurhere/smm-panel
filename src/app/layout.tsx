import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SMM Panel - Professional Social Media Marketing Services",
  description: "Recharge first. Order with confidence. Professional SMM panel for Instagram, Facebook, YouTube, TikTok and more social media services.",
  keywords: "SMM panel, social media marketing, Instagram followers, YouTube views, Facebook likes, TikTok followers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
