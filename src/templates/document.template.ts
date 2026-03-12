// src/templates/document.template.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Section, PdfOptions } from "../types";

// הגדרת __dirname ידנית עבור ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateHtml = (
  sections: Section[],
  options: PdfOptions,
): string => {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  // עכשיו הקוד הזה יעבוד
  const stylesPath = path.join(__dirname, "styles");

  try {
    const typographyCss = fs.readFileSync(
      path.join(stylesPath, "typography.css"),
      "utf8",
    );
    const coverCss = fs.readFileSync(
      path.join(stylesPath, "cover.css"),
      "utf8",
    );
    const contentCss = fs.readFileSync(
      path.join(stylesPath, "content.css"),
      "utf8",
    );

    // ... שאר הלוגיקה
    let logoSrc = "";
    if (options.logoBuffer) {
      logoSrc = `data:image/png;base64,${Buffer.from(options.logoBuffer).toString("base64")}`;
    } else if (options.logoUrl) {
      logoSrc = options.logoUrl;
    }

    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <style>
          ${typographyCss}
          ${coverCss}
          ${contentCss}
        </style>
      </head>
      <body>
        <div class="cover-page">
          ${logoSrc ? `<img src="${logoSrc}" class="logo" />` : ""}
          <h1 class="title">${options.title}</h1>
          <p class="subtitle">הופק באופן אוטומטי</p>
        </div>
        <div class="content-container">
          ${sortedSections
            .map(
              (s) => `
            <div class="section">
              <h2 class="section-title">${s.title}</h2>
              <div class="html-content">${s.html_content}</div>
            </div>
          `,
            )
            .join("")}
        </div>
      </body>
      </html>
    `;
  } catch (error) {
    console.error("Error reading CSS files:", error);
    return "<h1>Error loading styles</h1>";
  }
};
