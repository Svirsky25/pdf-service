import type { Section, PdfOptions } from "../types";

export const generateHtml = (
  sections: Section[],
  options: PdfOptions,
): string => {
  // 1. מיון הסעיפים לפי סדר
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  // 2. טיפול בלוגו - המרה מ-Buffer ל-Base64 במידת הצורך
  let logoSrc = "";
  if (options.logoBuffer) {
    // הפיכת ה-Buffer למחרוזת Base64 שתעבוד בתוך ה-HTML
    const base64 = Buffer.from(options.logoBuffer).toString("base64");
    logoSrc = `data:image/png;base64,${base64}`;
  } else if (options.logoUrl) {
    logoSrc = options.logoUrl;
  }

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;700&display=swap');

        body {
          font-family: 'Assistant', sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
          background-color: white;
        }

        @page {
          size: A4;
          margin: 0;
        }

        /* מבטיח שהכותרת תחזור בכל עמוד */
        thead { 
            display: table-header-group; 
        }

        /* מונע משורות להיחתך באמצע בצורה מכוערת */
        tr { 
            page-break-inside: avoid; 
        }

        /* חשוב לטבלאות גדולות */
        table {
            page-break-inside: auto;
        }

        /* דף שער - שמרתי על הגרדיאנט */
        .cover-page {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          page-break-after: always;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        /* הגדרות לוגו מעודכנות - הקטנה והתאמה */
        .logo {
          max-width: 420px;    /* הגבלה לרוחב הגיוני */
          max-height: 320px;   /* הגבלה לגובה הגיוני */
          object-fit: contain; /* שומר על פרופורציות בלי למרוח */
          margin-bottom: 30px;
        }

        .title {
          font-size: 42px;
          font-weight: 700;
          margin: 0;
          color: #1a2a6c;
        }

        .subtitle {
          font-size: 18px;
          color: #555;
          margin-top: 10px;
        }

        .content-container {
          padding: 50px 60px;
        }

        .section {
          margin-bottom: 40px;
          page-break-inside: avoid;
        }

        .page-break {
          page-break-after: always;
        }

        .section-title {
          font-size: 24px;
          font-weight: 700;
          border-bottom: 2px solid #1a2a6c;
          padding-bottom: 8px;
          margin-bottom: 15px;
          color: #1a2a6c;
        }

        .html-content {
          font-size: 16px;
          line-height: 1.6;
        }

        .html-content img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
        }

        .html-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }

        .html-content td, .html-content th {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: right;
        }

        .html-content blockquote {
          border-right: 4px solid #1a2a6c;
          padding-right: 15px;
          margin-right: 0;
          font-style: italic;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="cover-page">
        ${logoSrc ? `<img src="${logoSrc}" class="logo" alt="Company Logo" />` : ""}
        
        <h1 class="title">${options.title}</h1>
        <p class="subtitle">הופק באופן אוטומטי על ידי מערכת ניהול המסמכים</p>
        <div style="margin-top: 50px; font-weight: 300;">
          ${new Date().toLocaleDateString("he-IL")}
        </div>
      </div>

      <div class="content-container">
        ${sortedSections
          .map(
            (section) => `
          <div class="section ${options.splitPages ? "page-break" : ""}">
            ${section.title ? `<h2 class="section-title">${section.title}</h2>` : ""}
            <div class="html-content">
              ${section.html_content}
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    </body>
    </html>
  `;
};
