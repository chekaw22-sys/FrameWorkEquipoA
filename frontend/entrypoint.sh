#!/usr/bin/env sh
set -eu

# Genera config runtime para el frontend (sin rebuild)
# Se lee en frontend/index.html -> /config.js
API_URL="${VITE_API_URL:-/api}"

cat > /usr/share/nginx/html/config.js <<EOF
globalThis.__APP_CONFIG__ = {
  VITE_API_URL: "${API_URL}"
};
EOF

exec nginx -g 'daemon off;'

