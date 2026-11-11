// src/app/(public)/page.tsx
import { Hero } from "@/components/public/Hero";
import { ServicesSection } from "@/components/public/ServicesSection"; 
import { CasesSection } from "@/components/public/CasesSection";
import { DoctorSection } from "@/components/public/DoctorSection";
import {FaqSection} from "@/components/public/FaqSection";
import BlogPreview from "@/components/public/BlogPreview";
import { Footer } from "@/components/public/Footer";
import { LocalBusinessJsonLd } from "@/components/public/LocalBusinessJsonLd";

export const metadata = { alternates: { canonical: "/" } };
export default function HomePage() {
  return (
    <main className="min-h-screen bg-brutal-bg flex flex-col items-center w-full">
      <LocalBusinessJsonLd />
      <Hero />
      <ServicesSection />
      < CasesSection />
      <DoctorSection />
      <FaqSection />
      <BlogPreview />
      <Footer />
    </main>
  );
}