import type { PDFOptions } from "puppeteer";

export interface PdfRequest {
  html: string
  pdfOptions?: PDFOptions
}
