import React, { useState } from "react";
import { HeroSection } from "@/components/customer/home/hero-section";
import { CategoryShowcase } from "@/components/customer/home/category-showcase";
import { FeaturedServicesSection } from "@/components/customer/home/featured-services-section";
import { CooperativeBenefits } from "@/components/customer/home/cooperative-benefits";
import { HowItWorks } from "@/components/customer/home/how-it-works";
import { TestimonialsSection } from "@/components/customer/home/testimonials-section";
import { CtaBanner } from "@/components/customer/home/cta-banner";
import { ServiceBookingDialog } from "@/components/customer/services/service-booking-dialog";
import type { CustomerService } from "@/features/customer/services/types";

export const Home: React.FC = () => {
  const [bookingService, setBookingService] = useState<CustomerService | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleBookService = (service: CustomerService) => {
    setBookingService(service);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 1. Hero Section with Live Search & Trust Stats */}
      <HeroSection />

      {/* 2. Category Showcase */}
      <CategoryShowcase />

      {/* 3. Featured & Popular Cooperative Services */}
      <FeaturedServicesSection onBookService={handleBookService} />

      {/* 4. The Cooperative Advantage */}
      <CooperativeBenefits />

      {/* 5. How FairGig Works (3-Step Walkthrough) */}
      <HowItWorks />

      {/* 6. Community Testimonials */}
      <TestimonialsSection />

      {/* 7. Action CTA Banner */}
      <CtaBanner />

      {/* Interactive Service Booking Modal */}
      <ServiceBookingDialog
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        service={bookingService}
      />
    </div>
  );
};

export default Home;