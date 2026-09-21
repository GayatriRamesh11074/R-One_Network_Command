import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "R-One: Network Command",
  description: "An interactive R-One operations challenge.",
  manifest: "/manifest.webmanifest",
  applicationName: "R-One Network Command",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "R-One Command" },
  formatDetection: { telephone: false },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
