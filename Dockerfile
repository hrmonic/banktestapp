# Dockerfile Multi-Stage Sécurisé (Généré par Aegis CI/CD Toolbox)
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --if-present

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/bin ./bin
RUN chown -R node:node /app
USER node
EXPOSE 4177
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:4177/api/health || exit 1
CMD ["node", "bin/ci-cd-toolbox.js", "start"]
