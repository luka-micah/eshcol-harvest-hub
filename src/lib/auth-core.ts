import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET = process.env.AUTH_SECRET || "dev-secret-change-me-please";
const EXPIRES_IN = process.env.AUTH_TOKEN_TTL || "7d";

export type SessionUser = {
  id: string;
  email: string;
  role: string;
  name?: string | null;
};

export function signSession(user: SessionUser): string {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role, name: user.name ?? null }, SECRET, {
    expiresIn: EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifySession(token: string): SessionUser | null {
  try {
    const payload = jwt.verify(token, SECRET) as jwt.JwtPayload;
    return {
      id: String(payload.sub ?? ""),
      email: String(payload.email ?? ""),
      role: String(payload.role ?? "CUSTOMER"),
      name: (payload.name as string | null) ?? null,
    };
  } catch {
    return null;
  }
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
