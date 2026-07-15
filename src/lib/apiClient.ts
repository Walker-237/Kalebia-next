import type { ApiEnvelope } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;
  errors: unknown[];

  constructor(message: string, status: number, errors: unknown[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  accessToken?: string;
  body?: unknown;
  credentials?: RequestCredentials;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = "GET", accessToken, body, credentials, cache, next } = options;

  if (!API_URL) {
    throw new ApiError("NEXT_PUBLIC_API_URL is not set", 0);
  }

  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let requestBody: BodyInit | undefined;
  if (body instanceof FormData) {
    requestBody = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: requestBody,
      credentials,
      cache,
      next,
    });
  } catch {
    throw new ApiError("Could not reach the server. Is the backend running?", 0);
  }

  const json = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!json) {
    throw new ApiError("Unexpected response from the server", res.status);
  }

  if (!json.success) {
    throw new ApiError(json.message, res.status, json.errors ?? []);
  }

  return json.data;
}
