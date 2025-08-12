# Stage 1: Build
FROM node:20-alpine AS build

RUN apk add --no-cache \
	chromium \
	nss \
	freetype \
	harfbuzz \
	ca-certificates \
	ttf-freefont

WORKDIR /app

COPY package*.json tsconfig*.json ./

ENV PUPPETEER_SKIP_DOWNLOAD=false

RUN npm install

COPY . .
RUN npm run build


# Stage 2: Production
FROM node:20-alpine

RUN apk add --no-cache \
	chromium \
	nss \
	freetype \
	harfbuzz \
	ca-certificates \
	ttf-freefont

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

# Puppeteer expects to find Chromium at this path in Alpine
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

EXPOSE 8080
CMD ["node", "dist/index.js"]
