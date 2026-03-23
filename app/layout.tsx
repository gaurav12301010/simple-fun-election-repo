import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ElectX — Mini Election Platform",
  description: "A fun, gamified digital election experience with candidate registration, live voting, and real-time results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(15, 15, 26, 0.95)",
              color: "#f1f5f9",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(16px)",
              borderRadius: "12px",
              fontFamily: "Inter, sans-serif",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#0a0a14" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#0a0a14" },
            },
          }}
        />
      </body>
    </html>
  );
}
