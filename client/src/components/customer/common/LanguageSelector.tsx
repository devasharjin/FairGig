import React from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CUSTOMER_LANGUAGES, type CustomerLanguage } from "@/i18n";
import { useVoiceAssistantStore } from "@/features/customer/voice/voiceStore";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  className?: string;
  isMobile?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className,
  isMobile = false,
}) => {
  const { i18n } = useTranslation();

  // Normalize current language code (e.g. "en-US" -> "en")
  const currentLangCode = (i18n.language || "en").split("-")[0];
  const activeLanguage =
    CUSTOMER_LANGUAGES.find((l) => l.code === currentLangCode) ||
    CUSTOMER_LANGUAGES[0];

  const handleSelectLanguage = (lang: CustomerLanguage) => {
    i18n.changeLanguage(lang.code);
    try {
      localStorage.setItem("fairgig_customer_language", lang.code);
    } catch {
      // Ignore storage errors
    }

    // Synchronize Voice Assistant language so speech recognition matches
    try {
      useVoiceAssistantStore.getState().setLanguage(lang.voiceCode);
    } catch {
      // Optional bridge
    }
  };

  if (isMobile) {
    return (
      <div className={cn("space-y-1.5", className)}>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1">
          <Globe className="size-3 text-primary" />
          <span>Language / மொழி / भाषा</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {CUSTOMER_LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLangCode;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-card text-muted-foreground hover:text-foreground border-border/80 hover:bg-muted/50"
                )}
              >
                <div className="flex flex-col text-left">
                  <span className="font-bold">{lang.nativeName}</span>
                  <span className="text-[10px] opacity-75 font-normal">
                    {lang.name}
                  </span>
                </div>
                {isSelected && <Check className="size-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center h-9 px-2.5 sm:px-3 rounded-xl border border-border/80 hover:border-primary/40 bg-card hover:bg-muted/60 text-foreground font-semibold text-xs gap-1.5 cursor-pointer shadow-xs transition-all outline-none shrink-0 select-none",
          className
        )}
        title="Change customer portal language"
      >
        <Globe className="size-3.5 text-accent shrink-0" />
        <span className="font-bold whitespace-nowrap">{activeLanguage.nativeName}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl shadow-lg border border-border">
        {CUSTOMER_LANGUAGES.map((lang) => {
          const isSelected = lang.code === currentLangCode;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleSelectLanguage(lang)}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors",
                isSelected
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <div className="flex flex-col">
                <span className="font-bold text-xs">{lang.nativeName}</span>
                <span className="text-[10px] text-muted-foreground">{lang.name}</span>
              </div>
              {isSelected && <Check className="size-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
