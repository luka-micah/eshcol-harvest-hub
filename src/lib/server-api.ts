import { cookies } from "next/headers";
import { apiUrl } from "@/lib/api-client";

/** Server-side fetch to the backend API (reads the session cookie). */
export async function serverApiFetch(path: string, init: RequestInit = {}) {
  const store = await cookies();
  const token = store.get("eh_token")?.value;
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(apiUrl(path), { ...init, headers, cache: "no-store" });
}
