FROM node:22-bookworm-slim AS build
WORKDIR /repo
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=${VITE_API_URL}
COPY package.json package-lock.json ./
COPY tsconfig.base.json ./
COPY apps/web ./apps/web
COPY packages ./packages
RUN npm ci
RUN npm run build -w @todo/web

FROM nginx:1.27-alpine
# Default image runs nginx master as root (bind :80, write caches); workers run unprivileged.
COPY --from=build /repo/apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html
EXPOSE 80
