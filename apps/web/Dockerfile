# ===== Base =====
FROM node:20-alpine AS base
WORKDIR /app


ARG NEXT_PUBLIC_ELYSIA_WS_URL
ENV NEXT_PUBLIC_ELYSIA_WS_URL=$NEXT_PUBLIC_ELYSIA_WS_URL

# ===== Dependencies =====
FROM base AS deps
COPY package*.json ./
RUN npm ci

# ===== Build =====
FROM deps AS build
COPY . .
RUN npm run build

# ===== Production =====
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
