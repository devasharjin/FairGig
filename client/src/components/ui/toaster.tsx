import * as React from "react";
import {
  toast as hotToast,
  resolveValue,
  Toaster as ReactHotToaster,
  type Toast,
  type ToasterProps,
} from "react-hot-toast";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CleanToastProps {
  toast: Toast;
}

/**
 * Modern, clean, theme-aware toast notification card
 */
export function CleanToast({ toast }: CleanToastProps) {
  const message = resolveValue(toast.message, toast);
  const isDismissable = toast.type !== "loading";
  const hasDuration =
    typeof toast.duration === "number" &&
    toast.duration !== Infinity &&
    toast.duration > 0;

  // Visual configuration per toast status
  const config = React.useMemo(() => {
    switch (toast.type) {
      case "success":
        return {
          tag: "Success",
          tagClass: "text-emerald-600 dark:text-emerald-400",
          iconWrapperClass:
            "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/25",
          accentBorder: "border-l-[3.5px] border-l-emerald-500",
          progressBarClass: "bg-emerald-500 dark:bg-emerald-400",
          Icon: CheckCircle2,
        };
      case "error":
        return {
          tag: "Error",
          tagClass: "text-rose-600 dark:text-rose-400",
          iconWrapperClass:
            "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-500/25",
          accentBorder: "border-l-[3.5px] border-l-rose-500",
          progressBarClass: "bg-rose-500 dark:bg-rose-400",
          Icon: AlertCircle,
        };
      case "loading":
        return {
          tag: "Updating",
          tagClass: "text-primary dark:text-accent",
          iconWrapperClass:
            "bg-primary/10 text-primary dark:bg-accent/20 dark:text-accent border border-primary/25",
          accentBorder: "border-l-[3.5px] border-l-primary dark:border-l-accent",
          progressBarClass: "bg-primary dark:bg-accent",
          Icon: Loader2,
        };
      case "blank":
      default:
        return {
          tag: "Notice",
          tagClass: "text-sky-600 dark:text-sky-400",
          iconWrapperClass:
            "bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/25",
          accentBorder: "border-l-[3.5px] border-l-sky-500",
          progressBarClass: "bg-sky-500 dark:bg-sky-400",
          Icon: Info,
        };
    }
  }, [toast.type]);

  const StatusIcon = config.Icon;

  return (
    <div
      role={toast.ariaProps.role || "status"}
      aria-live={toast.ariaProps["aria-live"] || "polite"}
      className={cn(
        "toast-item group pointer-events-auto relative flex w-full max-w-[390px] min-w-[290px] sm:min-w-[330px] items-start gap-3 overflow-hidden rounded-xl border border-border/80 bg-card/95 text-card-foreground p-3.5 shadow-lg shadow-black/5 dark:shadow-2xl dark:shadow-black/50 backdrop-blur-md transition-all duration-300 ease-out select-none",
        config.accentBorder,
        toast.visible
          ? "translate-y-0 opacity-100 scale-100"
          : "-translate-y-2 opacity-0 scale-95 pointer-events-none",
        toast.className
      )}
      style={toast.style}
    >
      {/* Status Icon Badge */}
      <div
        className={cn(
          "size-8 shrink-0 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105",
          config.iconWrapperClass
        )}
      >
        {toast.icon ? (
          typeof toast.icon === "string" ? (
            <span className="text-sm leading-none">{toast.icon}</span>
          ) : (
            toast.icon
          )
        ) : (
          <StatusIcon
            className={cn(
              "size-4 shrink-0",
              toast.type === "loading" && "animate-spin"
            )}
            strokeWidth={2.2}
          />
        )}
      </div>

      {/* Message and Tag */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "text-[10px] font-bold tracking-wider uppercase",
              config.tagClass
            )}
          >
            {config.tag}
          </span>
        </div>

        <div className="text-xs sm:text-[13px] font-medium text-foreground/90 leading-snug break-words mt-0.5">
          {message}
        </div>
      </div>

      {/* Close Button */}
      {isDismissable && (
        <button
          type="button"
          onClick={() => hotToast.dismiss(toast.id)}
          className="shrink-0 -mr-1 -mt-1 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          aria-label="Dismiss toast"
        >
          <X className="size-3.5" />
        </button>
      )}

      {/* Expiration Progress Bar */}
      {hasDuration && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-muted/40 overflow-hidden">
          <div
            className={cn("toast-progress-bar h-full opacity-60", config.progressBarClass)}
            style={{
              animationDuration: `${toast.duration}ms`,
            }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Drop-in clean Toaster provider
 */
export function AppToaster({
  position = "top-right",
  gutter = 10,
  toastOptions,
  containerStyle,
  ...props
}: ToasterProps) {
  return (
    <ReactHotToaster
      position={position}
      gutter={gutter}
      containerStyle={{
        top: 16,
        right: 16,
        bottom: 16,
        left: 16,
        ...containerStyle,
      }}
      toastOptions={{
        duration: 3500,
        removeDelay: 300,
        ...toastOptions,
      }}
      {...props}
    >
      {(t) => <CleanToast toast={t} />}
    </ReactHotToaster>
  );
}

export { hotToast as toast };
export default AppToaster;
