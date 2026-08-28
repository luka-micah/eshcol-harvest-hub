import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import productsRouter from "./routes/products";
import ordersRouter from "./routes/orders";
import paymentsRouter from "./routes/payments";
import bulkOrdersRouter from "./routes/bulk-orders";
import contactRouter from "./routes/contact";
import postsRouter from "./routes/posts";
import deliveryRouter from "./routes/delivery";
import inventoryRouter from "./routes/inventory";
import customersRouter from "./routes/customers";
import categoriesRouter from "./routes/categories";
import { attachUser } from "./middleware/auth";

/** Build the Express application (shared by local dev and serverless hosts). */
export function createApp() {
  const app = express();
  const WEB_ORIGIN = process.env.WEB_ORIGIN ?? "http://localhost:3000";

  app.use(cors({ origin: WEB_ORIGIN, credentials: true }));
  app.use(cookieParser());
  app.use(
    express.json({
      verify: (req, _res, buf) => {
        (req as unknown as { rawBody?: string }).rawBody = buf.toString("utf8");
      },
    }),
  );

  app.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));

  app.use(attachUser);

  const api = express.Router();
  api.use("/auth", authRouter);
  api.use("/products", productsRouter);
  api.use("/orders", ordersRouter);
  api.use("/payments", paymentsRouter);
  api.use("/bulk-orders", bulkOrdersRouter);
  api.use("/contact", contactRouter);
  api.use("/posts", postsRouter);
  api.use("/delivery", deliveryRouter);
  api.use("/inventory", inventoryRouter);
  api.use("/customers", customersRouter);
  api.use("/categories", categoriesRouter);

  app.use("/api/v1", api);

  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: `Not found: ${req.method} ${req.path}` });
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error("[api] unhandled error", err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}

// Local dev / standalone server: only listen when not running on Vercel (serverless).
if (!process.env.VERCEL) {
  const app = createApp();
  const PORT = Number(process.env.API_PORT ?? 4000);
  app.listen(PORT, () => {
    console.log(`[api] Eshcol Harvest Hub API listening on http://localhost:${PORT}`);
  });
}
