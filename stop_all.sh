#!/bin/bash

echo "🛑 Deteniendo servicios del sistema..."

#########################################
#      MATAR IA FASTAPI (puerto 5005)
#########################################
echo "🧠 Deteniendo IA (FastAPI)..."
IA_PIDS=$(lsof -ti:5005)

if [ -n "$IA_PIDS" ]; then
    kill -9 $IA_PIDS
    echo "✔ IA detenida."
else
    echo "❗ IA no estaba ejecutándose."
fi

#########################################
#      MySQL: servicio systemd
#########################################
echo
echo "🗃️  Intentando detener MySQL systemd service (mysqld/mysql)..."
if command -v systemctl >/dev/null 2>&1; then
    if systemctl is-active --quiet mysql 2>/dev/null || systemctl is-active --quiet mysqld 2>/dev/null; then
        sudo systemctl stop mysql 2>/dev/null || sudo systemctl stop mysqld 2>/dev/null
        echo "  ✔ Servicio MySQL detenido (systemd)."
    else
        echo "  ❗ Servicio MySQL systemd no está activo."
    fi
else
    echo "  ❗ systemctl no está disponible, saltando gestión systemd."
fi

#########################################
#      MATAR BACKEND SPRING (puerto 8080)
#########################################
echo "🗄️  Deteniendo BACKEND (Spring Boot)..."
BACKEND_PIDS=$(lsof -ti:8080)

if [ -n "$BACKEND_PIDS" ]; then
    kill -9 $BACKEND_PIDS
    echo "✔ Backend detenido."
else
    echo "❗ Backend no estaba ejecutándose."
fi


#########################################
#      MATAR FRONTEND (puerto 5173)
#########################################
echo "🌐 Deteniendo FRONTEND (Vite)..."
FRONTEND_PIDS=$(lsof -ti:5173)

if [ -n "$FRONTEND_PIDS" ]; then
    kill -9 $FRONTEND_PIDS
    echo "✔ Frontend detenido."
else
    echo "❗ Frontend no estaba ejecutándose."
fi


#########################################
#      MATAR UVICORN DIRECTO (por si acaso)
#########################################
echo "🔍 Buscando procesos uvicorn adicionales..."
UVICORN_PIDS=$(pgrep -f "uvicorn")

if [ -n "$UVICORN_PIDS" ]; then
    kill -9 $UVICORN_PIDS
    echo "✔ Procesos uvicorn eliminados."
else
    echo "❗ No había procesos uvicorn extra."
fi


#########################################
#      LIMPIEZA FINAL
#########################################
echo "🧹 Limpieza de procesos python3 residuales..."
PYTHON_PIDS=$(pgrep -f "python3.*ia_fastapi.py")

if [ -n "$PYTHON_PIDS" ]; then
    kill -9 $PYTHON_PIDS
    echo "✔ Procesos Python IA limpiados."
else
    echo "❗ No había procesos IA Python activos."
fi


echo "🎉 Todo detenido correctamente."
