// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BUSINESS, SITE_URL } from "@/lib/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const title = "Podóloga no Jardim Aricanduva, Zona Leste de SP | Lais Laurentino Podologia";
const description =
  "Podóloga no Jardim Aricanduva, zona leste de SP. Tratamento de unha encravada, calos, rachaduras, fungos e pé diabético. Agende online.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s | ${BUSINESS.name}` },
  description,
  applicationName: BUSINESS.name,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: BUSINESS.name,
    title,
    description,
    images: [{ url: "/p-hero.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/p-hero.png"],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}