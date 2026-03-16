# --- שלב 1: התקנה ובנייה ---
FROM node:20-slim AS base
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* tsconfig.json ./
RUN pnpm install

# --- שלב 2: הרצה ---
FROM node:20-slim
WORKDIR /app

# 1. הגדרת משתמש 1001 והכנת התיקיות עם הרשאות ל-OpenShift (GID 0)
RUN useradd -m -u 1001 pptruser && \
    mkdir -p /app/.cache/puppeteer && \
    # ב-OpenShift חייבים לתת בעלות לקבוצה 0 (root) על תיקיות כתיבה
    chown -R 1001:0 /app && \
    chmod -R g+w /app

ENV PUPPETEER_CACHE_DIR=/app/.cache/puppeteer

# 2. התקנת ספריות מערכת (הגרסה היציבה שעברה בבילד)
RUN apt-get update && apt-get install -y --no-install-recommends \
    tini \
    libxkbcommon0 \
    libgbm1 \
    ca-certificates \
    wget \
    lsb-release \
    xdg-utils \
    fonts-noto-core \
    fonts-noto-ui-core \
    fonts-noto-color-emoji \
    fonts-liberation \
    fonts-freefont-ttf \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    libxshmfence1 \
    libdrm2 \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

# 3. מעבר למשתמש 1001
USER 1001

COPY --chown=1001:0 --from=base /app/node_modules ./node_modules
COPY --chown=1001:0 . .

# 4. התקנת הדפדפן (כמשתמש 1001 בתוך התיקייה עם הרשאות הקבוצה)
RUN npx puppeteer browsers install chrome

# הבטחת הרשאות מלאות ל-Cache עבור משתמשים אקראיים ב-OpenShift
RUN chmod -R 777 /app/.cache/puppeteer

EXPOSE 5000

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["pnpm", "start"]