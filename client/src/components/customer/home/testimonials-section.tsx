import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
  rating: number;
  badge: string;
}

function TestimonialCard({
  item,
}: {
  item: TestimonialItem;
}) {
  return (
    <div className="flex flex-col justify-between h-full p-5 sm:p-6 rounded-xl bg-card border border-border/80 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="space-y-3">
        {/* Rating & Quote Icon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[...Array(item.rating)].map((_, i) => (
              <Star key={i} className="size-3.5 text-amber-500 fill-amber-500" />
            ))}
          </div>
          <Quote className="size-5 text-muted-foreground/30" />
        </div>

        {/* Quote Text */}
        <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed italic">
          "{item.quote}"
        </p>
      </div>

      {/* Author Info */}
      <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between">
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-foreground">{item.name}</h4>
          <span className="text-[11px] text-muted-foreground block">{item.role}</span>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
          <CheckCircle2 className="size-2.5" />
          {item.badge}
        </span>
      </div>
    </div>
  );
}

export const TestimonialsSection: React.FC = () => {
  const { t } = useTranslation();
  const [api, setApi] = React.useState<CarouselApi>();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const testimonials: TestimonialItem[] = [
    {
      name: t("home.testimonials.t1Name"),
      role: t("home.testimonials.t1Role"),
      quote: t("home.testimonials.t1Quote"),
      rating: 5,
      badge: t("home.testimonials.t1Badge"),
    },
    {
      name: t("home.testimonials.t2Name"),
      role: t("home.testimonials.t2Role"),
      quote: t("home.testimonials.t2Quote"),
      rating: 5,
      badge: t("home.testimonials.t2Badge"),
    },
    {
      name: t("home.testimonials.t3Name"),
      role: t("home.testimonials.t3Role"),
      quote: t("home.testimonials.t3Quote"),
      rating: 5,
      badge: t("home.testimonials.t3Badge"),
    },
  ];

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
            {t("home.testimonials.badge")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {t("home.testimonials.title")}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t("home.testimonials.desc")}
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
              {testimonials.map((item) => (
                <CarouselItem key={item.name} className="pl-3 basis-[85%] sm:basis-[60%]">
                  <TestimonialCard item={item} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 mt-4">
            {testimonials.map((item, i) => (
              <button
                key={item.name}
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
          {testimonials.map((item) => (
            <TestimonialCard key={item.name} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

