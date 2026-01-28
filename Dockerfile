# syntax=docker/dockerfile:1

FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_BE_API
ARG VITE_BYPASS_AUTH
ENV VITE_BE_API=${VITE_BE_API}
ENV VITE_BYPASS_AUTH=${VITE_BYPASS_AUTH}

RUN npm run build:docker

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
