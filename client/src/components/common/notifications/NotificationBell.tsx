import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  Wrench,
  Sparkles,
  AlertTriangle,
  Volume2,
  VolumeX,
  Trash2,
  CheckCheck,
} from "lucide-react";
import { useNotificationStore, type InAppNotification } from "@/features/socket/notificationStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NotificationBellProps {
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const {
    notifications,
    soundEnabled,
    markAsRead,
    markAllAsRead,
    clearAll,
    toggleSound,
  } = useNotificationStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (notif: InAppNotification) => {
    markAsRead(notif.id);
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const getNotificationIcon = (type: string, status?: string) => {
    if (type === "EMERGENCY_BOOKING") {
      return (
        <div className="size-8 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
          <AlertTriangle className="size-4 animate-pulse" />
        </div>
      );
    }
    if (type === "JOB_COMPLETED" || status === "COMPLETED") {
      return (
        <div className="size-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <Sparkles className="size-4" />
        </div>
      );
    }
    if (type === "JOB_STARTED" || status === "IN_PROGRESS") {
      return (
        <div className="size-8 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <Wrench className="size-4" />
        </div>
      );
    }
    return (
      <div className="size-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
        <CheckCircle2 className="size-4" />
      </div>
    );
  };

  const formatTimestamp = (iso: string) => {
    try {
      const date = new Date(iso);
      const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
      if (diffMinutes < 1) return "Just now";
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative size-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        title="Notifications"
      >
        <Bell className="size-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full size-2 bg-rose-500"></span>
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-card border border-border/80 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/30">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-[10px] font-bold px-1.5 py-0 h-4.5">
                  {unreadCount} new
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* Sound Mute Toggle */}
              <button
                type="button"
                onClick={toggleSound}
                className={cn(
                  "p-1.5 rounded-lg text-xs transition-colors cursor-pointer",
                  soundEnabled
                    ? "text-primary hover:bg-primary/10"
                    : "text-muted-foreground hover:bg-muted"
                )}
                title={soundEnabled ? "Mute alert sound" : "Enable alert sound"}
              >
                {soundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
              </button>

              {/* Mark All As Read */}
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted text-xs cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="size-4" />
                </button>
              )}

              {/* Clear All */}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-muted text-xs cursor-pointer"
                  title="Clear all"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-border/40">
            {notifications.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <Bell className="size-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-xs font-medium text-foreground">No notifications yet</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Real-time updates for job acceptance, progress, and emergency alerts will appear here.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={cn(
                    "flex items-start gap-3 p-3.5 transition-colors cursor-pointer hover:bg-muted/40",
                    !notif.read && "bg-primary/[0.03]"
                  )}
                >
                  {getNotificationIcon(notif.type, notif.status)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={cn(
                          "text-xs leading-snug truncate",
                          notif.read ? "font-medium text-foreground" : "font-bold text-foreground"
                        )}
                      >
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {formatTimestamp(notif.timestamp)}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                      {notif.message}
                    </p>

                    {notif.bookingNumber && (
                      <span className="inline-block text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground mt-1.5">
                        {notif.bookingNumber}
                      </span>
                    )}
                  </div>

                  {!notif.read && (
                    <span className="size-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
