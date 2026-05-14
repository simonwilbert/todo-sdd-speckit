FROM node:22-bookworm-slim AS build
WORKDIR /repo
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=${VITE_API_URL}
COPY package.json package-lock.json ./
COPY apps/web ./apps/web
COPY packages ./packages
RUN npm ci
RUN npm run build -w @todo/web

FROM nginx:1.27-alpine
COPY --from=build /repo/apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html
EXPOSE 80
USER nginx
