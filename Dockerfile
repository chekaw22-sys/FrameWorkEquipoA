## Dockerfile “todo en uno” (Railway)
## - Nginx expone el puerto público (PORT)
## - Backend Spring corre interno en :8080
## - IA FastAPI corre interno en :5005
## No añadir ln -s python3 python: la imagen puede tener python; supervisord usa python3.

FROM maven:3.9.4-eclipse-temurin-21 AS backend_builder
WORKDIR /build/backend
COPY backend/ ./
RUN chmod +x mvnw || true && ./mvnw -B -DskipTests package

FROM node:20-alpine AS frontend_builder
WORKDIR /build/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci
COPY frontend/ ./
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM eclipse-temurin:21-jre
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-pip nginx supervisor \
  && rm -rf /var/lib/apt/lists/*

# Backend
RUN mkdir -p /app/backend
COPY --from=backend_builder /build/backend/target/*.jar /app/backend/app.jar

# IA
RUN mkdir -p /app/ia
COPY IA-VersionFuncional/ia/Scrpts/requirements.docker.txt /app/ia/requirements.txt
RUN python3 -m pip install --no-cache-dir --break-system-packages -r /app/ia/requirements.txt
COPY IA-VersionFuncional/ia/Scrpts/ia_fastapi2_0.py /app/ia/ia_fastapi2_0.py
COPY IA-VersionFuncional/ia/Scrpts/sintomas_enfermedades.csv /app/ia/sintomas_enfermedades.csv
COPY IA-VersionFuncional/ia/Scrpts/treatments.json /app/ia/treatments.json

# Frontend estático
COPY --from=frontend_builder /build/frontend/dist /usr/share/nginx/html

# Arranque
COPY supervisord.conf /app/supervisord.conf
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

ENV JAVA_OPTS=""
EXPOSE 8080
CMD ["/app/start.sh"]

