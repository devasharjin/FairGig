import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Globe,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVoiceAssistantStore } from "@/features/customer/voice/voiceStore";
import { speechRecognitionService } from "@/features/customer/voice/speechRecognition.service";
import { textToSpeechService } from "@/features/customer/voice/textToSpeech.service";
import { processVoiceQuery } from "@/features/customer/voice/voiceApi";
import { SUPPORTED_LANGUAGES } from "@/features/customer/voice/types";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export const VoiceAssistantModal: React.FC = () => {
  const { t } = useTranslation();
  const {
    isOpen,
    closeAssistant,
    language,
    setLanguage,
    isListening,
    setIsListening,
    isProcessing,
    setIsProcessing,
    transcript,
    setTranscript,
    interimTranscript,
    setInterimTranscript,
    messages,
    addMessage,
    currentBooking,
    updateBooking,
    matchedService,
    setMatchedService,
    setCandidateServices,
    isTtsEnabled,
    toggleTts,
    error,
    isPermissionError,
    setError,
    resetSession,
    openExistingBookingDialog,
  } = useVoiceAssistantStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const speechTimeoutRef = useRef<any>(null);
  const [typedText, setTypedText] = useState("");

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimTranscript, isProcessing]);

  // Clean up speech when modal closes
  useEffect(() => {
    if (!isOpen) {
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      speechRecognitionService.stop();
      textToSpeechService.stop();
      setIsListening(false);
      setInterimTranscript("");
    }
  }, [isOpen]);

  const selectedLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Start / Stop listening toggle
  const handleToggleListening = () => {
    if (isListening) {
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      speechRecognitionService.stop();
      setIsListening(false);
      if (typedText.trim()) {
        handleSendQuery(typedText);
      }
      return;
    }

    textToSpeechService.stop();
    setError(null);
    setInterimTranscript("");

    speechRecognitionService.start(language, {
      onStart: () => {
        setIsListening(true);
      },
      onEnd: () => {
        setIsListening(false);
      },
      onResult: (text, isFinal) => {
        setTypedText(text);
        setTranscript(text);
        setInterimTranscript(isFinal ? "" : text);

        // Auto-send 1.6s after customer stops speaking so dialog opens automatically
        if (speechTimeoutRef.current) {
          clearTimeout(speechTimeoutRef.current);
        }
        speechTimeoutRef.current = setTimeout(() => {
          speechRecognitionService.stop();
          setIsListening(false);
          handleSendQuery(text);
        }, 1600);
      },
      onError: (err, isPermission) => {
        if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
        setIsListening(false);
        setError(err, isPermission);
        toast.error(err);
      },
    });
  };

  // Process text with backend LLM API
  const handleSendQuery = async (queryText?: string) => {
    const textToSend = (queryText || typedText || transcript).trim();
    if (!textToSend || isProcessing) return;

    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }

    // Stop listening while processing
    if (isListening) {
      speechRecognitionService.stop();
      setIsListening(false);
    }
    textToSpeechService.stop();

    // Add user message to thread
    addMessage({
      sender: "user",
      text: textToSend,
    });

    setTypedText("");
    setTranscript("");
    setInterimTranscript("");
    setIsProcessing(true);
    setError(null);

    try {
      const history = messages
        .filter((m) => m.id !== "initial-greeting")
        .slice(-6)
        .map((m) => ({
          role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
          content: m.text,
        }));

      const response = await processVoiceQuery({
        transcript: textToSend,
        language: selectedLang.shortCode,
        history,
        currentBooking,
        clientTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
      });

      // Update store state with extracted details
      updateBooking({
        serviceId: response.serviceId,
        serviceName: response.serviceName,
        category: response.category,
        bookingDate: response.bookingDate,
        bookingTime: response.bookingTime,
        customerAddress: response.customerAddress,
        bookingType: response.bookingType,
        additionalInstructions: response.additionalInstructions,
      });

      if (response.matchedService) {
        setMatchedService(response.matchedService);
      }

      if (response.candidateServices && response.candidateServices.length > 0) {
        setCandidateServices(response.candidateServices);
      } else {
        setCandidateServices([]);
      }

      // Add assistant response message
      addMessage({
        sender: "assistant",
        text: response.responseMessage,
        candidateServices: response.candidateServices,
        isReadyToBook: response.isReadyToBook,
      });

      // Play audio response if TTS enabled
      if (isTtsEnabled) {
        textToSpeechService.speak(response.responseMessage, selectedLang.speechCode);
      }

      // Automatically open the existing booking dialog when service is matched
      if (response.matchedService) {
        const prefill = {
          address: response.customerAddress || currentBooking.customerAddress || "",
          preferredDay: response.bookingDate || currentBooking.bookingDate || "",
          preferredTime: response.bookingTime || currentBooking.bookingTime || "",
          notes: response.additionalInstructions || currentBooking.additionalInstructions || "",
          bookingType: response.bookingType || currentBooking.bookingType || "SCHEDULED",
        };

        toast.success(`Opening booking form for ${response.matchedService.name}...`, {
          icon: "✨",
          duration: 2500,
        });

        // Open dialog after a brief smooth transition so customer sees the response
        setTimeout(() => {
          openExistingBookingDialog(response.matchedService!, prefill);
        }, 1000);
      }
    } catch (err: any) {
      const msg = err?.message || "Failed to process voice request";
      setError(msg);
      addMessage({
        sender: "assistant",
        text: "I encountered an issue processing your request. Please try speaking again or type your request.",
      });
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Open existing booking dialog with pre-filled details
  const handleOpenBooking = () => {
    if (!matchedService) {
      toast.error("Please specify a service before opening the booking form");
      return;
    }

    const prefill = {
      address: currentBooking.customerAddress || "",
      preferredDay: currentBooking.bookingDate || "",
      preferredTime: currentBooking.bookingTime || "",
      notes: currentBooking.additionalInstructions || "",
      bookingType: currentBooking.bookingType || "SCHEDULED",
    };

    openExistingBookingDialog(matchedService, prefill);
  };

  // Handle clicking a disambiguation candidate chip
  const handleSelectCandidate = (candidate: { _id: string; name: string }) => {
    handleSendQuery(`I want to book ${candidate.name}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? closeAssistant() : null)}>
      <DialogContent className="max-w-2xl w-full p-0 rounded-3xl border border-border shadow-2xl bg-card overflow-hidden gap-0 flex flex-col max-h-[90vh]">
        {/* ── Top Header ────────────────────────────────────────── */}
        <div className="px-6 py-4 border-b border-border/80 bg-gradient-to-r from-primary/8 via-primary/4 to-transparent flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md relative">
              <Sparkles className="size-5 text-accent animate-pulse" />
              {isListening && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
                </span>
              )}
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <span>{t("voice.assistantTitle")}</span>
                <Badge variant="outline" className="text-[10px] font-semibold bg-accent/15 text-accent border-accent/30 py-0.5 px-2">
                  Multilingual
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {t("voice.assistantSubtitle")}
              </DialogDescription>
            </div>
          </div>

          {/* Top Controls: Language & Audio */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <Select value={language} onValueChange={(val) => val && setLanguage(val)}>
              <SelectTrigger className="h-8 text-xs font-semibold rounded-xl bg-background border-border/80 gap-1.5 px-2.5 min-w-[130px]">
                <Globe className="size-3.5 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-60">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="text-xs">
                    <span className="font-medium">{lang.nativeName}</span>{" "}
                    <span className="text-muted-foreground text-[11px]">({lang.name})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* TTS Mute Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTts}
              title={isTtsEnabled ? "Mute audio response" : "Unmute audio response"}
              className={cn(
                "size-8 rounded-xl cursor-pointer transition-colors",
                isTtsEnabled ? "text-primary border-primary/40 bg-primary/5" : "text-muted-foreground"
              )}
            >
              {isTtsEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            </Button>

            {/* Reset Session */}
            <Button
              variant="ghost"
              size="icon"
              onClick={resetSession}
              title={t("voice.tryAgain")}
              className="size-8 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* ── Conversation Thread ────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-[260px] max-h-[380px] bg-background/50">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={cn("flex flex-col gap-1.5", isUser ? "items-end" : "items-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs transition-all",
                    isUser
                      ? "bg-primary text-primary-foreground rounded-br-xs font-medium"
                      : "bg-card border border-border/80 text-foreground rounded-bl-xs"
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Disambiguation Choices */}
                  {msg.candidateServices && msg.candidateServices.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-border/60 space-y-1.5">
                      <p className="text-[11px] font-semibold text-muted-foreground">Select a service to proceed:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.candidateServices.map((cand) => (
                          <button
                            key={cand._id}
                            type="button"
                            onClick={() => handleSelectCandidate(cand)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-all cursor-pointer"
                          >
                            <span>{cand.name}</span>
                            <span className="text-[10px] text-muted-foreground">₹{cand.firstHourRate}/hr</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground px-1">
                  {isUser ? "You" : "Assistant"} · {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            );
          })}

          {/* Live Interim Speech Preview */}
          {isListening && interimTranscript && (
            <div className="flex items-end justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-xs px-4 py-2.5 text-xs bg-primary/30 text-primary-foreground border border-primary/50 animate-pulse italic">
                "{interimTranscript}"
              </div>
            </div>
          )}

          {/* AI Processing Animation */}
          {isProcessing && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground px-2 py-1">
              <span className="size-2 rounded-full bg-accent animate-ping" />
              <span>{t("voice.processing")}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Extracted Booking Live Snapshot (if any field recognized) ──── */}
        {(matchedService || currentBooking.bookingDate || currentBooking.customerAddress) && (
          <div className="px-6 py-3 bg-muted/40 border-t border-border/70 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 text-xs flex-wrap">
              {matchedService && (
                <div className="flex items-center gap-1 font-semibold text-foreground">
                  <CheckCircle2 className="size-3.5 text-accent" />
                  <span>{matchedService.name}</span>
                  <span className="text-muted-foreground font-normal">(₹{matchedService.firstHourRate}/hr)</span>
                </div>
              )}
              {currentBooking.bookingDate && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="size-3 text-primary" />
                  <span>{currentBooking.bookingDate}</span>
                </div>
              )}
              {currentBooking.bookingTime && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="size-3 text-primary" />
                  <span>{currentBooking.bookingTime}</span>
                </div>
              )}
              {currentBooking.customerAddress && (
                <div className="flex items-center gap-1 text-muted-foreground truncate max-w-[200px]">
                  <MapPin className="size-3 text-primary shrink-0" />
                  <span className="truncate">{currentBooking.customerAddress}</span>
                </div>
              )}
            </div>

            {matchedService && (
              <Button
                onClick={handleOpenBooking}
                size="sm"
                className="h-8 rounded-xl text-xs font-bold gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm cursor-pointer shrink-0"
              >
                <span>{t("voice.confirmAndBook")}</span>
                <ChevronRight className="size-3.5" />
              </Button>
            )}
          </div>
        )}

        {/* ── Bottom Input & Speech Controls ─────────────────────── */}
        <div className="p-4 border-t border-border bg-card space-y-3">
          {/* Permission Error Banner */}
          {error && isPermissionError && (
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <p className="leading-snug">{error}</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Pulsing Mic Button */}
            <button
              type="button"
              onClick={handleToggleListening}
              className={cn(
                "relative size-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-md",
                isListening
                  ? "bg-rose-500 text-white ring-4 ring-rose-500/30 animate-pulse"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              )}
              title={isListening ? t("voice.stop") : t("voice.speak")}
            >
              {isListening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
              {isListening && (
                <span className="absolute -inset-1 rounded-2xl border-2 border-rose-400 animate-ping opacity-75" />
              )}
            </button>

            {/* Text Input for Typing or Editing Speech */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                placeholder={
                  isListening
                    ? t("voice.listening")
                    : t("voice.tapToSpeak")
                }
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendQuery();
                  }
                }}
                disabled={isProcessing}
                className="w-full h-12 pl-4 pr-12 rounded-2xl border border-input bg-muted/20 text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-accent transition"
              />

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSendQuery()}
                disabled={!typedText.trim() || isProcessing}
                className="absolute right-2 top-2 size-8 rounded-xl bg-accent text-accent-foreground flex items-center justify-center disabled:opacity-40 hover:bg-accent/90 transition-all cursor-pointer"
                title="Send query"
              >
                <Send className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3 text-accent" />
              {t("welfare.zeroExploitationDesc")}
            </span>
            <span>
              {isListening ? (
                <span className="text-rose-500 font-semibold animate-pulse">● {t("voice.listening")} ({selectedLang.name})...</span>
              ) : (
                <span>{t("voice.detectedLanguage", { lang: selectedLang.nativeName })}</span>
              )}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
