FROM node:18-alpine as base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
