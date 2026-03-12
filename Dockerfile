# --- שלב 1: התקנה ובנייה ---
FROM node:22-slim AS base
WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* tsconfig.json ./
RUN pnpm install

# --- שלב 2: הרצה ---
FROM node:22-slim
WORKDIR /app

# עדכון מערכת והתקנת ספריות + פונטים לעברית
RUN apt-get update && apt-get upgrade -y && apt-get install -y \
    fonts-liberation \
    fonts-noto-core \
    fonts-noto-ui-core \
    fonts-noto-color-emoji \
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
    libgbm1 \
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
    lsb-release \
    wget \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

# העתקת התלויות והקוד
COPY --from=base /app/node_modules ./node_modules
COPY . .

# התקנת הדפדפן בתוך הקונטיינר
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
RUN pnpm puppeteer browsers install chrome

EXPOSE 5000

# הרצה עם tsx
CMD ["pnpm", "start"]