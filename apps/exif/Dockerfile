# ===== Base =====
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ===== Dependencies =====
FROM base AS deps
RUN npm install --include=dev

# ===== Development =====
FROM deps AS dev
RUN apk add --no-cache perl
ENV NODE_ENV=development
COPY . .
EXPOSE 3003
CMD ["npm", "run", "dev"]

# ===== Production =====
FROM node:20-alpine AS prod
WORKDIR /app

RUN apk add --no-cache perl

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3003
CMD ["node", "index.js"]
