import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "DTUHub - Student Community Platform",
  description:
    "The DTU student community platform for renting, sharing resources, mentorship, and connecting with fellow students.",
  keywords: ["DTU", "Delhi Technological University", "student", "rental", "community"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
