// src/app/(public)/page.tsx
import { Hero } from "@/components/public/Hero";
import { ServicesSection } from "@/components/public/ServicesSection"; 
import { CasesSection } from "@/components/public/CasesSection";
import { DoctorSection } from "@/components/public/DoctorSection";
export default function HomePage() {
  return (
    <main className="min-h-screen bg-brutal-bg flex flex-col items-center w-full">
      <Hero />
      <ServicesSection />
      < CasesSection />
      <DoctorSection />
    </main>
  );
}