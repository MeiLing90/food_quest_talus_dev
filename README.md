# Vue + Node (Express) + Docker Compose Boilerplate

Minimal dev & prod setup.

## Project layout

```
.
├─ docker-compose.yml
├─ server/           # Express API (+ static serving in production)
└─ web/              # Vue 3 + Vite frontend
```

## Quick start (development)

```bash
# from project root
docker compose --profile dev up --build
# Frontend: http://localhost:5173
# API:      http://localhost:5000/api/hello
```

The Vite dev server proxies `/api/*` to the Express server inside Docker.

## Production (single container)

```bash
docker compose --profile prod up --build
# App served at: http://localhost:8080
```

The production image builds the Vue app and serves the static files and API from Express.

## Scripts (optional local runs)

You can also run each app locally without Docker (Node 18+ recommended):

```bash
# API
cd server && npm i && npm run dev

# Web
cd web && npm i && npm run dev
```

## Customization

- Add more API routes in `server/src/index.js`.
- Add Vue components in `web/src/`.
- Environment variables: set `PORT` for the server. In dev, Vite proxy handles `/api`.
