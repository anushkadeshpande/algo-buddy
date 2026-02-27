import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DSA Quest — Gamified LeetCode Explainer",
  description: "Paste any LeetCode problem and get a gamified, visual, step-by-step explanation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
