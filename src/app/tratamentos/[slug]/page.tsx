// src/app/tratamentos/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Footer } from "@/components/public/Footer";
import { getPostBySlug } from "@/lib/blog";
import { BUSINESS, SITE_URL } from "@/lib/site";
import { TREATMENTS, getTreatment } from "@/lib/treatments";

export const dynamicParams = false;

export function generateStaticParams() {
  return TREATMENTS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTreatment(slug);
  if (!t) return {};
  const url = `/tratamentos/${t.slug}`;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: BUSINESS.name,
      url,
      title: t.metaTitle,
      description: t.metaDescription,
      images: [{ url: t.caseStudy?.after ?? "/p-hero.png" }],
    },
  };
}

const primaryBtn =
  "inline-block bg-yellow-300 border-4 border-black px-6 py-4 font-black uppercase text-black text-lg shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-transform";
const secondaryBtn =
  "inline-block bg-white border-4 border-black px-6 py-4 font-black uppercase text-black text-lg shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-transform";
const h2 = "text-2xl md:text-3xl font-black uppercase text-black border-b-4 border-black pb-2 mb-6";

export default async function TreatmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTreatment(slug);
  if (!t) notFound();

  const posts = t.relatedPosts.map((s) => getPostBySlug(s)).filter((p) => p !== null);
  const whatsappText = `Oi, Lais! Estava no site e queria tirar uma dúvida sobre o tratamento de *${t.name}*.`;
  const whatsappUrl = `https://wa.me/${BUSINESS.phoneE164.replace("+", "")}?text=${encodeURIComponent(whatsappText)}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Tratamentos", item: `${SITE_URL}/tratamentos` },
        { "@type": "ListItem", position: 3, name: t.name, item: `${SITE_URL}/tratamentos/${t.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: t.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-brutal-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="grow px-4 pb-20 pt-12 md:px-12">
        <article className="mx-auto max-w-4xl">
          <nav className="mb-8 font-black text-black text-base">
            <Link href="/" className="underline">Início</Link> /{" "}
            <Link href="/tratamentos" className="underline">Tratamentos</Link> / {t.name}
          </nav>

          <h1 className="text-4xl md:text-6xl font-black uppercase text-black leading-tight mb-6">{t.h1}</h1>
          <p className="text-xl md:text-2xl font-black text-black mb-8">{t.summary}</p>

          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <Link href="/agendar" className={primaryBtn}>Agendar avaliação</Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={secondaryBtn}>
              Tirar dúvida no WhatsApp
            </a>
          </div>

          <section className="mb-14">
            <h2 className={h2}>O que é</h2>
            {t.about.map((p) => (
              <p key={p} className="text-lg font-bold text-black leading-relaxed mb-4">{p}</p>
            ))}
          </section>

          {t.caseStudy && (
            <section className="mb-14">
              <h2 className={h2}>Caso atendido: {t.caseStudy.title}</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  { src: t.caseStudy.before, label: "Antes" },
                  { src: t.caseStudy.after, label: "Depois" },
                ].map((img) => (
                  <figure key={img.label} className="bg-white border-4 border-black">
                    <div className="relative aspect-square">
                      <Image
                        src={img.src}
                        alt={`${img.label}: ${t.caseStudy!.title}`}
                        fill
                        sizes="(min-width: 768px) 400px, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="border-t-4 border-black p-2 font-black uppercase text-black text-center">
                      {img.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
              <p className="text-lg font-bold text-black leading-relaxed">{t.caseStudy.text}</p>
            </section>
          )}

          <section className="mb-14">
            <h2 className={h2}>Perguntas frequentes</h2>
            <div className="flex flex-col gap-4">
              {t.faqs.map((f) => (
                <div key={f.question} className="bg-white border-4 border-black p-5">
                  <h3 className="text-xl font-black text-black mb-2">{f.question}</h3>
                  <p className="text-lg font-bold text-black leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {posts.length > 0 && (
            <section className="mb-14">
              <h2 className={h2}>Leia também no blog</h2>
              <ul className="flex flex-col gap-3">
                {posts.map((p) => (
                  <li key={p!.slug}>
                    <Link href={`/blog/${p!.slug}`} className="text-lg font-black text-black underline">
                      {p!.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="bg-white border-4 border-black p-6">
            <h2 className="text-2xl font-black uppercase text-black mb-4">Onde fica a clínica</h2>
            <p className="text-lg font-black text-black">{BUSINESS.name}</p>
            <p className="text-lg font-bold text-black">
              {BUSINESS.streetAddress} - {BUSINESS.neighborhood}, {BUSINESS.city} - {BUSINESS.state}, {BUSINESS.postalCode}
            </p>
            <p className="text-lg font-bold text-black">Terça a sábado, das 8h às 18h. Fechado aos domingos e segundas.</p>
            <p className="text-lg font-bold text-black mb-4">Telefone e WhatsApp: {BUSINESS.phoneDisplay}</p>
            <a href={BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-black text-black underline">
              Ver no Google Maps
            </a>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}