import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BookingRatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const getStarLabel = (stars: number): string => {
  switch (stars) {
    case 1:
      return "Poor";
    case 2:
      return "Fair";
    case 3:
      return "Good";
    case 4:
      return "Very Good";
    case 5:
      return "Exceptional";
    default:
      return "";
  }
};

export const getLocalizedStarLabel = (
  stars: number,
  t: (key: string, options?: any) => string
): string => {
  switch (stars) {
    case 1:
      return t("bookings.stars.poor", { defaultValue: "Poor" });
    case 2:
      return t("bookings.stars.fair", { defaultValue: "Fair" });
    case 3:
      return t("bookings.stars.good", { defaultValue: "Good" });
    case 4:
      return t("bookings.stars.veryGood", { defaultValue: "Very Good" });
    case 5:
      return t("bookings.stars.exceptional", { defaultValue: "Exceptional" });
    default:
      return "";
  }
};

export const BookingRatingStars: React.FC<BookingRatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = "sm",
  className,
}) => {
  const sizeClasses = {
    sm: "size-3.5",
    md: "size-4 sm:size-5",
    lg: "size-6 sm:size-7",
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            star <= rating
              ? "text-amber-400 fill-amber-400"
              : "text-muted-foreground/30 fill-transparent"
          )}
        />
      ))}
    </div>
  );
};

export default BookingRatingStars;
