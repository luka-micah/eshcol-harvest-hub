import { Router } from "express";
import { listCustomers } from "@/services/customers/customer.service";
import { requireAdmin } from "../middleware/auth";
import { ok } from "../lib/http";

const router = Router();

router.get("/", requireAdmin, async (_req, res) => {
  const customers = await listCustomers();
  return ok(res, { customers });
});

export default router;
