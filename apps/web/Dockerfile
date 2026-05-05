# ===== Base =====
FROM node:20-alpine AS base
WORKDIR /app

ARG NEXT_PUBLIC_ELYSIA_WS_URL
ENV NEXT_PUBLIC_ELYSIA_WS_URL=$NEXT_PUBLIC_ELYSIA_WS_URL

ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

# ===== Dependencies =====
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/web/package.json .
COPY packages/db/package.json ./packages/db/
COPY packages/config/package.json ./packages/config/
RUN pnpm install --frozen-lockfile

COPY packages ./packages

# ===== Build =====
FROM deps AS build

ARG NEXT_PUBLIC_ELYSIA_WS_URL
ENV NEXT_PUBLIC_ELYSIA_WS_URL=$NEXT_PUBLIC_ELYSIA_WS_URL

ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

COPY apps/web .
RUN pnpm --filter @rensa/web build

# ===== Development =====
FROM deps AS dev

ARG NEXT_PUBLIC_ELYSIA_WS_URL
ENV NEXT_PUBLIC_ELYSIA_WS_URL=$NEXT_PUBLIC_ELYSIA_WS_URL

ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

COPY apps/web .
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

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/db/package.json ./packages/db/
COPY packages/config/package.json ./packages/config/
RUN pnpm install --frozen-lockfile --prod

COPY packages ./packages
COPY --from=build /app/apps/web/.next ./apps/web/.next
COPY --from=build /app/apps/web/public ./apps/web/public

EXPOSE 3000
CMD ["pnpm", "--filter", "@rensa/web", "start"]
