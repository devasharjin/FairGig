import React, { useState } from "react";
import { HeroSection } from "@/components/customer/home/hero-section";
import { CategoryShowcase } from "@/components/customer/home/category-showcase";
import { FeaturedServicesSection } from "@/components/customer/home/featured-services-section";
import { CooperativeBenefits } from "@/components/customer/home/cooperative-benefits";
import { HowItWorks } from "@/components/customer/home/how-it-works";
import { TestimonialsSection } from "@/components/customer/home/testimonials-section";
import { CtaBanner } from "@/components/customer/home/cta-banner";
import { ServiceBookingDialog } from "@/components/customer/services/service-booking-dialog";
import { EmergencyBanner } from "@/components/customer/emergency/EmergencyBanner";
import { EmergencySosModal } from "@/components/customer/emergency/EmergencySosModal";
import type { CustomerService } from "@/features/customer/services/types";

export const Home: React.FC = () => {
  const [bookingService, setBookingService] = useState<CustomerService | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  const handleBookService = (service: CustomerService) => {
    setBookingService(service);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 1. Hero Section with Live Search & Trust Stats */}
      <HeroSection />

      {/* 2. Emergency SOS Immediate Dispatch Trigger Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-6 mb-8 relative z-20">
        <EmergencyBanner onTriggerEmergency={() => setIsEmergencyOpen(true)} />
      </div>

      {/* 3. Category Showcase */}
      <CategoryShowcase />

      {/* 4. Featured & Popular Cooperative Services */}
      <FeaturedServicesSection onBookService={handleBookService} />

      {/* 5. The Cooperative Advantage */}
      <CooperativeBenefits />

      {/* 6. How FairGig Works (3-Step Walkthrough) */}
      <HowItWorks />

      {/* 7. Community Testimonials */}
      <TestimonialsSection />

      {/* 8. Action CTA Banner */}
      <CtaBanner />

      {/* Interactive Service Booking Modal */}
      <ServiceBookingDialog
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        service={bookingService}
      />

      {/* 1-Tap Emergency SOS Modal */}
      <EmergencySosModal
        open={isEmergencyOpen}
        onOpenChange={setIsEmergencyOpen}
      />
    </div>
  );
};

export default Home;