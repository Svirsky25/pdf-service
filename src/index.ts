import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { pdfRoutes } from "./routes/pdf.routes";

const app = new Hono();

app.use("*", logger());
app.route("/api/pdf", pdfRoutes);

const port = 5000;
console.log(`🚀 Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
