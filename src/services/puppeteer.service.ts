import puppeteer, { Browser, type PDFOptions } from "puppeteer";
import type { PdfRequest } from "../types";
import { generateHtml } from "../templates/document.template";

class PuppeteerService {
  private async getBrowser(): Promise<Browser> {
    return await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage", // Prevent memory leaking in Docker
        "--font-render-hinting=none",
      ],
    });
  }

  public async generatePdf(data: PdfRequest): Promise<Buffer> {
    const browser = await this.getBrowser();

    try {
      const page = await browser.newPage();
      const finalHtml = generateHtml({ html: data.html, css: data.css });

      await page.setContent(finalHtml, {
        waitUntil: "networkidle0",
        timeout: 60000,
      });

      const defaultPdfOptions: PDFOptions = {
        format: "A4",
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: "<div></div>",
        footerTemplate: `<div></div>`,
        margin: {
          top: "20mm",
          bottom: "20mm",
          right: "15mm",
          left: "15mm",
        },
      };

      const finalPdfOptions: PDFOptions = {
        ...defaultPdfOptions,
        ...(data.pdfOptions || {}),
      };

      const pdfBuffer = await page.pdf(finalPdfOptions);

      console.error("✅ Finished generating PDF successfully!");
      return Buffer.from(pdfBuffer);
    } catch (error) {
      console.error("❌ Error during PDF generation:", error);
      throw error;
    } finally {
      await browser.close();
    }
  }
}

export const puppeteerService = new PuppeteerService();