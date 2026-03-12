import type { PdfRequest } from "../types";

type Options = Pick<PdfRequest, 'html' | 'css'>

export const generateHtml = ({html, css}: Options): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        ${css || ""}
      </style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `;
};