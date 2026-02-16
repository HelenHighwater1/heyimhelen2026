import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { SideNav } from "@/components/SideNav";

const sansFont = Nunito({
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <div className="flex min-h-screen flex-col bg-blueprint-canvas md:flex-row">
          <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
          <SideNav />
        </div>
      </body>
    </html>
  );
}
