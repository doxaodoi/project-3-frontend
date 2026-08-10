import type { Metadata } from "next";
import { Newsreader, Archivo, IBM_Plex_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Reclaim — Campus Lost & Found",
  description:
    "One board for everything misplaced on campus — matched automatically, claimed privately.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${newsreader.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="bg-canvas text-ink font-sans min-h-full">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
