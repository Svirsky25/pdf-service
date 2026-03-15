import { Hono } from "hono";
import { puppeteerService } from "../services/puppeteer.service";
import { requestValidator } from "../middlewares/requestValidator.middleware.js";
import type { PdfRequest } from "../types";

type Bindings = {
  Variables: {
    pdfData: PdfRequest
  };
};

const pdfRouter = new Hono<Bindings>();

/**
 * 1. Validate request
 * 2. Validate HTML
 * 3. Create PDF using Puppeteer
 */
pdfRouter.post(
  "/generate", 
  requestValidator, 
  async (c) => {
    try {
      const body = c.get('pdfData');
      const pdfBuffer = await puppeteerService.generatePdf(body);

      return c.body(new Uint8Array(pdfBuffer), 200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="document.pdf"',
      });

    } catch (error: any) {
      console.error("❌ PDF Generation Error:", error.message);

      return c.html(`
        <div style="font-family: sans-serif; padding: 20px; border: 2px solid #e53e3e; background: #fff5f5; border-radius: 10px;" dir="rtl">
          <h2 style="color: #c53030; margin-top: 0;">⚙️ שגיאה בתהליך יצירת הקובץ</h2>
          <p>הדפדפן נתקל בבעיה בזמן רינדור ה-PDF. ייתכן שמשאבים חיצוניים לא זמינים או שהשרת עמוס.</p>
          <div style="background: #edf2f7; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 0.9em;">
            <strong>פרטי שגיאה:</strong> ${error.message}
          </div>
        </div>
      `, 500);
    }
  }
);

export default pdfRouter;