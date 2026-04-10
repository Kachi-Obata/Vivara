import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Vivara MedSim",
  description: "AI-powered clinical simulation platform for medical trainees",
  manifest: "/manifest.json",
  themeColor: "#0a0e1a",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ paddingBottom: 72 }}>
        {children}
        <Navigation />
      </body>
    </html>
  );
}
