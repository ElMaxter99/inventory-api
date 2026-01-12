# Inventory API

API REST para inventariar cosas de casa. Node.js + Express + MongoDB + TypeScript.

## Quickstart

- Copia `.env.example` a `.env` y ajusta variables.
- `npm install`
- `npm run dev` (dev)
- `npm run build` && `npm start` (prod)
- `docker-compose up --build` (con Docker)

## Scripts
- `npm run dev` — arrancar en desarrollo
- `npm test` — ejecutar tests
- `npm run seed` — seed de ejemplo

## Docs
Swagger en `/docs`.

## Example curl
Register:

curl -X POST http://localhost:4000/api/v1/auth/register -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"password123"}'

Login:

curl -X POST http://localhost:4000/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"password123"}'

## Notas de diseño
- Roles por inventario: owner, admin, editor, viewer
- Tokens públicos/locators para QR/NFC
- Refresh token rotativo con almacenamiento hashed en user.refreshTokens
- Validación con Zod
- Uploads en `uploads/`, con abstracción para S3 futuro

## Endpoints (resumen)
- `/api/v1/auth` — register/login/refresh/logout/me
- `/api/v1/inventories` — CRUD inventarios + miembros + public access
- `/api/v1/inventories/:id/zones` — CRUD zonas
- `/api/v1/inventories/:id/items` — CRUD items, fotos, comentarios
- `/locators/:token` — resolver QR/NFC

Para más detalles, consulta `src/docs/openapi.json` o la ruta `/docs`.
