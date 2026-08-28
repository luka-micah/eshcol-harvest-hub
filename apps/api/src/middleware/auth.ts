import type { Request, Response, NextFunction } from "express";
import { verifySession, type SessionUser } from "@/lib/auth-core";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}

function extractToken(req: Request): string | null {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  const cookie = req.headers.cookie?.split("; ").find((c) => c.startsWith("eh_token="));
  if (cookie) return decodeURIComponent(cookie.split("=")[1] ?? "");
  return null;
}

export function attachUser(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    const user = verifySession(token);
    if (user) req.user = user;
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: "Authentication required" });
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: "Authentication required" });
  if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}
