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
ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_LIVEKIT_URL=$VITE_LIVEKIT_URL

RUN pnpm run build

FROM nginx:1.27-alpine AS production
COPY nginx.docker.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
