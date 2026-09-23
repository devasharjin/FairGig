import { io, Socket } from "socket.io-client";
import { env } from "./env";

let socket: Socket | null = null;

/**
 * Returns singleton socket client instance
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(env.backendUrl, {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on("connect", () => {
      console.log("⚡ [Socket.io Client] Connected to server:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("⚡ [Socket.io Client] Disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.warn("⚡ [Socket.io Client] Connection error:", err.message);
    });
  }

  return socket;
}

/**
 * Join the user/role room on the socket server
 */
export function joinUserRoom(role?: string, userId?: string) {
  const s = getSocket();
  if (s.connected) {
    s.emit("join", { role, userId });
  } else {
    s.once("connect", () => {
      s.emit("join", { role, userId });
    });
  }
}

/**
 * Plays alert sound using browser Web Audio API synthesizer.
 * No external audio files or network requests needed!
 */
export function playNotificationSound(type: "chime" | "emergency" | "success" = "chime") {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    if (type === "emergency") {
      // Urgent, alternating double-tone siren / beeps
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      playTone(880, 0, 0.12);     // A5
      playTone(660, 0.14, 0.12);   // E5
      playTone(880, 0.28, 0.14);   // A5
      playTone(1100, 0.44, 0.2);   // C#6
    } else if (type === "success") {
      // Cheerful ascending triad
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.25);
      });
    } else {
      // Pleasant gentle two-tone chime for status updates
      const notes = [587.33, 880]; // D5 -> A5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.3);
      });
    }
  } catch (err) {
    // AudioContext might be blocked before first user interaction
    console.debug("Audio autoplay deferred or unavailable:", err);
  }
}
