import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Task Flow — Trusted help for everyday tasks",
  description:
    "Task Flow helps you quickly find reliable, background-checked local helpers for grocery shopping, repairs, pet care, rides and more. Post a task in minutes.",
  applicationName: "Task Flow",
  appleWebApp: { capable: true, title: "Task Flow", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#1466B8",
  width: "device-width",
  initialScale: 1,
  // Let users pinch-zoom — never trap older readers at a fixed size.
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
