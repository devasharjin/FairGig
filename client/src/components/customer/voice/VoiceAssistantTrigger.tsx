import React from "react";
import { useTranslation } from "react-i18next";
import { Mic, Sparkles } from "lucide-react";
import { useVoiceAssistantStore } from "@/features/customer/voice/voiceStore";
import { cn } from "@/lib/utils";

export const VoiceAssistantTrigger: React.FC = () => {
  const { t } = useTranslation();
  const { openAssistant, isOpen } = useVoiceAssistantStore();

  if (isOpen) return null;

  return (
    <aside
      aria-label="Multilingual Voice Booking Assistant"
      className="fixed bottom-6 right-6 z-40 flex items-center group cursor-pointer"
    >
      <button
        type="button"
        onClick={openAssistant}
        className={cn(
          "relative flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 transform group-hover:scale-105 active:scale-95 cursor-pointer",
          "bg-gradient-to-r from-primary via-[#1F4164] to-primary text-primary-foreground border border-white/20",
          "hover:shadow-primary/30"
        )}
      >
        {/* Pulsing ring indicator */}
        <span className="absolute -inset-0.5 rounded-full bg-accent opacity-30 group-hover:opacity-75 animate-pulse -z-10" />

        <div className="size-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
          <Mic className="size-4.5 group-hover:animate-bounce" />
        </div>

        <div className="flex flex-col text-left">
          <span className="text-xs font-bold tracking-wide flex items-center gap-1 leading-tight">
            <span>{t("voice.triggerTitle")}</span>
            <Sparkles className="size-3 text-accent" />
          </span>
          <span className="text-[10px] text-primary-foreground/75 leading-tight">
            {t("voice.triggerSubtitle")}
          </span>
        </div>
      </button>
    </aside>
  );
};
