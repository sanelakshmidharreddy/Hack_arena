# Stage 1: Build Frontend Assets
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci || npm install

COPY frontend/ ./
RUN npm run build

# Stage 2: Production Python Backend with Built Frontend
FROM python:3.11-slim AS production

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app \
    PORT=8080

WORKDIR /app

# Install system dependencies (curl for healthchecks)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Create a secure non-root user (Cloud Run security best practice)
RUN groupadd -g 10001 jansakhi && \
    useradd -u 10001 -g jansakhi -s /bin/bash -m jansakhi

# Copy backend application
COPY backend/app ./app

# Copy built frontend assets from Stage 1 into frontend/dist
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Set ownership to non-root user
RUN chown -R jansakhi:jansakhi /app

# Switch to non-root user
USER jansakhi

# Expose default Cloud Run container port
EXPOSE 8080

# Healthcheck for container orchestrators
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Start Uvicorn server respecting Cloud Run $PORT environment variable
CMD exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT}
