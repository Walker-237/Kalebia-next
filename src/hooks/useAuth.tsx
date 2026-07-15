"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { apiRequest } from "@/lib/apiClient";
import type { AdminSummary } from "@/lib/types";

interface LoginResponse {
  accessToken: string;
  admin: AdminSummary;
}

interface AuthContextValue {
  admin: AdminSummary | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Returns the fresh access token on success, or null if the session couldn't be restored. */
  refreshSession: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Plain (non-hook) helper so the mount effect below can set state directly
// from its own `.then()` instead of going through the `refreshSession`
// useCallback — keeps the state update tied to the effect that owns it.
async function fetchRefreshedSession(): Promise<LoginResponse | null> {
  try {
    return await apiRequest<LoginResponse>("/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminSummary | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async (): Promise<string | null> => {
    const data = await fetchRefreshedSession();
    if (data) {
      setAccessToken(data.accessToken);
      setAdmin(data.admin);
      return data.accessToken;
    }
    setAccessToken(null);
    setAdmin(null);
    return null;
  }, []);

  useEffect(() => {
    fetchRefreshedSession().then((data) => {
      if (data) {
        setAccessToken(data.accessToken);
        setAdmin(data.admin);
      }
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      credentials: "include",
      body: { email, password },
    });
    setAccessToken(data.accessToken);
    setAdmin(data.admin);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      setAccessToken(null);
      setAdmin(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ admin, accessToken, isLoading, login, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
