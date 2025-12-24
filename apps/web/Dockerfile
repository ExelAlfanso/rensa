# ===== Base =====
FROM node:20-alpine AS base
WORKDIR /app

# ===== Dependencies =====
FROM base AS deps
COPY package*.json ./
RUN npm install

# ===== Development =====
FROM deps AS dev
COPY . .
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ===== Build =====
FROM deps AS build
COPY . .
RUN npm run build

# ===== Production =====
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package*.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
