import { Hono } from "hono";
import { puppeteerService } from "../services/puppeteer.service";
import { requestValidator } from "../middlewares/requestValidator.middleware.js";

const pdfRouter = new Hono<{ Variables: { pdfData: any } }>();

pdfRouter.post("/generate", requestValidator, async (c) => {

  try {
    const body = c.get('pdfData');
    const pdfBuffer = await puppeteerService.generatePdf(body);

    return c.body(new Uint8Array(pdfBuffer), 200, {
      "Content-Type": "application/pdf",
    });

  } catch (error: any) {
    // גם בשגיאה כדאי לתעד מה קרה למשאבים
    console.error(`❌ Failed generating PDF. Error: ${error.message}`);
    throw error;
  }
});

export default pdfRouter;