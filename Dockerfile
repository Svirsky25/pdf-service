# --- שלב 1: התקנה ובנייה ---
FROM node:22-slim AS base
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* tsconfig.json ./
RUN pnpm install

# --- שלב 2: הרצה ---
FROM node:22-slim
WORKDIR /app

# 1. הגדרת משתמש 1001 והכנת התיקיות מראש
RUN useradd -m -u 1001 pptruser && \
    mkdir -p /app/.cache/puppeteer && \
    chown -R 1001:1001 /app

# הגדרת משתנה סביבה ל-Cache
ENV PUPPETEER_CACHE_DIR=/app/.cache/puppeteer

# 2. התקנת ספריות מערכת (כ-root)
RUN apt-get update && apt-get install -y \
    fonts-liberation fonts-noto-core fonts-noto-ui-core fonts-noto-color-emoji \
    fonts-freefont-ttf libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 \
    libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 \
    libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 \
    libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \
    libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 \
    libxi6 libxrandr2 libxrender1 libxss1 libxtst6 libxshmfence1 \
    libdrm2 lsb-release wget xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

# 3. מעבר למשתמש 1001 לביצוע הפעולות הבאות
USER 1001

# העתקת הקוד והתלויות (בשימוש ב-chown כדי שהבעלות תעבור למשתמש 1001)
COPY --chown=1001:1001 --from=base /app/node_modules ./node_modules
COPY --chown=1001:1001 . .

# 4. התקנת הדפדפן כמשתמש 1001
# זה מבטיח שכל קבצי ה-Chrome שייכים לו והוא יכול להריץ ולכתוב להם
RUN pnpm puppeteer browsers install chrome

# הבטחת הרשאות הרצה (Execute) על כל התיקייה
RUN chmod -R 755 /app/.cache/puppeteer

EXPOSE 5000

CMD ["pnpm", "start"]