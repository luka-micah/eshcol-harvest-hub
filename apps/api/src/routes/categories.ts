import { Router } from "express";
import { prisma } from "@/lib/db";
import { ok } from "../lib/http";

const router = Router();

router.get("/", async (_req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return ok(res, { categories });
});

export default router;
