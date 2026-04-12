import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Podologia | Especialistas na Saúde dos Seus Pés",
  description: "Agende sua consulta de podologia online em menos de 1 minuto. Tratamento humanizado para unhas encravadas, calosidades e saúde preventiva dos pés.",
  keywords: "podologia, podólogo, unha encravada, são paulo, calos, saúde dos pés, clínica de podologia",
  openGraph: {
    title: "Podologia",
    description: "Agende sua consulta online sem complicação.",
    url: "https://seusite.com.br",
    siteName: "Podologia",
    locale: "pt_BR",
    type: "website",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}