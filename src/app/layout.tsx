import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleDriveProvider } from "@/contexts/GoogleDriveContext";
import AuthWrapper from "@/components/AuthWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Monk Mode | Focus & Discipline",
  description: "Track your habits and build discipline",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Animated Background Gradients */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          {/* Base Black Background */}
          <div className="absolute inset-0 bg-black" />

          {/* Gradient Orbs */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] animate-float"
            style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }} // Blue-500
          />
        </div>

        <GoogleDriveProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <AuthWrapper>
              {children}
            </AuthWrapper>
          </ThemeProvider>
        </GoogleDriveProvider>
      </body>
    </html>
  );
}
