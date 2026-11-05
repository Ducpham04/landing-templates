# syntax=docker/dockerfile:1
# Build 1 app frontend trong workspace (admin hoặc 1 landing) rồi phục vụ bằng Nginx.
FROM node:22-alpine AS build
WORKDIR /repo
COPY package.json package-lock.json ./
COPY apps/admin/package.json apps/admin/
COPY apps/real-estate/package.json apps/real-estate/
COPY apps/interior/package.json apps/interior/
COPY apps/education/package.json apps/education/
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund --ignore-scripts
COPY apps ./apps
ARG APP
ARG VITE_LEAD_ENDPOINT=""
ARG VITE_PUBLIC_API_ORIGIN=""
ENV VITE_LEAD_ENDPOINT=$VITE_LEAD_ENDPOINT VITE_PUBLIC_API_ORIGIN=$VITE_PUBLIC_API_ORIGIN
RUN npm run build -w apps/${APP}

FROM nginx:1.27-alpine
ARG APP
ARG NGINX_CONF=landing.conf
COPY docker/nginx/${NGINX_CONF} /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/${APP}/dist /usr/share/nginx/html
EXPOSE 80
