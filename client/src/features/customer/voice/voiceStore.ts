import { create } from "zustand";
import type { CustomerService } from "../services/types";
import type {
  VoiceMessage,
  ExtractedBookingState,
  CandidateServiceSummary,
  BookingPrefillData,
} from "./types";

interface VoiceAssistantState {
  isOpen: boolean;
  language: string; // e.g. "en-IN", "ta-IN", "hi-IN", "te-IN"
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  interimTranscript: string;
  messages: VoiceMessage[];
  currentBooking: ExtractedBookingState;
  matchedService: CustomerService | null;
  candidateServices: CandidateServiceSummary[];
  isTtsEnabled: boolean;
  error: string | null;
  isPermissionError: boolean;

  // Bridge to trigger existing ServiceBookingDialog
  isBookingDialogOpen: boolean;
  bookingServiceForDialog: CustomerService | null;
  bookingPrefillForDialog: BookingPrefillData | null;

  // Actions
  openAssistant: () => void;
  closeAssistant: () => void;
  setLanguage: (lang: string) => void;
  setIsListening: (isListening: boolean) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setTranscript: (text: string) => void;
  setInterimTranscript: (text: string) => void;
  addMessage: (msg: Omit<VoiceMessage, "id" | "timestamp">) => void;
  clearMessages: () => void;
  updateBooking: (update: Partial<ExtractedBookingState>) => void;
  setMatchedService: (service: CustomerService | null) => void;
  setCandidateServices: (candidates: CandidateServiceSummary[]) => void;
  toggleTts: () => void;
  setError: (err: string | null, isPermission?: boolean) => void;
  resetSession: () => void;

  // Trigger existing booking modal
  openExistingBookingDialog: (service: CustomerService, prefill: BookingPrefillData) => void;
  closeExistingBookingDialog: () => void;
}

const initialBookingState: ExtractedBookingState = {
  serviceId: null,
  serviceName: null,
  category: null,
  bookingDate: null,
  bookingTime: null,
  customerAddress: null,
  bookingType: "SCHEDULED",
  additionalInstructions: "",
};

export const useVoiceAssistantStore = create<VoiceAssistantState>((set) => ({
  isOpen: false,
  language: "en-IN",
  isListening: false,
  isProcessing: false,
  transcript: "",
  interimTranscript: "",
  messages: [
    {
      id: "initial-greeting",
      sender: "assistant",
      text: "Hello! You can speak or type to book any cooperative service. Try: 'I need a plumber tomorrow at 10 AM'.",
      timestamp: new Date(),
    },
  ],
  currentBooking: { ...initialBookingState },
  matchedService: null,
  candidateServices: [],
  isTtsEnabled: true,
  error: null,
  isPermissionError: false,

  isBookingDialogOpen: false,
  bookingServiceForDialog: null,
  bookingPrefillForDialog: null,

  openAssistant: () => {
    set({ isOpen: true, error: null });
  },

  closeAssistant: () => {
    set({ isOpen: false, isListening: false });
  },

  setLanguage: (lang: string) => {
    set({ language: lang });
  },

  setIsListening: (isListening: boolean) => {
    set({ isListening });
  },

  setIsProcessing: (isProcessing: boolean) => {
    set({ isProcessing });
  },

  setTranscript: (transcript: string) => {
    set({ transcript });
  },

  setInterimTranscript: (interimTranscript: string) => {
    set({ interimTranscript });
  },

  addMessage: (msg) => {
    const newMessage: VoiceMessage = {
      ...msg,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date(),
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  clearMessages: () => {
    set({
      messages: [
        {
          id: Math.random().toString(36).substring(2, 9),
          sender: "assistant",
          text: "How can I help you with cooperative gig services today?",
          timestamp: new Date(),
        },
      ],
      currentBooking: { ...initialBookingState },
      matchedService: null,
      candidateServices: [],
      transcript: "",
      interimTranscript: "",
      error: null,
    });
  },

  updateBooking: (update) => {
    set((state) => ({
      currentBooking: {
        ...state.currentBooking,
        ...update,
      },
    }));
  },

  setMatchedService: (matchedService) => {
    set({ matchedService });
  },

  setCandidateServices: (candidateServices) => {
    set({ candidateServices });
  },

  toggleTts: () => {
    set((state) => ({ isTtsEnabled: !state.isTtsEnabled }));
  },

  setError: (error, isPermission = false) => {
    set({ error, isPermissionError: isPermission });
  },

  resetSession: () => {
    set({
      transcript: "",
      interimTranscript: "",
      error: null,
      isPermissionError: false,
      currentBooking: { ...initialBookingState },
      matchedService: null,
      candidateServices: [],
      messages: [
        {
          id: Math.random().toString(36).substring(2, 9),
          sender: "assistant",
          text: "How can I help you with cooperative gig services today?",
          timestamp: new Date(),
        },
      ],
    });
  },

  openExistingBookingDialog: (service, prefill) => {
    set({
      isOpen: false,
      isListening: false,
      isBookingDialogOpen: true,
      bookingServiceForDialog: service,
      bookingPrefillForDialog: prefill,
    });
  },

  closeExistingBookingDialog: () => {
    set({
      isBookingDialogOpen: false,
      bookingServiceForDialog: null,
      bookingPrefillForDialog: null,
    });
  },
}));
