# Produto Sports Value Platform

## Objetivo

Construir uma plataforma de inteligência esportiva que estime probabilidades,
compare essas probabilidades com preços de mercado licenciados e publique
análises rastreáveis. Futebol pré-jogo é a primeira vertical; basquete poderá
reaproveitar os mesmos contratos posteriormente.

## Limites do MVP

- Não aceitar apostas ou depósitos.
- Não manter saldo de clientes.
- Não automatizar sites de casas de apostas.
- Não prometer lucro ou apagar resultados negativos.
- Não redistribuir dados de fornecedores sem autorização contratual.

## Estado atual

O primeiro corte vertical está funcional: Next.js consulta nossa API NestJS,
que transforma partidas brasileiras em um contrato canônico. A ESPN fornece as
partidas da temporada atual e os placares ao vivo. A API-Football complementa
consultas históricas conforme a cobertura da chave configurada.

## Base técnica

- `apps/web`: interface Next.js.
- `apps/api`: API NestJS e adaptadores de provedores.
- `src/sportsbet`: fontes, carregadores, avaliação e backtest em Python.
- `penaltyblog`: futuro mecanismo de modelos de futebol atrás de adapter.
- PostgreSQL: fonte de verdade para eventos, odds, modelos e sinais.
- Redis: filas, locks, deduplicação e cache de curta duração.

## Índice

- [Visão e escopo](docs/product/vision.md)
- [Arquitetura](docs/product/architecture.md)
- [Estratégia de dados e odds](docs/product/data-and-odds.md)
- [Limites legais e de conformidade](docs/product/legal-and-compliance.md)
- [Roadmap](docs/product/roadmap.md)
- [Decisões arquiteturais](docs/product/decisions.md)
- [Ambiente local](docs/development/local-setup.md)
- [Padrões de engenharia](docs/engineering/architecture-standards.md)
- [Pesquisa sobre Opta](docs/product/provider-research/opta.md)
- [Guia da API-Football](docs/product/provider-research/api-football-guide.md)

O uso de código derivado do `sports-betting` continua sujeito à licença MIT e
às atribuições registradas no repositório.
