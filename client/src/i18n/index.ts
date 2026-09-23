import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import ta from "./locales/ta.json";
import hi from "./locales/hi.json";
import te from "./locales/te.json";
import ml from "./locales/ml.json";

export interface CustomerLanguage {
  code: string;
  name: string;
  nativeName: string;
  voiceCode: string;
}

export const CUSTOMER_LANGUAGES: CustomerLanguage[] = [
  { code: "en", name: "English", nativeName: "English", voiceCode: "en-IN" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", voiceCode: "ta-IN" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", voiceCode: "hi-IN" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", voiceCode: "te-IN" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", voiceCode: "ml-IN" },
];

export const resources = {
  en: { translation: en },
  ta: { translation: ta },
  hi: { translation: hi },
  te: { translation: te },
  ml: { translation: ml },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "ta", "hi", "te", "ml"],
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "fairgig_customer_language",
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
  });

// Synchronize document language tag for accessibility
i18n.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
  }
});

export default i18n;
