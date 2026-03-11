import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AgentChat AI",
  description: "Turn your website into an AI customer support agent"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
