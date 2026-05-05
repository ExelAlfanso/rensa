# ===== Base =====
FROM node:20-alpine AS base
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

ARG NEXT_PUBLIC_ELYSIA_WS_URL
ENV NEXT_PUBLIC_ELYSIA_WS_URL=$NEXT_PUBLIC_ELYSIA_WS_URL

ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# ===== Dependencies =====
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/ ./packages/
COPY apps/web/package.json ./apps/web/package.json
RUN pnpm install --filter @rensa/web... --frozen-lockfile --ignore-scripts

# ===== Build =====
FROM deps AS build

ARG NEXT_PUBLIC_ELYSIA_WS_URL
ENV NEXT_PUBLIC_ELYSIA_WS_URL=$NEXT_PUBLIC_ELYSIA_WS_URL

ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

COPY apps/web/ ./apps/web/
RUN pnpm --filter @rensa/web build

# ===== Development =====
FROM deps AS dev

ARG NEXT_PUBLIC_ELYSIA_WS_URL
ENV NEXT_PUBLIC_ELYSIA_WS_URL=$NEXT_PUBLIC_ELYSIA_WS_URL

ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

COPY apps/web/ ./apps/web/
EXPOSE 3000
CMD ["pnpm", "--filter", "@rensa/web", "dev"]

# ===== Production =====
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

ARG NEXT_PUBLIC_ELYSIA_WS_URL
ENV NEXT_PUBLIC_ELYSIA_WS_URL=$NEXT_PUBLIC_ELYSIA_WS_URL

ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/ ./packages/
COPY apps/web/package.json ./apps/web/package.json
RUN pnpm install --filter @rensa/web... --frozen-lockfile --prod --ignore-scripts

COPY --from=build /app/apps/web/.next ./apps/web/.next
COPY --from=build /app/apps/web/public ./apps/web/public

WORKDIR /app/apps/web
EXPOSE 3000
CMD ["pnpm", "start"]
