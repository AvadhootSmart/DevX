import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";

const inter = Inter({
  variable: "--font-next-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "DevX",
  description:
    "Coding challenge platform to move on from data structures and algorithms and test on actual development problems.",
  openGraph: {
    title: "DevX - Coding Challenge Platform",
    description:
      "Coding challenge platform to move on from data structures and algorithms and test on actual development problems.",
    type: "website",
    siteName: "DevX",
    url: "https://devx.avadhootsmart.xyz",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <head>
        <script
          async
          crossOrigin="anonymous"
          src="https://tweakcn.com/live-preview.min.js"
        />
      </head> */}
      <body className={`${inter.variable} antialiased font-inter tracking-tight`}>
        <ThemeProvider attribute="class">
          <main className="min-h-screen max-w-7xl mx-auto">
            <Navbar />
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
