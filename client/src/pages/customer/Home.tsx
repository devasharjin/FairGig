import React, { useState } from "react";
import { HeroSection } from "@/components/customer/home/hero-section";
import { CategoryShowcase } from "@/components/customer/home/category-showcase";
import { CooperativeBenefits } from "@/components/customer/home/cooperative-benefits";
import { HowItWorks } from "@/components/customer/home/how-it-works";
import { TestimonialsSection } from "@/components/customer/home/testimonials-section";
import { CtaBanner } from "@/components/customer/home/cta-banner";
import { EmergencyBanner } from "@/components/customer/emergency/EmergencyBanner";
import { EmergencySosModal } from "@/components/customer/emergency/EmergencySosModal";

export const Home: React.FC = () => {
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 1. Hero Section with Live Search & Trade Quick Links */}
      <HeroSection />

      {/* 2. Emergency SOS Immediate Dispatch Trigger Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-6 mb-8 relative z-20">
        <EmergencyBanner onTriggerEmergency={() => setIsEmergencyOpen(true)} />
      </div>

      {/* 3. Explore Available Services (Curated 4 Top Trade Services) */}
      <CategoryShowcase />

      {/* 4. The Cooperative Advantage */}
      <CooperativeBenefits />

      {/* 5. How FairGig Works (3-Step Walkthrough) */}
      <HowItWorks />

      {/* 6. Community Testimonials */}
      <TestimonialsSection />

      {/* 7. Action CTA Banner */}
      <CtaBanner />

      {/* 1-Tap Emergency SOS Modal */}
      <EmergencySosModal
        open={isEmergencyOpen}
        onOpenChange={setIsEmergencyOpen}
      />
    </div>
  );
};

export default Home;