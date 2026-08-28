import type { Request, Response } from "express";
import type { ZodSchema } from "zod";
import { Prisma } from "@prisma/client";

function jsonReplacer(_key: string, value: unknown) {
  if (value instanceof Prisma.Decimal) return value.toNumber();
  return value;
}

export function ok(res: Response, data: unknown, status = 200) {
  const payload = JSON.stringify(data, jsonReplacer);
  return res.status(status).type("application/json").send(payload);
}

export function fail(res: Response, message: string, status = 400) {
  return res.status(status).json({ error: message });
}

export type Parsed<T> = { ok: true; data: T } | { ok: false; error: string; status: number };

export async function parseBody<T>(req: Request, schema: ZodSchema<T>): Promise<Parsed<T>> {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid request";
    return { ok: false, error: message, status: 422 };
  }
  return { ok: true, data: parsed.data };
}

/** Convert a thrown service error into a friendly API error. */
export function toError(e: unknown): { message: string; status: number } {
  const message = e instanceof Error ? e.message : "Request failed";
  let status = 400;
  if (/not found/i.test(message)) status = 404;
  else if (/unavailable|insufficient|not available/i.test(message)) status = 422;
  return { message, status };
}
