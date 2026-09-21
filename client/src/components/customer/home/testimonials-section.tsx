import React, { useEffect, useRef } from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Pooja Sharma",
    role: "Homeowner, Indirapuram",
    quote:
      "The electrician arrived within 40 minutes, repaired our sub-distribution wiring seamlessly, and the bill was exactly what the standard hourly rate stated. No hidden surge pricing!",
    rating: 5,
    badge: "Verified Booking",
  },
  {
    name: "Rajesh Murthy",
    role: "Apartment Association Lead",
    quote:
      "We partnered with FairGig's district plumbing cooperative for our society's pipe rewiring. Excellent craftsmanship and knowing the plumbers receive 100% of their earnings brings genuine peace of mind.",
    rating: 5,
    badge: "Commercial Client",
  },
  {
    name: "Anand Kumar",
    role: "Certified Master Electrician",
    quote:
      "Joining the worker cooperative changed my family's life. Rather than losing 30% of my hard work to predatory apps, I earn a guaranteed floor wage and have collective health coverage.",
    rating: 5,
    badge: "Co-op Member #418",
  },
];

function TestimonialCard({
  t,
}: {
  t: (typeof testimonials)[number];
}) {
  return (
    <div className="flex flex-col justify-between h-full p-5 sm:p-6 rounded-xl bg-card border border-border/80 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="space-y-3">
        {/* Rating & Quote Icon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[...Array(t.rating)].map((_, i) => (
              <Star key={i} className="size-3.5 text-amber-500 fill-amber-500" />
            ))}
          </div>
          <Quote className="size-5 text-muted-foreground/30" />
        </div>

        {/* Quote Text */}
        <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed italic">
          "{t.quote}"
        </p>
      </div>

      {/* Author Info */}
      <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between">
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-foreground">{t.name}</h4>
          <span className="text-[11px] text-muted-foreground block">{t.role}</span>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
          <CheckCircle2 className="size-2.5" />
          {t.badge}
        </span>
      </div>
    </div>
  );
}

export const TestimonialsSection: React.FC = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll every 3.5 seconds on mount
  useEffect(() => {
    if (!api) return;

    intervalRef.current = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 3500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [api]);

  return (
    <section className="py-10 sm:py-14 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-accent tracking-wider uppercase">
            Community Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Trusted by Customers &amp; Trade Specialists
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Real experiences from homeowners and cooperative professionals across India.
          </p>
        </div>

        {/* Mobile & sm: auto-scrolling carousel */}
        <div className="block md:hidden">
          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-3">
              {testimonials.map((t) => (
                <CarouselItem key={t.name} className="pl-3 basis-[85%] sm:basis-[60%]">
                  <TestimonialCard t={t} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 mt-4">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                type="button"
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => api?.scrollTo(i)}
                className="size-1.5 rounded-full bg-border hover:bg-primary transition-colors cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* md+: regular 3-column grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
};
