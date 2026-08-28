const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

/** Absolute URL to the standalone backend API. */
export function apiUrl(path: string): string {
  return `${API_URL}${path.startsWith("/") ? path : "/" + path}`;
}

function tokenFromBrowser(): string | null {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith("eh_token="));
  return cookie ? decodeURIComponent(cookie.split("=")[1] ?? "") : null;
}

/** Client-side fetch to the backend API (adds the session token when present). */
export async function clientApiFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = tokenFromBrowser();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(apiUrl(path), { ...init, headers, credentials: "include" });
}

/** Persist the auth token in a cookie readable by both client and server. */
export function setSessionCookie(token: string, days = 7) {
  if (typeof document === "undefined") return;
  document.cookie = `eh_token=${encodeURIComponent(token)}; path=/; max-age=${days * 86400}; samesite=lax`;
}

export function clearSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "eh_token=; path=/; max-age=0; samesite=lax";
}
