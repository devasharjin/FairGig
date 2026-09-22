export interface ITextToSpeechService {
  isSupported(): boolean;
  speak(text: string, languageCode: string, onEnd?: () => void): void;
  stop(): void;
  isSpeaking(): boolean;
}

class BrowserTextToSpeechService implements ITextToSpeechService {
  public isSupported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  public speak(text: string, languageCode: string, onEnd?: () => void): void {
    if (!this.isSupported() || !text.trim()) return;

    this.stop();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languageCode || "en-IN";
      utterance.rate = 0.95; // Slightly slower for clearer multilingual understanding
      utterance.pitch = 1.0;

      // Find best available voice matching language
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const langShort = languageCode.split("-")[0].toLowerCase();
        const matchedVoice =
          voices.find((v) => v.lang.toLowerCase() === languageCode.toLowerCase()) ||
          voices.find((v) => v.lang.toLowerCase().startsWith(langShort));

        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }
      }

      utterance.onend = () => {
        onEnd?.();
      };

      utterance.onerror = (e) => {
        console.warn("[TextToSpeech] Synthesis warning:", e);
        onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("[TextToSpeech] Failed to speak:", err);
      onEnd?.();
    }
  }

  public stop(): void {
    if (this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {
        // Ignore cancel errors
      }
    }
  }

  public isSpeaking(): boolean {
    return this.isSupported() ? window.speechSynthesis.speaking : false;
  }
}

export const textToSpeechService: ITextToSpeechService = new BrowserTextToSpeechService();
