import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { TanstackProvider } from "@/components/tanstack-provider";
import { RefreshLoader } from "@/components/refresh-loader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reading Platform",
  description: "Centralized App for Readers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn(
        "h-full",
        inter.variable,
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        "antialiased",
      )}
    >
      <head />
      <body className="min-h-full flex flex-col">
        <RefreshLoader />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <TanstackProvider>{children}</TanstackProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
