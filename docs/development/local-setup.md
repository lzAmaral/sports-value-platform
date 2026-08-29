# Local development

## Requirements

- Python 3.11–3.13 (tested locally with 3.13.7).
- Node.js 22 LTS. The machine currently has Node 26; use `.nvmrc` to avoid
  framework incompatibilities.
- Docker Desktop with Compose.

## 1. Environment variables

```bash
cp .env.example .env
```

The offline analytics demo and API liveness endpoint require no paid API key.
Never commit `.env`.

## 2. Python analytics

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e '.[football,mcp,execution]'
python -m pip install pytest pytest-cov pytest-randomly pytest-xdist
playwright install chromium
python -m sportsbet --help
python -m pytest
```

The `football` extra installs `penaltyblog`.

## 3. Node applications

```bash
nvm install 22
nvm use
npm install
```

NestJS is the public API in `apps/api`. Next.js is the user interface in
`apps/web`. The Python package at the repository root remains the analytics
engine; a later worker/service adapter will connect it to the API.

## 4. Infrastructure

```bash
npm run infra:up
docker compose -f infrastructure/compose.yaml ps
```

PostgreSQL is available at `localhost:5434`; Redis at `localhost:6379`. Port
5434 intentionally avoids the PostgreSQL service already using 5432 on this
development machine.

## 5. Run

```bash
npm run dev
```

- Web: <http://localhost:3000>
- API liveness: <http://localhost:3001/v1/health>
- API readiness (includes PostgreSQL): <http://localhost:3001/v1/health/ready>

## External APIs

No API is needed for the offline sample. Before production we need contracts
for statistics and odds. An odds-provider key belongs in `ODDS_API_KEY`; the
provider must permit commercial display and derived analytics. Do not select a
provider on technical coverage alone.
