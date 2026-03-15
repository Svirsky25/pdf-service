import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { requestId } from "hono/request-id";
import { readFile } from "node:fs/promises";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import pdfRouter from "./routes/pdf.routes.js";

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

app.get('/tutman', async (c) => {
  const image = await readFile('./assets/tutmanUltras.png')
  return c.body(image, 200, { 'Content-Type': 'image/png'})
})

app.route("/api/pdf", pdfRouter);



const port = 5000;
console.log(`🚀 PDF Service running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });