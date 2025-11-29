# ===== STAGE 1: BUILD =====
FROM node:22.15-alpine AS builder

WORKDIR /app

# Copy file yang dibutuhkan untuk install deps dulu (biar cache maksimal)
COPY package.json package-lock.json ./

# Install semua dependency (dev + prod)
RUN npm ci

# Copy seluruh source code
COPY . .

# Build React App (create-react-app akan generate folder 'build')
RUN npm run build

# ===== STAGE 2: RUNTIME dengan Nginx =====
FROM nginx:alpine AS runtime

# Copy hasil build ke folder nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config (opsional, lihat nginx.conf di bawah)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000 (biar konsisten dengan yang di workflow)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Jalankan nginx
CMD ["nginx", "-g", "daemon off;"]