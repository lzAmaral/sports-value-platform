# Desenvolvimento local

## Requisitos

- Node.js 22 LTS.
- Python 3.11–3.13.
- Docker Desktop com Compose.

## 1. Variáveis de ambiente

```bash
cp .env.example .env
```

Crie uma conta gratuita na API-Football e configure a chave somente no arquivo
local `.env`:

```dotenv
API_FOOTBALL_KEY=sua_chave
```

Nunca commite `.env`, nunca use o prefixo `NEXT_PUBLIC_` nessa chave e nunca a
coloque dentro de `apps/web`. A demonstração offline e o endpoint de saúde não
precisam de chave.

## 2. Aplicações Node.js

```bash
nvm install 22
nvm use
npm install
```

O NestJS em `apps/api` é a API pública. O Next.js em `apps/web` é a interface.
O pacote Python continua sendo o mecanismo analítico separado.

## 3. Infraestrutura

```bash
npm run infra:up
docker compose -f infrastructure/compose.yaml ps
```

- PostgreSQL: `localhost:5434`.
- Redis: `localhost:6379`.

A porta 5434 evita conflito com instalações locais que já usam 5432.

## 4. Executar

```bash
npm run dev
```

- Web: <http://localhost:3000>
- Partidas: <http://localhost:3000/partidas>
- API: <http://localhost:3001/v1/health>
- Prontidão com PostgreSQL: <http://localhost:3001/v1/health/ready>
- Competições: <http://localhost:3001/v1/football/competitions>

Consulta de teste:

```bash
curl 'http://localhost:3001/v1/football/fixtures?competition=brasileirao-serie-a&season=2024&from=2024-04-13&to=2024-04-14'
```

No teste de 30 de agosto de 2026, o plano gratuito aceitou temporadas
brasileiras de 2022 a 2024 e rejeitou 2026. Use 2024 no MVP local enquanto o
plano da conta não mudar.

## 5. Núcleo Python

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

O extra `football` instala `penaltyblog`.

## 6. Verificações

```bash
npm run lint
npm test
npm run build
```

Para desligar somente a infraestrutura:

```bash
npm run infra:down
```

## APIs externas

`API_FOOTBALL_KEY` habilita o adaptador brasileiro. `ODDS_API_KEY` é reservado
ao adaptador The Odds API do núcleo Python. Nenhuma cobertura técnica autoriza
uso comercial automaticamente: exibição, armazenamento e análises derivadas
precisam estar permitidos pelo contrato antes do lançamento.
