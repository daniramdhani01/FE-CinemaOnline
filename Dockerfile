# ===== STAGE 1: BUILD =====
FROM node:22.15-alpine AS builder

WORKDIR /app

# Declare build arguments
ARG REACT_APP_ENCRYPTION_KEY
ARG REACT_APP_BASE_URL

# Set as environment variables untuk build process
ENV REACT_APP_ENCRYPTION_KEY=${REACT_APP_ENCRYPTION_KEY}
ENV REACT_APP_BASE_URL=${REACT_APP_BASE_URL}

# Copy file yang dibutuhkan untuk install deps dulu (biar cache maksimal)
COPY package*.json ./

# Install semua dependency (dev + prod)
RUN npm ci && npm cache clean --force

# Copy seluruh source code
COPY . .

# Build React App (create-react-app akan generate folder 'build')
# Environment variables akan di-embed ke dalam build
RUN npm run build

# ===== STAGE 2: RUNTIME dengan Nginx =====
FROM nginx:alpine AS runtime

# Copy hasil build ke folder nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config (opsional, lihat nginx.conf di bawah)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000 (biar konsisten dengan yang di workflow)
EXPOSE 3000

# Health check - ganti localhost dengan 127.0.0.1 dan tingkatkan start-period
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3000/ || exit 1

# Jalankan nginx
CMD ["nginx", "-g", "daemon off;"]