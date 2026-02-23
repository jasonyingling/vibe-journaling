import type { Metadata } from "next";
import { Source_Serif_4, DM_Sans } from "next/font/google";
import { Nav } from "@/components/nav";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vibe Journal",
  description: "One line a day. Find your rhythm.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourceSerif.variable} ${dmSans.variable}`}>
      <body className="min-h-screen font-serif antialiased">
        <main className="max-w-lg mx-auto px-5 pb-24 pt-8">
          {children}
        </main>
        <Nav />
      </body>
    </html>
  );
}
