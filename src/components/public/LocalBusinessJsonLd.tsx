// src/components/public/LocalBusinessJsonLd.tsx
// Structured data that tells search engines and AI assistants what this business is.
import { BUSINESS, SITE_URL } from "@/lib/site";

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${SITE_URL}/#clinic`,
    name: BUSINESS.name,
    url: SITE_URL,
    image: `${SITE_URL}/p-hero.png`,
    telephone: BUSINESS.phoneE164,
    medicalSpecialty: "Podiatric",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${BUSINESS.streetAddress} - ${BUSINESS.neighborhood}`,
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.state,
      postalCode: BUSINESS.postalCode,
      addressCountry: "BR",
    },
    hasMap: BUSINESS.mapsUrl,
    sameAs: [BUSINESS.instagramUrl],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    availableService: [
      { "@type": "MedicalProcedure", name: "Tratamento de unha encravada" },
      { "@type": "MedicalProcedure", name: "Tratamento de calos e rachaduras" },
      { "@type": "MedicalProcedure", name: "Cuidados com pé diabético" },
      { "@type": "MedicalProcedure", name: "Tratamento de micoses e fungos nas unhas" },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}