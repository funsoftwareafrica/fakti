import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fakti — La facturation simple pour les PME de la zone FCFA",
  description:
    "Créez des devis et des factures professionnelles en FCFA, suivez vos impayés et relancez vos clients en quelques clics. Pensé pour les commerces d'Afrique de l'Ouest : simple, rapide, hors-ligne.",
  keywords: [
    "facturation",
    "FCFA",
    "PME",
    "devis",
    "facture",
    "Afrique de l'Ouest",
    "Niger",
    "TVA",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0b7a5c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
