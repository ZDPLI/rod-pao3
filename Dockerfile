FROM node:20

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Build frontend
RUN npm run build && ls -la dist/public/

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["npx", "tsx", "api/boot.ts"]
