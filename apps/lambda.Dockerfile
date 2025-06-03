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

# Runtime container for Lambda - AWS公式ベースイメージを使用
FROM --platform=linux/amd64 public.ecr.aws/lambda/nodejs:22

# Copy frontend build artifacts into /dist
COPY --from=web-builder /app/web/dist ${LAMBDA_TASK_ROOT}/dist

# Copy built API files
COPY --from=api-builder /app/api/dist-api ${LAMBDA_TASK_ROOT}/
COPY --from=api-builder /app/api/package*.json ${LAMBDA_TASK_ROOT}/

# Install only production dependencies
COPY --from=api-builder /app/api/node_modules ${LAMBDA_TASK_ROOT}/node_modules
RUN npm install --production --prefix ${LAMBDA_TASK_ROOT}
RUN npx prisma generate --schema=${LAMBDA_TASK_ROOT}/prisma/schema.prisma

# Set the Lambda handler
CMD ["lambda.handler"]
