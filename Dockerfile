# syntax=docker/dockerfile:1.7
#
# Multi-stage build for the CribHub Feathers API.
#
#   build stage  → installs ALL deps (incl. dev: typescript, ts-node, shx)
#                  and runs `npm run build` to produce ./lib
#   runtime stage → copies lib/ + config/ + production deps only
#
# Override the listen port at runtime with -e PORT=8080 (mapped by
# `config/custom-environment-variables.json`).
#
# Build:  docker build -t cribhub-api .
# Run:    docker run --rm -p 3000:3000 \
#           -e MONGODB_URL=mongodb://... \
#           -e FEATHERS_SECRET=$(openssl rand -hex 32) \
#           cribhub-api

ARG NODE_VERSION=22-alpine

# ────────────────────────────────────────────────────────────────────────────
# 1. builder
# ────────────────────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS builder
WORKDIR /app

# Install deps first (cached layer). Use `npm ci` for reproducible builds.
COPY package.json package-lock.json* ./
RUN npm ci --include=dev

# Copy sources required to compile.
COPY tsconfig.json ./
COPY src ./src
COPY config ./config

# Compile TypeScript → ./lib
RUN npm run build \
 && test -f lib/index.js \
 || (echo "::error:: build did not produce lib/index.js" && exit 1)

# ────────────────────────────────────────────────────────────────────────────
# 2. runtime
# ────────────────────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    NPM_CONFIG_LOGLEVEL=warn

# Install runtime deps only.
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled output + config + public assets.
COPY --from=builder /app/lib    ./lib
COPY --from=builder /app/config ./config

# Bring across the static public dir if it exists (some routes serve files).
COPY public ./public

# Drop root for runtime.
USER node

EXPOSE 3000

# Honour $PORT if the host injects one (Render/Railway/Coolify/Fly all do).
CMD ["node", "lib/"]
