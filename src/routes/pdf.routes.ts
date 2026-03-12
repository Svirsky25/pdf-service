import { Hono } from "hono";
import { puppeteerService } from "../services/puppeteer.service";
import type { PdfOptions, Section } from "../types";

const pdfRoutes = new Hono();

pdfRoutes.post("/generate", async (c) => {
  const { sections, options } = await c.req.json<{
    sections: Section[];
    options: PdfOptions;
  }>();

  if (typeof options.logoBuffer === "string") {
    // אם זה הגיע כטקסט (Base64) מ-Postman, נהפוך אותו ל-Buffer
    options.logoBuffer = Buffer.from(options.logoBuffer, "base64");
  }

  const pdfBuffer = await puppeteerService.generatePdf(sections, options);

  // המרה של ה-Buffer ל-Uint8Array כדי ש-Hono יקבל אותו בשמחה
  return c.body(new Uint8Array(pdfBuffer), 200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="document.pdf"`,
  });
});

export { pdfRoutes };
