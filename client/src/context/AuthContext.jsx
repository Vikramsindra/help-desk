import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContextValue";
import {
  hasStoredSession,
  setAccessToken,
  clearAccessToken,
  setAuthFailureHandler,
} from "../lib/api";
import { authService } from "../services/authService";
import toast from "react-hot-toast";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => hasStoredSession());

  const handleAuthFailure = useCallback(() => {
    clearAccessToken();
    setUser(null);
    toast.error("Your session has expired. Please sign in again.");
  }, []);

  useEffect(() => {
    setAuthFailureHandler(handleAuthFailure);
    return () => setAuthFailureHandler(null);
  }, [handleAuthFailure]);

  // Try to restore session on mount via refresh token
  useEffect(() => {
    let active = true;

    if (!hasStoredSession()) {
      return () => {
        active = false;
      };
    }

    (async () => {
      try {
        const refreshed = await authService.refresh();
        const token = refreshed.data?.accessToken;
        if (!token) throw new Error("No active session");
        setAccessToken(token);
        const currentUser = await authService.me();
        if (active && currentUser.data?.id) setUser(currentUser.data);
      } catch {
        clearAccessToken();
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const json = await authService.login(email, password);
    setAccessToken(json.data.accessToken);
    setUser(json.data.user);
    return json.data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const json = await authService.register(name, email, password);
    setAccessToken(json.data.accessToken);
    setUser(json.data.user);
    return json.data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Logout should always succeed client-side
    }
    clearAccessToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
