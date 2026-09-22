import type { CustomerService } from "../services/types";
import type { BookingType } from "../bookings/types";

export interface SupportedLanguage {
  code: string; // e.g. "en-IN", "ta-IN", "hi-IN", "te-IN"
  name: string;
  nativeName: string;
  speechCode: string;
  shortCode: string; // "en", "ta", "hi", "te"
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: "en-IN", name: "English (India)", nativeName: "English", speechCode: "en-IN", shortCode: "en" },
  { code: "ta-IN", name: "Tamil", nativeName: "தமிழ்", speechCode: "ta-IN", shortCode: "ta" },
  { code: "hi-IN", name: "Hindi", nativeName: "हिन्दी", speechCode: "hi-IN", shortCode: "hi" },
  { code: "te-IN", name: "Telugu", nativeName: "తెలుగు", speechCode: "te-IN", shortCode: "te" },
  { code: "kn-IN", name: "Kannada", nativeName: "ಕನ್ನಡ", speechCode: "kn-IN", shortCode: "kn" },
  { code: "ml-IN", name: "Malayalam", nativeName: "മലയാളം", speechCode: "ml-IN", shortCode: "ml" },
  { code: "bn-IN", name: "Bengali", nativeName: "বাংলা", speechCode: "bn-IN", shortCode: "bn" },
  { code: "mr-IN", name: "Marathi", nativeName: "मराठी", speechCode: "mr-IN", shortCode: "mr" },
];

export interface VoiceMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: Date;
  candidateServices?: CandidateServiceSummary[];
  isReadyToBook?: boolean;
}

export interface CandidateServiceSummary {
  _id: string;
  name: string;
  categoryName: string;
  firstHourRate: number;
  description?: string;
}

export interface ExtractedBookingState {
  serviceId?: string | null;
  serviceName?: string | null;
  category?: string | null;
  bookingDate?: string | null; // YYYY-MM-DD
  bookingTime?: string | null; // HH:mm
  customerAddress?: string | null;
  bookingType?: BookingType;
  additionalInstructions?: string;
}

export interface VoiceProcessRequest {
  transcript: string;
  language?: string;
  history?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  currentBooking?: ExtractedBookingState;
  clientTimezone?: string;
}

export interface VoiceProcessResponse {
  intent: "BOOK_SERVICE" | "INQUIRE_SERVICE" | "CANCEL_VOICE" | "UNKNOWN";
  detectedLanguage: string;
  confidence: number;
  matchedService: CustomerService | null;
  candidateServices?: CandidateServiceSummary[];
  serviceName: string | null;
  serviceId: string | null;
  category: string | null;
  bookingDate: string | null;
  bookingTime: string | null;
  customerAddress: string | null;
  bookingType: BookingType;
  additionalInstructions: string;
  missingFields: Array<"service" | "date" | "time" | "address">;
  responseMessage: string;
  isReadyToBook: boolean;
}

export interface BookingPrefillData {
  address?: string;
  preferredDay?: string; // YYYY-MM-DD
  preferredTime?: string; // HH:mm
  notes?: string;
  bookingType?: BookingType;
  immediateContact?: string;
}
