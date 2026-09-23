# WaterSec HydroLens Frontend

React and TypeScript interface for the WaterSec HydroLens hotel water Digital Twin demonstrator. It lets a WaterSec presenter generate a hotel, inspect its water network, run deterministic water and leak scenarios, and show the resulting business impact.

The frontend is deployed separately from the Spring Boot backend. It does not perform AI generation or water calculations; those remain backend responsibilities.

## Local development

Requirements:

- Node.js 22 or a compatible current Node.js release
- npm
- HydroLens backend running on port `8081`

Create the optional local environment file:

```powershell
Copy-Item .env.example .env.local
```

Install and run:

```powershell
npm install
npm run dev
```

Open `http://localhost:5173`. The default local API is `http://localhost:8081/api/v1`.

## Run with Docker

Start the Spring Boot backend first and ensure it publishes port `8081`. Then run from this frontend directory:

```powershell
docker compose up --build
```

Open `http://localhost:5173` and stop the container with:

```powershell
docker compose down
```

Stop any existing `npm run dev` process before starting Docker. Otherwise the
Vite server and Docker may compete for port `5173`, and `localhost` can open the
development server instead of the container.

The production image uses two stages:

1. Node builds the Vite application.
2. Nginx serves the static files and proxies `/api/*` to the separate backend.

By default, Nginx reaches the backend at `http://host.docker.internal:8081`. Override it when needed:

```powershell
$env:BACKEND_URL='http://another-backend-host:8081'
docker compose up --build
```

`BACKEND_URL` must not include `/api/v1`; the browser request already contains that path.

## Build and publish the image

```powershell
docker build -t your-account/hydrolens-frontend:1.0.0 .
docker tag your-account/hydrolens-frontend:1.0.0 your-account/hydrolens-frontend:latest
docker push your-account/hydrolens-frontend:1.0.0
docker push your-account/hydrolens-frontend:latest
```

The frontend and backend should be published as separate images.

## Configuration

- `VITE_API_URL` is a build-time Vite value.
- The Docker image uses `/api/v1` for same-origin requests.
- `BACKEND_URL` is a runtime Nginx value selecting the separate backend.
- `HF_TOKEN` must never be included in the frontend image; it belongs only to the backend.

## Quality checks

```powershell
npm run typecheck
npm run lint
npm run build
```

## Main technologies

- React 19
- TypeScript and Vite
- React Router and Axios
- Tailwind CSS
- XYFlow and Recharts
- Framer Motion and Lucide React
