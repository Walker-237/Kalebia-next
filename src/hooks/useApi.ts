"use client";

import { useCallback } from "react";
import { apiRequest, ApiError, type ApiRequestOptions } from "@/lib/apiClient";
import { useAuth } from "./useAuth";

/**
 * Authenticated request function bound to the current access token.
 * On a 401 (access token expired mid-session — it's short-lived by
 * design), attempts one silent refresh + retry before giving up.
 */
export function useApi() {
  const { accessToken, refreshSession, logout } = useAuth();

  return useCallback(
    async <T,>(path: string, options: ApiRequestOptions = {}): Promise<T> => {
      try {
        return await apiRequest<T>(path, { ...options, accessToken: accessToken ?? undefined });
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          const freshToken = await refreshSession();
          if (freshToken) {
            return await apiRequest<T>(path, { ...options, accessToken: freshToken });
          }
          await logout();
        }
        throw err;
      }
    },
    [accessToken, refreshSession, logout]
  );
}
