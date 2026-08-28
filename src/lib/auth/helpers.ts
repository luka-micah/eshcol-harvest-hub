import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, type SessionUser } from "@/lib/auth-core";

const ADMIN_ROLES = new Set(["SUPER_ADMIN", "ADMIN"]);

/** Read the current session from the `eh_token` cookie (server components only). */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get("eh_token")?.value;
  if (!token) return null;
  return verifySession(token);
}

/** Alias kept for compatibility with existing call sites. */
export const getCurrentUser = getSession;

export async function requireUser(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect("/account/login");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSession();
  if (!user || !ADMIN_ROLES.has(user.role)) redirect("/account/login");
  return user;
}

export function isAdminRole(role: string | undefined): boolean {
  return !!role && ADMIN_ROLES.has(role);
}
