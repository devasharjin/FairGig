import React, { useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  CheckCircle2,
  Wrench,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  X,
  PhoneCall,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import { getSocket, joinUserRoom, playNotificationSound } from "@/lib/socket";
import { useNotificationStore } from "./notificationStore";

interface SocketContextValue {
  socket: ReturnType<typeof getSocket>;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketNotificationProvider");
  }
  return context;
};

export const SocketNotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { addNotification, soundEnabled } = useNotificationStore();

  const userRole = user?.role || (user as any)?.user?.role;
  const userId = user?._id || user?.id || (user as any)?.user?._id || (user as any)?.user?.id;

  const roleList = Array.isArray(userRole)
    ? userRole.map((r) => String(r).toUpperCase())
    : [String(userRole || "").toUpperCase()];

  const isCustomer = roleList.includes("CUSTOMER");
  const isWorker = roleList.includes("WORKER");

  useEffect(() => {
    const socket = getSocket();
    // Rejoin rooms whenever user, connection, or route changes
    const isWorkerActive = isWorker || window.location.pathname.startsWith("/worker");

    const joinRooms = () => {
      const activeRole = isWorkerActive ? "WORKER" : roleList[0];
      if (userId) {
        joinUserRoom(activeRole, userId);
      }
      socket.emit("join", {
        role: activeRole,
        roles: roleList,
        userId,
      });
    };

    joinRooms();
    socket.on("connect", joinRooms);

    // ──────────────────────────────────────────────────────────
    // 1. CUSTOMER LISTENER: Worker accepts, starts, or completes
    // ──────────────────────────────────────────────────────────
    const handleJobStatusUpdated = (payload: any) => {
      console.log("⚡ [Socket] Received job:status_updated:", payload);

      // Play audio chime
      if (soundEnabled) {
        if (payload.status === "COMPLETED") {
          playNotificationSound("success");
        } else {
          playNotificationSound("chime");
        }
      }

      // Add to notification store
      addNotification({
        type: payload.type || "JOB_STATUS_UPDATE",
        title: payload.title || "Booking Update",
        message: payload.message || "Your booking status has updated.",
        bookingId: payload.bookingId,
        bookingNumber: payload.bookingNumber,
        status: payload.status,
        timestamp: payload.timestamp || new Date().toISOString(),
        link: `/bookings`,
        data: payload,
      });

      // Auto-refresh customer queries in real-time
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      if (payload.bookingId) {
        queryClient.invalidateQueries({ queryKey: ["customer-booking", payload.bookingId] });
      }

      // Determine styling based on action
      const isAccepted = payload.type === "JOB_ACCEPTED" || payload.status === "CONFIRMED";
      const isStarted = payload.type === "JOB_STARTED" || payload.status === "IN_PROGRESS";
      const isCompleted = payload.type === "JOB_COMPLETED" || payload.status === "COMPLETED";

      // Render custom interactive toast notification
      toast.custom(
        (t) => (
          <div
            className={`pointer-events-auto flex items-start gap-3.5 p-4 max-w-md w-full bg-card/95 text-card-foreground rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 select-none ${
              t.visible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-2 opacity-0 scale-95 pointer-events-none"
            } ${
              isCompleted
                ? "border-border/80 border-l-[3.5px] border-l-emerald-500 shadow-emerald-500/5"
                : isStarted
                ? "border-border/80 border-l-[3.5px] border-l-blue-500 shadow-blue-500/5"
                : "border-border/80 border-l-[3.5px] border-l-primary shadow-primary/5"
            }`}
          >
            {/* Status Icon */}
            <div
              className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                isCompleted
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : isStarted
                  ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                  : "bg-primary/15 text-primary"
              }`}
            >
              {isCompleted ? (
                <Sparkles className="size-5" />
              ) : isStarted ? (
                <Wrench className="size-5" />
              ) : (
                <CheckCircle2 className="size-5" />
              )}
            </div>

            {/* Notification Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs font-bold text-foreground">
                  {payload.title}
                </p>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                {payload.message}
              </p>

              {/* Action Link */}
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toast.dismiss(t.id);
                    navigate("/bookings");
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline cursor-pointer"
                >
                  <span>View Booking</span>
                  <ArrowRight className="size-3" />
                </button>

                {payload.worker?.phone && (
                  <a
                    href={`tel:${payload.worker.phone}`}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground ml-auto"
                  >
                    <PhoneCall className="size-3" />
                    <span>Call Worker</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ),
        { duration: 8000 }
      );
    };

    // ──────────────────────────────────────────────────────────
    // 2. WORKER LISTENER: Customer books an emergency booking
    // ──────────────────────────────────────────────────────────
    const seenEmergencyIds = new Set<string>();

    const handleEmergencyCreated = (payload: any) => {
      console.log("⚡ [Socket] Received emergency:created:", payload);

      const isWorkerActive = isWorker || window.location.pathname.startsWith("/worker");
      // Only notify workers
      if (!isWorkerActive) return;

      const dedupeKey = `${payload?.bookingId || payload?.bookingNumber || payload?.serviceName}_${payload?.timestamp || ""}`;
      if (seenEmergencyIds.has(dedupeKey)) {
        return;
      }
      seenEmergencyIds.add(dedupeKey);
      setTimeout(() => seenEmergencyIds.delete(dedupeKey), 8000);

      // Play urgent audio siren / beeps
      if (soundEnabled) {
        playNotificationSound("emergency");
      }

      // Add to notification store
      addNotification({
        type: "EMERGENCY_BOOKING",
        title: payload.title || "🚨 Emergency SOS Callout!",
        message: payload.message || "New emergency gig nearby requiring immediate response!",
        bookingId: payload.bookingId,
        bookingNumber: payload.bookingNumber,
        status: "PENDING",
        timestamp: payload.timestamp || new Date().toISOString(),
        link: `/worker/jobs`,
        data: payload,
      });

      // Auto-refresh worker gig listings in real-time
      queryClient.invalidateQueries({ queryKey: ["available-gigs"] });
      queryClient.invalidateQueries({ queryKey: ["worker-stats"] });

      // Render high-priority emergency banner toast
      toast.custom(
        (t) => (
          <div
            className={`pointer-events-auto flex items-start gap-3.5 p-4 max-w-md w-full bg-rose-950/95 text-white rounded-xl shadow-2xl border border-rose-500/40 border-l-[3.5px] border-l-rose-500 backdrop-blur-md transition-all duration-300 select-none ${
              t.visible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-2 opacity-0 scale-95 pointer-events-none"
            }`}
          >
            {/* Siren Icon */}
            <div className="size-10 rounded-xl bg-rose-600/30 text-rose-300 flex items-center justify-center shrink-0 animate-pulse">
              <AlertTriangle className="size-6 text-rose-400" />
            </div>

            {/* Notification Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-1.5 py-0.5 rounded">
                  🚨 SOS CALLOUT
                </span>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="text-rose-300 hover:text-white p-0.5 rounded cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              <p className="text-xs font-bold text-white mt-1">
                {payload.serviceName || "Emergency Service"} · ₹{payload.rate || "Surge Rate"}
              </p>

              <p className="text-xs text-rose-200 mt-0.5 leading-snug">
                {payload.address?.street || "Customer Location"}
              </p>

              {/* Action Button */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toast.dismiss(t.id);
                    navigate("/worker/jobs");
                  }}
                  className="h-8 px-3.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md inline-flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
                >
                  <span>Claim Emergency SOS</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ),
        { duration: 15000 }
      );
    };

    socket.on("job:status_updated", handleJobStatusUpdated);
    socket.on("emergency:created", handleEmergencyCreated);

    return () => {
      socket.off("connect", joinRooms);
      socket.off("job:status_updated", handleJobStatusUpdated);
      socket.off("emergency:created", handleEmergencyCreated);
    };
  }, [userId, userRole, soundEnabled, queryClient, navigate, addNotification, isWorker, isCustomer]);

  return (
    <SocketContext.Provider value={{ socket: getSocket() }}>
      {children}
    </SocketContext.Provider>
  );
};
