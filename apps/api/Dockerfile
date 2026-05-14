FROM node:22-bookworm-slim AS build
# Prisma engines need OpenSSL; slim image omits it (runtime migrate also needs this in runner).
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /repo
COPY package.json package-lock.json ./
COPY tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
RUN npm ci
WORKDIR /repo/apps/api
RUN npx prisma generate
RUN npx tsc -p tsconfig.json

FROM node:22-bookworm-slim AS runner
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /repo
ENV NODE_ENV=production
RUN groupadd --gid 1001 nodejs && useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home nodejs
COPY package.json package-lock.json ./
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/apps ./apps
COPY --from=build /repo/packages ./packages
RUN chown -R nodejs:nodejs /repo
USER nodejs
WORKDIR /repo/apps/api
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
