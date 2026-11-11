const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(
  /\/$/,
  "",
);

let accessToken = null;
let refreshPromise = null;
let authFailureHandler = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

export const setAuthFailureHandler = (handler) => {
  authFailureHandler = handler;
};

/**
 * Refresh the access token using the httpOnly refresh cookie.
 * Deduplicates concurrent refresh calls.
 */
async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/user/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        clearAccessToken();
        return null;
      }

      const json = await res.json();
      const newToken = json.data?.accessToken;
      if (newToken) {
        setAccessToken(newToken);
        return newToken;
      }
      return null;
    } catch {
      clearAccessToken();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Wrapper around fetch that:
 * - Adds Authorization header automatically
 * - Retries once on 401 after refreshing the token
 * - Parses JSON responses
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  // If 401, try refreshing the token and retry once
  if (
    res.status === 401 &&
    accessToken &&
    !["/user/login", "/user/register", "/user/refresh"].includes(endpoint)
  ) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.Authorization = `Bearer ${newToken}`;
      res = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });
      if (res.status === 401) {
        clearAccessToken();
        authFailureHandler?.();
      }
    } else {
      authFailureHandler?.();
    }
  }

  // 204 No Content (e.g., logout)
  if (res.status === 204) {
    return { success: true, message: "Success", data: null };
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      json.error?.message ||
      (res.status >= 500
        ? "The support service is unavailable. Please try again shortly."
        : "Request failed");
    const err = new Error(message);
    err.code = json.error?.code || "UNKNOWN_ERROR";
    err.status = res.status;
    err.details = json.error?.details;
    throw err;
  }

  return json;
}
