import type { IncomingMessage, ServerResponse } from "http";
import { createApp } from "../../apps/api/src/index";

const app = createApp();

/**
 * Vercel serverless bridge: expose the Express API under `/api/v1/*`.
 * Vercel strips the matched `/api/v1` prefix from `req.url`, so we re-add it
 * before handing the request to Express.
 */
export default function handler(req: IncomingMessage, res: ServerResponse) {
  const original = req.url || "/";
  req.url = "/api/v1" + original;
  return app(req, res);
}
