import puppeteer, { Browser } from "puppeteer";
import type { Section, PdfOptions } from "../types";
import { generateHtml } from "../templates/document.template";

class PuppeteerService {
  private browser: Browser | null = null;

  /**
   * פונקציה פרטית להבטיח שהדפדפן נפתח עם הגדרות נכונות
   */
  private async getBrowser() {
    // בשרתים מומלץ להשתמש ב-No-Sandbox
    return await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--font-render-hinting=none", // לשיפור רינדור פונטים בעברית
      ],
    });
  }

  public async generatePdf(
    sections: Section[],
    options: PdfOptions,
  ): Promise<Buffer> {
    const browser = await this.getBrowser();

    try {
      const page = await browser.newPage();

      // הכנת ה-HTML
      const html = generateHtml(sections, options);

      // הגדרת תוכן והמתנה לטעינה מלאה (כולל פונטים ותמונות)
      await page.setContent(html, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      // יצירת ה-PDF
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: "<div></div>",
        footerTemplate: `
          <div style="font-size: 10px; width: 100%; text-align: center; direction: rtl; font-family: sans-serif; padding-bottom: 10px;">
            עמוד <span class="pageNumber"></span> מתוך <span class="totalPages"></span>
          </div>`,
        margin: {
          top: "60px",
          bottom: "60px",
          right: "40px",
          left: "40px",
        },
      });

      return Buffer.from(pdfBuffer);
    } catch (error) {
      console.error("Error during PDF generation:", error);
      throw error;
    } finally {
      await browser.close();
    }
  }
}

// ייצוא Instance יחיד (Singleton pattern)
export const puppeteerService = new PuppeteerService();
