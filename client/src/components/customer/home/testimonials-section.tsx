import React from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";

export const TestimonialsSection: React.FC = () => {
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

  return (
    <section className="py-16 sm:py-24 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-primary tracking-wider uppercase">
            Community Voices
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            Loved by Customers & Trade Workers
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            Discover why thousands of households trust cooperative gig trade services.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="size-4 text-amber-500 fill-amber-500"
                      />
                    ))}
                  </div>
                  <Quote className="size-6 text-primary/20" />
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">{t.name}</h4>
                  <span className="text-[11px] text-muted-foreground block">{t.role}</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                  <CheckCircle2 className="size-3" />
                  {t.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
