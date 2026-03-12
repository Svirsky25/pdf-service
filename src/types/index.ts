import type { PDFOptions } from "puppeteer";

export interface PdfRequest {
  html: string;
  css?: string;
  pdfOptions?: PDFOptions
}
