FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY vue-app/package*.json ./
RUN npm install
COPY vue-app/ .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --omit=dev
COPY backend/ .
COPY --from=frontend-builder /app/dist ./public
EXPOSE 3001
CMD ["node", "server.js"]
