# ---- Frontend build ----
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build


# ---- Backend deps ----
FROM node:20-alpine AS backend-deps
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts


# ---- Runtime ----
FROM node:20-alpine
WORKDIR /app

# backend deps + code
COPY --from=backend-deps /app/node_modules ./node_modules
COPY . .

# frontend dist
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

EXPOSE 3000
CMD ["npm", "start"]
