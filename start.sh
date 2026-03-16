#!/usr/bin/env sh
set -eu

# Railway define PORT para el puerto público del servicio
PUBLIC_PORT="${PORT:-8080}"

# Runtime config del frontend (sin rebuild)
API_URL="${VITE_API_URL:-/api}"
mkdir -p /usr/share/nginx/html
cat > /usr/share/nginx/html/config.js <<EOF
globalThis.__APP_CONFIG__ = { VITE_API_URL: "${API_URL}" };
EOF

# Nginx: sirve frontend y hace proxy al backend interno
cat > /etc/nginx/nginx.conf <<'EOF'
user www-data;
worker_processes auto;
pid /run/nginx.pid;

events { worker_connections 1024; }

http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;

  # Evita 400 "Request Header Or Cookie Too Large" (cabeceras del edge/proxy)
  client_header_buffer_size 64k;
  large_client_header_buffers 16 128k;

  sendfile on;
  keepalive_timeout 65;

  include /etc/nginx/conf.d/*.conf;
}
EOF

cat > /etc/nginx/conf.d/default.conf <<EOF
server {
  listen ${PUBLIC_PORT};
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files \$uri \$uri/ /index.html;
  }

  location /api {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }
}
EOF

exec /usr/bin/supervisord -c /app/supervisord.conf

