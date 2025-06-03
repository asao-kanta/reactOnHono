# Frontend build
FROM --platform=linux/amd64 node:22-alpine AS web-builder
WORKDIR /app
COPY tsconfig.base.json .
COPY api ./api
COPY web ./web
# API dependencies and schema generation for web to use
WORKDIR /app/api
RUN npm install
RUN npx prisma generate --schema=./src/prisma/schema.prisma
# Build web with API types available
WORKDIR /app/web
RUN npm install && npm run build

# Backend build
FROM --platform=linux/amd64 node:22-alpine AS api-builder
WORKDIR /app
COPY tsconfig.base.json .
COPY api ./api
WORKDIR /app/api
RUN npm install
RUN npx prisma generate --schema=./src/prisma/schema.prisma
RUN npm run build

# Runtime container
FROM --platform=linux/amd64 node:22-alpine AS api-runtime
WORKDIR /app

# Copy frontend build artifacts into /dist
COPY --from=web-builder /app/web/dist ./dist

# Copy backend code and reinstall deps
COPY --from=api-builder /app/api ./api
WORKDIR /app/api

# Install dependencies with platform-specific rebuild
RUN npm install
RUN npx prisma generate --schema=./src/prisma/schema.prisma

# Expose port and run Hono backend
EXPOSE 3000
CMD ["npm", "run", "dev"]
