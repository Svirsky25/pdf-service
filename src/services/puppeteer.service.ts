import puppeteer, { type PDFOptions } from "puppeteer";
import type { PdfRequest } from "../types";

class PuppeteerService {
  public async generatePdf(data: PdfRequest): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ]
    });

    try {
      const page = await browser.newPage();

      try {
        await page.setContent(data.html, {
          waitUntil: "networkidle0",
          timeout: 60000,
        });

        await page.evaluateHandle('document.fonts.ready');
        
      } catch (contentError: any) {
        throw new Error(`Content Loading Error: ${contentError.message}. This often happens due to broken external links or images.`);
      }

      const defaultPdfOptions: PDFOptions = {
        format: "A4",
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: "<div></div>",
        footerTemplate: "<div></div>",
        margin: { top: "20mm", bottom: "20mm", right: "15mm", left: "15mm" },
      };

      const finalPdfOptions: PDFOptions = {
        ...defaultPdfOptions,
        ...(data.pdfOptions || {}),
      };

      const pdfBuffer = await page.pdf(finalPdfOptions);
      console.info("✅ PDF generated successfully");
      
      return Buffer.from(pdfBuffer);
    } catch (error: any) {
      console.error("❌ Puppeteer Service Error:", error.message);
      throw error; 
    } finally {
      await browser.close();
    }
  }
}

export const puppeteerService = new PuppeteerService();