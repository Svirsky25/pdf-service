export interface Section {
  id: string;
  html_content: string;
  title?: string;
  order: number;
}

export interface PdfOptions {
  title: string;
  splitPages: boolean;
  logoUrl?: string;
  logoBuffer?: Buffer | Uint8Array;
}
