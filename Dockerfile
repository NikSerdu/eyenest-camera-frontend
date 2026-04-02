# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG VITE_SERVER_URL=http://localhost:3000
ARG VITE_LIVEKIT_URL=ws://localhost:7880
ARG VITE_BASE=/cam/
ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_LIVEKIT_URL=$VITE_LIVEKIT_URL
ENV VITE_BASE=$VITE_BASE

RUN pnpm run build

FROM nginx:1.27-alpine AS production
COPY docker-entrypoint.sh /docker-entrypoint.sh
COPY nginx.docker.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
RUN chmod +x /docker-entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
