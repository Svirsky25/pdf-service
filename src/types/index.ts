import type { PDFOptions } from "puppeteer";

export interface PdfRequest {
  html: string;
  css?: string;
  pdfOptions?: {
    format?: PDFOptions['format'];
    landscape?: boolean;
    margin?: PDFOptions['margin'];
    displayHeaderFooter?: boolean;
    headerTemplate?: string;
    footerTemplate?: string;
  };
}
