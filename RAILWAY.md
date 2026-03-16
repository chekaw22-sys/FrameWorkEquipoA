# Despliegue en Railway — checklist

Todo está preparado en el repo. Solo tienes que hacer esto en la web de Railway.

---

## Paso 1: Proyecto y código

1. Entra en [railway.app](https://railway.app) e inicia sesión.
2. **New Project** → **Deploy from GitHub repo** → elige este repositorio.
3. Railway detectará el `Dockerfile` de la raíz y usará `railway.json` (builder Dockerfile, reinicio automático, healthcheck en `/`).
4. **No cambies** “Root Directory” ni “Dockerfile path”; déjalos por defecto (raíz y `Dockerfile`).

---

## Paso 2: Base de datos MySQL

1. En el mismo proyecto: **Add** (o **New**) → **Database** → **MySQL**.
2. Espera a que se cree. Railway te dará variables de conexión (las verás en la pestaña **Variables** del proyecto o del recurso MySQL).
3. Anota o deja abierto cómo se llaman en tu proyecto. Suelen ser algo como:
   - `MYSQLHOST` o `MYSQLPUBLICHOST`
   - `MYSQLPORT` o `MYSQLPUBLICPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

(Si usas el plan con MySQL privado, los nombres pueden ser `MYSQLPRIVATEHOST`, etc.; adapta luego la URL.)

---

## Paso 3: Variables del servicio (tu app)

1. Entra en el **servicio** (el que despliega este repo, no el MySQL).
2. Ve a **Variables** (o **Settings** → **Variables**).
3. Añade estas variables. Si Railway te permite “referenciar” la base de datos, enlaza el recurso MySQL al servicio y usa las variables que te ofrezca (p. ej. `MYSQLHOST`, `MYSQLPORT`, etc.). Si no, copia los valores desde el panel del MySQL.

| Nombre | Valor |
|--------|--------|
| `SPRING_PROFILES_ACTIVE` | `docker` |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://VALOR_DE_MYSQLHOST:VALOR_DE_MYSQLPORT/VALOR_DE_MYSQLDATABASE?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true` |
| `SPRING_DATASOURCE_USERNAME` | (usuario MySQL, p. ej. el valor de `MYSQLUSER`) |
| `SPRING_DATASOURCE_PASSWORD` | (contraseña MySQL, p. ej. el valor de `MYSQLPASSWORD`) |
| `IA_SECRET` | Una contraseña o string aleatorio que tú elijas (p. ej. `miSecretoIa2025`) |

**Ejemplo** si tus variables de MySQL se llaman exactamente `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE` y Railway permite referencias:

- `SPRING_DATASOURCE_URL` = `jdbc:mysql://${{MYSQLHOST}}:${{MYSQLPORT}}/${{MYSQLDATABASE}}?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true`
- `SPRING_DATASOURCE_USERNAME` = `${{MYSQLUSER}}`
- `SPRING_DATASOURCE_PASSWORD` = `${{MYSQLPASSWORD}}`

(Si en tu panel las referencias son distintas, usa la sintaxis que te muestre Railway.)

4. Opcional: `VITE_API_URL` = `/api` (por defecto la app ya usa `/api`; solo ponla si quieres otra URL de API).

---

## Paso 4: Conectar MySQL al servicio

1. En el **servicio** (tu app), en **Variables** o **Settings**, busca la opción de **conectar / link** un recurso (p. ej. “Add variable reference” o “Connect database”).
2. Conecta el recurso **MySQL** que creaste. Así el servicio tendrá disponibles las variables de conexión (y podrás usar las referencias del paso 3).

---

## Paso 5: Deploy y dominio

1. Guarda las variables si hace falta y lanza un **Deploy** (o deja que se redepliegue solo al guardar).
2. En **Settings** del servicio, en **Networking** / **Public networking**, genera un **dominio público** (p. ej. `tu-proyecto.up.railway.app`).
3. El puerto que escucha la app lo define Railway con `PORT`; el `Dockerfile` y `start.sh` ya están preparados para usarlo (Nginx escucha en `PORT`).

---

## Paso 6: Probar

1. Abre la **URL pública** del servicio.
2. Deberías ver el frontend. Prueba **Registro** (usuario nuevo) y **Login**.
3. Si algo falla, revisa los **logs** del servicio en Railway (errores de conexión a BD, variables mal puestas, etc.).

---

## Resumen de qué hace este repo

- **Un solo servicio** (un contenedor): Nginx + backend Spring Boot + IA FastAPI.
- **Nginx** sirve el frontend y hace proxy de `/api` al backend.
- **MySQL** va aparte, como recurso de Railway; la app se conecta con las variables que configuras en el paso 3.

No hace falta tocar el código para que “al subir a Railway funcione”; solo hay que configurar bien la base de datos y las variables en los pasos 2–4.
