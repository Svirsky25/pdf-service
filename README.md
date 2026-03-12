# 🛠️ High-Fidelity PDF Generation Service

A robust microservice for generating professional, print-ready PDF documents from dynamic HTML content (TinyMCE/WYSIWYG). Built with **Node.js 22**, **Hono**, and **Puppeteer**.

## 🌟 Key Features

- **Perfect RTL Support:** Specifically tuned for Hebrew, fixing common issues like reversed text on copy-paste.
- **Complex Table Handling:** Supports merged cells (`rowspan`/`colspan`) and repeating table headers.
- **Flexible Branding:** Dynamic cover pages with support for Image URLs or Base64 Buffers.
- **Modern Tech Stack:** Leveraging **pnpm**, **TypeScript (ESM)**, and **Hono**.

## 📂 Project Structure

```text
pdf-service/
├── src/
│   ├── routes/          # API Endpoint definitions
│   ├── services/        # Puppeteer core logic
│   ├── templates/       # HTML/CSS Layouts
│   ├── types/           # TypeScript Interfaces
│   └── index.ts         # Entry point
└── .puppeteerrc.cjs     # Browser cache config
```

## ⚙️ Installation & Setup

1. **Install Dependencies:** `pnpm install`
2. **Install Chromium:** `pnpm exec puppeteer browsers install chrome`
3. **Run Dev:** `pnpm dev` (Runs on `http://localhost:5000`)

## 📥 API Usage

**POST** `/api/pdf/generate`

**Request Body:**

```json
{
  "sections": [
    {
      "id": "1",
      "order": 1,
      "title": "דוגמא",
      "html_content": "<p>טקסט בעברית תקינה.</p>"
    }
  ],
  "options": {
    "title": "כותרת ראשית",
    "splitPages": false,
    "logoBuffer": "BASE64_STRING"
  }
}
```
