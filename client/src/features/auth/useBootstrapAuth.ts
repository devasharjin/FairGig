import { useEffect, useRef } from "react";
import { useAuthStore } from "./store";
import { getMe } from "./api";

export function useBootstrapAuth() {
  const setLoading = useAuthStore((s) => s.setLoading);
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const hasRunRef = useRef(false);

  useEffect(() => {
    if (useAuthStore.getState().isBootstrapped || hasRunRef.current) {
      return;
    }
    hasRunRef.current = true;

    setLoading();

    // Safety timeout to prevent hanging on loader if API is unresponsive
    const timeoutId = setTimeout(() => {
      if (!useAuthStore.getState().isBootstrapped) {
        clearAuth();
      }
    }, 5000);

    getMe()
      .then((me: any) => {
        setUser(me?.user || me);
      })
      .catch(() => {
        clearAuth();
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });
  }, [setLoading, setUser, clearAuth]);
}