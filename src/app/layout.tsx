import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Akiba AI | Make your money feel more manageable",
    template: "%s | Akiba AI",
  },
  description:
    "A calm, practical space to learn about money and make a plan for your goals.",
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
