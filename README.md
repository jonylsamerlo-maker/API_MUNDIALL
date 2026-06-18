# Mundial 2026 Fixture MVP

Aplicacion MVP para consultar y administrar partidos del Mundial 2026.

El proyecto quedo armado con un frontend en React y un backend simple en PHP. Los partidos se cargan manualmente desde la pantalla **Cargar datos** y se persisten en `fixture.json`.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- PHP simple como API CRUD
- `fixture.json` como almacenamiento local

## Requisitos

Para ejecutar con Docker:

- Docker
- Docker Compose

Para ejecutar sin Docker:

- Node.js
- npm
- PHP 8 o compatible

## Como ejecutar

### Opcion recomendada: Docker

Esta es la forma mas simple para entregar o corregir el proyecto. Levanta el frontend, el backend PHP y la persistencia en `fixture.json`.

```bash
docker compose up --build
```

Luego abrir:

```text
http://localhost/
```

Pantalla para cargar datos:

```text
http://localhost/admin
```

API local:

```text
http://localhost/api.php
```

Para detener los contenedores:

```bash
docker compose down
```

### Desarrollo con Docker

Si queres usar Vite en modo desarrollo, con recarga automatica:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Luego abrir:

```text
http://localhost:4173/
```

En este modo tambien se levanta PHP en:

```text
http://localhost:8000/api.php
```

Para detener:

```bash
docker compose -f docker-compose.dev.yml down
```

### Ejecucion manual sin Docker

Instala las dependencias del frontend:

```bash
npm install
```

Levanta el backend PHP en el puerto `8000`:

```bash
php -S 127.0.0.1:8000 api.php
```

En otra terminal, levanta el frontend:

```bash
npm run dev
```

Abre la aplicacion en:

```text
http://localhost:4173/
```

## Como cargar partidos

Si se ejecuta con Docker para entrega:

```text
http://localhost/admin
```

Si se ejecuta en modo desarrollo o manual:

```text
http://localhost:4173/admin
```

Tambien se puede acceder desde el menu superior con **Cargar datos**.

Desde esa pantalla se pueden:

- Crear partidos
- Editar partidos existentes
- Eliminar partidos
- Actualizar marcador, estado, fecha, estadio y ciudad

Cuando no hay partidos cargados, la pagina de Inicio muestra un boton **Cargar primer partido**.

## Como se guardan los datos

El frontend no guarda los partidos directamente. El flujo es:

1. React envia la accion a `/api.php`.
2. Vite reenvia `/api.php` al backend PHP mediante proxy.
3. `api.php` valida la peticion.
4. PHP lee o escribe el archivo `fixture.json`.
5. La pagina vuelve a consultar la API y muestra los datos actualizados.

Archivo de datos:

```text
fixture.json
```

Si `fixture.json` esta vacio, debe contener:

```json
[]
```

## API local

El backend esta en:

```text
http://127.0.0.1:8000/api.php
```

Endpoints soportados:

- `GET /api.php`: lista todos los partidos
- `POST /api.php`: crea un partido
- `PUT /api.php`: actualiza un partido
- `DELETE /api.php`: elimina un partido

El frontend usa por defecto:

```text
/api.php
```

Y Vite lo proxya hacia:

```text
http://127.0.0.1:8000
```

La configuracion esta en `vite.config.ts`.

Si queres usar otro backend o puerto, podes definir:

```env
VITE_FIXTURE_API_URL=http://localhost:8001/api.php
```

## Estructura principal

```text
api.php                       API CRUD en PHP
fixture.json                  Almacenamiento local de partidos
src/api/fixtureApi.ts         Cliente frontend para la API local
src/hooks/useWorldCupFixture.ts Hook que carga los datos del fixture
src/pages/Home.tsx            Pantalla principal del fixture
src/pages/Admin.tsx           CRUD para cargar datos manualmente
src/pages/Groups.tsx          Vista de grupos
src/pages/Knockout.tsx        Vista de eliminatorias
```

## Notas sobre Football Data API

El proyecto tenia integracion con Football Data API, pero se dejo de usar como fuente principal porque no habia una API gratuita conveniente para el flujo actual.

El endpoint investigado fue:

```text
https://api.football-data.org/v4/competitions/WC/matches?season=2026
```

Actualmente la fuente principal es la API local en PHP y los datos cargados manualmente.

## Scripts disponibles

Compilar para produccion:

```bash
npm run build
```

Previsualizar build:

```bash
npm run preview
```

Servidor de desarrollo:

```bash
npm run dev
```

## Docker

El proyecto incluye configuracion Docker completa para que se pueda ejecutar con pocos pasos.

Archivos incluidos:

- `Dockerfile`
- `docker-compose.yml`
- `docker-compose.dev.yml`
- `nginx.conf`

No son archivos duplicados. Cada uno cumple una funcion distinta:

- `Dockerfile`: define como se construye la imagen final del frontend. Instala dependencias, compila React y deja los archivos listos para servir con Nginx.
- `docker-compose.yml`: es el archivo principal para ejecutar el proyecto completo. Es el que deberia usar el profesor para probar la entrega.
- `docker-compose.dev.yml`: es una alternativa solo para desarrollo. Levanta Vite con recarga automatica y tambien levanta PHP.
- `nginx.conf`: configura Nginx dentro del contenedor final. Permite que el frontend acceda a `/api.php` y que esa peticion llegue al backend PHP.

Para correccion o entrega, usar solamente:

```bash
docker compose up --build
```

No hace falta usar `docker-compose.dev.yml` salvo que se quiera trabajar modificando codigo en modo desarrollo.

### `docker-compose.yml`

Levanta la version lista para usar:

- `web`: construye React, sirve el resultado con Nginx y expone `http://localhost/`
- `php`: levanta `api.php` con PHP embebido y escribe en `fixture.json`

Nginx redirige internamente:

```text
/api.php -> php:8000/api.php
```

Por eso el frontend puede consumir `/api.php` sin configurar una URL externa.

### `docker-compose.dev.yml`

Levanta el entorno de desarrollo:

- `web`: ejecuta Vite en `http://localhost:4173/`
- `php`: ejecuta la API en `http://localhost:8000/api.php`

En este modo se usa:

```env
VITE_FIXTURE_API_URL=http://localhost:8000/api.php
```

### Persistencia

Los datos cargados desde el CRUD se guardan en:

```text
fixture.json
```

Ese archivo se monta dentro del contenedor PHP, asi que los partidos quedan guardados en el proyecto local aunque se detengan los contenedores.
