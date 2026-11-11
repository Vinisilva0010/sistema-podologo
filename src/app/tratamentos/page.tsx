// src/app/tratamentos/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "@/components/public/Footer";
import { TREATMENTS } from "@/lib/treatments";

export const metadata: Metadata = {
  title: "Tratamentos de podologia no Jardim Aricanduva",
  description:
    "Tratamentos de podologia com Lais Laurentino no Jardim Aricanduva, zona leste de SP: unha encravada, calos e rachaduras, pé diabético, micoses e fungos.",
  alternates: { canonical: "/tratamentos" },
};

export default function TreatmentsIndex() {
  return (
    <div className="flex min-h-screen flex-col bg-brutal-bg">
      <main className="grow px-4 pb-20 pt-12 md:px-12">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-8 font-black text-black text-base">
            <Link href="/" className="underline">Início</Link> / Tratamentos
          </nav>
          <h1 className="text-4xl md:text-6xl font-black uppercase text-black leading-tight mb-10">
            Tratamentos de podologia no Jardim Aricanduva
          </h1>
          <div className="flex flex-col gap-6">
            {TREATMENTS.map((t) => (
              <Link
                key={t.slug}
                href={`/tratamentos/${t.slug}`}
                className="block bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 transition-transform"
              >
                <h2 className="text-2xl font-black uppercase text-black mb-2">{t.name}</h2>
                <p className="text-lg font-bold text-black">{t.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}