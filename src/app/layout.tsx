// layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sitecore JSS Next.js TypeScript Type Generator",
  description: "sitecore-jss-nextjs-types-generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-r from-cyan-500 to-blue-500 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
