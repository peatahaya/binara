import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { CursorGlow } from "@/components/cursor-glow";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "binara",
  description: "Aplikacja do zarządzania lekcjami matematyki, wpłatami i terminami",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${roboto.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><CursorGlow />{children}</body>
    </html>
  );
}
 