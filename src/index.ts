import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { requestId } from "hono/request-id";
import { pdfRoutes } from "./routes/pdf.routes";
import { loggerMiddleware } from "./middlewares/logger.middleware";

type Env = {
  Variables: {
    requestId: string;
  };
};

const app = new Hono<Env>();

// Request id injection
app.use("*", requestId());

app.use("*", loggerMiddleware);

app.get("/readiness", (c) => {
  const uptimeSeconds = process.uptime();
  const uptimeMs = Math.round(uptimeSeconds * 1000);

  return c.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.floor(uptimeSeconds),
      ms: uptimeMs,
      human_readable: `${Math.floor(uptimeSeconds)}s`
    },
    node_version: process.version,
    memory: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`
  });
});

app.route("/api/pdf", pdfRoutes);

const port = 5000;
console.log(`🚀 PDF Service running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });