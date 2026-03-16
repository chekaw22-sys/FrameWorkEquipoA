# Docker y despliegue (pfSense / Sunstone)

## Requisitos

- Docker y Docker Compose
- Archivo `.env` con las variables de base de datos (ver más abajo)

## Uso rápido

1. **Crear `.env` desde el ejemplo**
   ```bash
   cp .env.example .env
   ```
   Edita `.env` y define al menos:
   - `MYSQL_PASSWORD`
   - `MYSQL_ROOT_PASSWORD`

2. **Levantar todo**
   ```bash
   docker compose up -d --build
   ```

3. **Abrir la aplicación**
   - Frontend (y API por proxy): http://localhost:80  
   - Si cambiaste el puerto del frontend en `docker-compose.yml`, usa ese puerto.

## Despliegue detrás de pfSense / Sunstone

Para exponer la app en un dominio (por ejemplo `https://app.tudominio.com`):

1. **En el servidor donde corre Docker**
   - Deja el servicio `frontend` escuchando en un puerto (por defecto 80).  
   - Si otro servicio usa el 80, cambia en `docker-compose.yml`:
     ```yaml
     frontend:
       ports:
         - "8080:80"   # por ejemplo
     ```
   - No es necesario exponer MySQL ni el backend al exterior; el frontend hace proxy a `/api` al backend interno.

2. **En pfSense (HAProxy o reverse proxy)**
   - Crea una regla de **Frontend** que escuche en 443 (HTTPS) para tu dominio (ej. `app.tudominio.com`).
   - En el **Backend** apunta al servidor donde corre Docker y al puerto del contenedor `frontend` (ej. IP del servidor y puerto 80 o 8080).
   - Habilita SSL/TLS en el frontend (certificado para el dominio).

3. **En OpenNebula Sunstone**
   - Si usas Sunstone como panel y quieres que esta aplicación sea un servicio más, puedes:
     - Ejecutar este `docker-compose` en una VM o host gestionado por OpenNebula, y
     - Configurar en tu red/firewall (o en pfSense) que el dominio de la app apunte a esa VM/host.

4. **Variable de entorno opcional**
   - Si la API se sirve en otra URL (por ejemplo `https://api.tudominio.com`), rebuild del frontend con:
     ```bash
     VITE_API_URL=https://api.tudominio.com/api docker compose up -d --build
     ```
   - Por defecto `VITE_API_URL=/api` (mismo origen), que es lo correcto cuando nginx hace proxy de `/api` al backend.

## Comandos útiles

```bash
# Ver logs
docker compose logs -f

# Parar
docker compose down

# Parar y eliminar volúmenes (¡borra la BD!)
docker compose down -v
```

## Estructura de servicios

| Servicio   | Función                          | Puerto interno | Expuesto        |
|-----------|-----------------------------------|----------------|-----------------|
| `mysql`   | Base de datos                     | 3306           | 3306 (opcional) |
| `backend` | API Spring Boot                   | 8080           | No              |
| `frontend`| Nginx (React + proxy a /api)     | 80             | 80              |

Solo necesitas exponer el puerto del `frontend` (o el que hayas mapeado) hacia pfSense/Sunstone.

## Nota para Railway

En Railway normalmente desplegarás **dos servicios** (frontend y backend) y una **base de datos** gestionada.
Para esa guía, mira `RAILWAY.md`.
