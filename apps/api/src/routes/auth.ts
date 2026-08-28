import { Router } from "express";
import { prisma } from "@/lib/db";
import { registerCustomer } from "@/services/customers/customer.service";
import { signSession, comparePassword } from "@/lib/auth-core";
import { z } from "zod";
import { ok, fail, parseBody, toError } from "../lib/http";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  customerType: z.enum(["HOUSEHOLD", "RETAILER", "OFFTAKER", "OTHER"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function publicUser(u: { id: string; name: string | null; email: string; role: string }) {
  return { id: u.id, name: u.name, email: u.email, role: u.role };
}

const router = Router();

router.post("/register", async (req, res) => {
  const parsed = await parseBody(req, registerSchema);
  if (!parsed.ok) return fail(res, parsed.error, parsed.status);
  try {
    const user = await registerCustomer(parsed.data);
    const token = signSession(publicUser(user));
    return ok(res, { user: publicUser(user), token }, 201);
  } catch (e) {
    const { message, status } = toError(e);
    return fail(res, message, status);
  }
});

router.post("/login", async (req, res) => {
  const parsed = await parseBody(req, loginSchema);
  if (!parsed.ok) return fail(res, parsed.error, parsed.status);
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase().trim() } });
  if (!user || !user.passwordHash) return fail(res, "Invalid credentials", 401);
  const valid = await comparePassword(parsed.data.password, user.passwordHash);
  if (!valid) return fail(res, "Invalid credentials", 401);
  const token = signSession(publicUser(user));
  return ok(res, { user: publicUser(user), token });
});

router.post("/admin/login", async (req, res) => {
  const parsed = await parseBody(req, loginSchema);
  if (!parsed.ok) return fail(res, parsed.error, parsed.status);
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase().trim() } });
  if (!user || !user.passwordHash) return fail(res, "Invalid credentials", 401);
  const valid = await comparePassword(parsed.data.password, user.passwordHash);
  if (!valid) return fail(res, "Invalid credentials", 401);
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") return fail(res, "Admin access required", 403);
  const token = signSession(publicUser(user));
  return ok(res, { user: publicUser(user), token });
});

export default router;
