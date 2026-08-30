# Sports Value Platform

Plataforma de inteligência esportiva em desenvolvimento. O MVP atual consulta
dados reais do futebol brasileiro, normaliza as respostas da API-Football e as
apresenta em uma aplicação web. A evolução prevista inclui ingestão histórica,
modelos probabilísticos próprios e comparação com odds licenciadas.

> Produto analítico: não recebe apostas, não movimenta dinheiro, não automatiza
> casas de apostas e não promete retorno financeiro.

## O que já funciona

- Interface Next.js em português com visão geral, partidas e explicação do MVP.
- API NestJS com contrato próprio para partidas brasileiras.
- Adaptador da API-Football para Série A, Série B e Copa do Brasil.
- Validação em runtime das respostas externas.
- PostgreSQL e Redis disponíveis no ambiente local.
- Núcleo Python derivado do `sports-betting` para dados, avaliação e backtests.
- CI para TypeScript, builds web/API e suíte Python.

O plano gratuito testado da API-Football permite temporadas brasileiras de
2022 a 2024. Para o Brasileirão 2024, há partidas, eventos, escalações,
estatísticas e classificação; odds não estão liberadas nesse plano.

## Estrutura

```text
apps/web        interface Next.js
apps/api        API pública NestJS
src/sportsbet   núcleo analítico Python
infrastructure  PostgreSQL e Redis via Docker Compose
docs            produto, arquitetura, provedores e colaboração
```

O NestJS nunca expõe diretamente o formato da API-Football. Adaptadores
convertem dados de fornecedores para contratos canônicos da plataforma.

## Início rápido

Requisitos: Node.js 22, Python 3.11–3.13 e Docker Desktop.

```bash
cp .env.example .env
npm install
npm run infra:up
npm run dev
```

Coloque a chave obtida no dashboard da API-Football somente no `.env`:

```dotenv
API_FOOTBALL_KEY=sua_chave_local
```

Endereços:

- Aplicação: <http://localhost:3000>
- Partidas: <http://localhost:3000/partidas>
- API: <http://localhost:3001/v1/health>

Consulte o [guia completo do ambiente](docs/development/local-setup.md) para
instalar também o núcleo Python.

## Verificações

```bash
npm run lint
npm test
npm run build
```

Os comandos Python e a matriz completa do CI estão descritos no [guia de
contribuição](CONTRIBUTING.md).

## Documentação

- [Visão do produto](PRODUCT.md)
- [Arquitetura](docs/product/architecture.md)
- [Padrões de engenharia](docs/engineering/architecture-standards.md)
- [API-Football](docs/product/provider-research/api-football-guide.md)
- [Fluxo de Git e commits](docs/development/git-workflow.md)
- [Integração contínua](docs/development/continuous-integration.md)
- [Decisões arquiteturais](docs/product/decisions.md)
- [Aspectos legais e de dados](docs/product/legal-and-compliance.md)

## Origem e licença

O repositório começou a partir do projeto open source
[`georgedouzas/sports-betting`](https://github.com/georgedouzas/sports-betting),
usado como núcleo analítico. O copyright original e a licença MIT permanecem
preservados em [LICENSE](LICENSE) e [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
