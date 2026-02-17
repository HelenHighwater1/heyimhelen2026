import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MazeNav } from "@/components/MazeNav";
import { RoamingGhosts } from "@/components/RoamingGhosts";

const sansFont = Inter({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Helen Highwater | Fullstack Software Engineer",
  description: "Personal portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sansFont.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-pac-black font-sans text-white antialiased">
        <RoamingGhosts />
        <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col px-4 py-4 md:px-6 md:py-6">
          {/* HUD Bar */}
          <header className="mb-2 flex items-center justify-between px-2">
            <h1 className="font-pixel text-xs tracking-wide text-pac-yellow md:text-sm">
              HELEN HIGHWATER
            </h1>
            <span className="font-pixel text-[10px] text-white/60 md:text-xs">
              HIGH SCORE: 999999
            </span>
          </header>

          {/* Maze Navigation */}
          <div className="mb-4">
            <MazeNav />
          </div>

          {/* Main content — game screen */}
          <main className="flex-1">{children}</main>

          {/* Footer — arcade credit */}
          <footer className="mt-6 pb-2 text-center font-pixel text-[8px] uppercase tracking-widest text-white/30">
            &copy; 2026 &middot; Insert coin to continue
          </footer>
        </div>
      </body>
    </html>
  );
}
