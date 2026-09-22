export interface SpeechRecognitionCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string, isPermissionError: boolean) => void;
}

export interface ISpeechRecognitionService {
  isSupported(): boolean;
  start(languageCode: string, callbacks: SpeechRecognitionCallbacks): void;
  stop(): void;
  abort(): void;
}

class BrowserSpeechRecognitionService implements ISpeechRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;

  public isSupported(): boolean {
    return typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);
  }

  public start(languageCode: string, callbacks: SpeechRecognitionCallbacks): void {
    if (!this.isSupported()) {
      callbacks.onError?.(
        "Speech recognition is not supported in this browser. Please use Google Chrome, Edge, or enter text manually.",
        false
      );
      return;
    }

    // Abort any existing instance
    this.abort();

    try {
      const SpeechRecognitionConstructor =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      this.recognition = new SpeechRecognitionConstructor();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = languageCode || "en-IN";
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        callbacks.onStart?.();
      };

      this.recognition.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        const combined = (finalTranscript || interimTranscript).trim();
        if (combined) {
          callbacks.onResult?.(combined, Boolean(finalTranscript));
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn("[SpeechRecognition] Error event:", event.error);
        const errorType = event.error;
        let isPermission = false;
        let message = "An error occurred with voice recognition.";

        if (errorType === "not-allowed" || errorType === "permission-denied") {
          isPermission = true;
          message = "Microphone access was denied. Please allow microphone permissions in your browser settings to speak, or type your request.";
        } else if (errorType === "no-speech") {
          message = "No speech was detected. Please try speaking again.";
        } else if (errorType === "network") {
          message = "Network error during speech recognition. Please check your connection.";
        } else if (errorType === "audio-capture") {
          message = "No microphone was found. Please ensure your microphone is plugged in.";
        }

        callbacks.onError?.(message, isPermission);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        callbacks.onEnd?.();
      };

      this.recognition.start();
    } catch (err: any) {
      console.error("[SpeechRecognition] Failed to start:", err);
      callbacks.onError?.(err?.message || "Could not start speech recognition", false);
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        // Ignore stop error
      }
    }
    this.isListening = false;
  }

  public abort(): void {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (err) {
        // Ignore abort error
      }
      this.recognition = null;
    }
    this.isListening = false;
  }
}

export const speechRecognitionService: ISpeechRecognitionService =
  new BrowserSpeechRecognitionService();
