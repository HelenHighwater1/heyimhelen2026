import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FlowchartNav } from "@/components/FlowchartNav";

const sansFont = Inter({
  weight: ["400", "500", "600", "700"],
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
        {/* Virgil — Excalidraw's hand-drawn font */}
        <link
          href="https://cdn.jsdelivr.net/npm/@excalidraw/excalidraw@0.17.0/dist/excalidraw-assets/Virgil.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: 'Virgil';
                src: url('https://cdn.jsdelivr.net/npm/@excalidraw/excalidraw@0.17.0/dist/excalidraw-assets/Virgil.woff2') format('woff2');
                font-weight: normal;
                font-style: normal;
                font-display: swap;
              }
            `,
          }}
        />
      </head>
      <body className="dot-grid min-h-screen bg-sketch-bg font-sans text-sketch-text antialiased">
        <div className="mx-auto flex min-h-screen max-w-[1100px] flex-col px-4 py-6 md:px-8 md:py-8">
          {/* Header */}
          <header className="mb-2 flex items-center justify-between px-1">
            <h1 className="font-sketch text-lg tracking-wide text-sketch-text md:text-xl">
              helen highwater
            </h1>
            <span className="font-sketch text-sm text-sketch-text-muted">
              fullstack engineer
            </span>
          </header>

          {/* Navigation */}
          <div className="mb-6">
            <FlowchartNav />
          </div>

          {/* Main content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="mt-8 pb-2 text-center font-sketch text-xs text-sketch-text-muted">
            &copy; 2026 Helen Highwater &middot; sketched with care
          </footer>
        </div>
      </body>
    </html>
  );
}
