FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && \
    pnpm install --frozen-lockfile

COPY . .

RUN npm run docs:build && \
    npm run build

FROM node:lts-alpine
LABEL authors="梦清"

WORKDIR /app

# 安装 curl 以支持健康检查
RUN apk add --no-cache curl

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/docs/.vuepress/dist ./docs

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && \
    pnpm install --frozen-lockfile --prod

ENV NODE_ENV=production
EXPOSE 1028
ENTRYPOINT ["node", "dist/app.js"]
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD curl -sf http://localhost:1028/api || exit 1
