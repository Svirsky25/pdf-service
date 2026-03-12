import { Hono } from "hono";
import { puppeteerService } from "../services/puppeteer.service.js";
import type { PdfRequest } from "../types";

const pdfRoutes = new Hono();

pdfRoutes.post("/generate", async (c) => {
  const req = await c.req.json<{
    html: string;
    options: PdfRequest['pdfOptions'];
    css?: string;
  }>();

  const pdfBuffer = await puppeteerService.generatePdf(req);

  return c.body(new Uint8Array(pdfBuffer), 200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="document.pdf"`,
  });
});

export { pdfRoutes };

