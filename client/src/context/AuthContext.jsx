import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  apiFetch,
  setAccessToken,
  clearAccessToken,
  getAccessToken,
} from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Try to restore session on mount via refresh token
  useEffect(() => {
    (async () => {
      try {
        const json = await apiFetch("/user/refresh", { method: "POST" });
        if (json.data?.accessToken) {
          setAccessToken(json.data.accessToken);
          // Decode user info from JWT payload
          const payload = JSON.parse(atob(json.data.accessToken.split(".")[1]));
          setUser({
            id: payload.id,
            name: payload.name,
            email: payload.email,
            role: payload.role,
          });
        }
      } catch {
        // No valid session — that's fine
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    const json = await apiFetch("/user/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setAccessToken(json.data.accessToken);
    setUser(json.data.user);
    return json.data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const json = await apiFetch("/user/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    setAccessToken(json.data.accessToken);
    setUser(json.data.user);
    return json.data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch("/user/logout", { method: "POST" });
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
