import React from "react";

export interface DateStripDay {
  date: Date;
  dateStr: string;
  dayName: string;
  dayNumber: number;
  monthName: string;
  jobCount: number;
  isToday: boolean;
}

interface DateStripCarouselProps {
  dateStrip: DateStripDay[];
  selectedDateStr: string;
  selectedDateFormatted: string;
  isCalendarActive: boolean;
  onSelectDate: (dateStr: string) => void;
}

export const DateStripCarousel: React.FC<DateStripCarouselProps> = ({
  dateStrip,
  selectedDateStr,
  selectedDateFormatted,
  isCalendarActive,
  onSelectDate,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Select Appointment Date
        </span>
        <span className="text-xs font-medium text-primary">
          {selectedDateFormatted}
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
        {dateStrip.map((item) => {
          const isSelected = isCalendarActive && selectedDateStr === item.dateStr;

          return (
            <button
              key={item.dateStr}
              type="button"
              onClick={() => onSelectDate(item.dateStr)}
              className={`relative flex flex-col items-center justify-center min-w-[72px] sm:min-w-[84px] py-3 px-2 rounded-lg border transition-all cursor-pointer select-none shrink-0 snap-start ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-[1.02]"
                  : "bg-card hover:bg-muted/50 border-border/70 text-foreground"
              }`}
            >
              {item.isToday && (
                <span
                  className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full mb-1 ${
                    isSelected
                      ? "bg-white/20 text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  Today
                </span>
              )}
              <span
                className={`text-[11px] font-semibold ${
                  isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}
              >
                {item.dayName}
              </span>
              <span className="text-lg font-black tracking-tight my-0.5">
                {item.dayNumber}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}
              >
                {item.monthName}
              </span>

              {item.jobCount > 0 && (
                <div className="mt-1 flex items-center gap-1">
                  <span
                    className={`size-1.5 rounded-full ${
                      isSelected ? "bg-white animate-pulse" : "bg-primary"
                    }`}
                  />
                  <span
                    className={`text-[9px] font-extrabold ${
                      isSelected ? "text-primary-foreground" : "text-primary"
                    }`}
                  >
                    {item.jobCount}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateStripCarousel;
