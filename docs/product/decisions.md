# Architecture decision log

## ADR-001 — fork sports-betting as the analytics core

Status: accepted.

The project starts from `georgedouzas/sports-betting` because it already
separates data sources, loaders, estimators, backtesting, interfaces and
execution. The upstream remote remains configured so fixes can be evaluated and
merged deliberately.

## ADR-002 — use penaltyblog through an adapter

Status: accepted.

`penaltyblog` is added as the optional `football` dependency. Product code will
call an internal adapter rather than import it across every service. This keeps
the football engine replaceable and prevents a football dependency from being
required by basketball users.

## ADR-003 — analytics product before betting execution

Status: accepted.

The MVP publishes analysis and does not place bets. This reduces regulatory,
provider, account-security and customer-funds risk while the models and product
are validated.

## ADR-004 — licensed odds before public launch

Status: accepted.

Scraping may be used only in isolated research where lawful and permitted. The
production product requires an API contract covering commercial display and
derived analytics.

## ADR-005 — monorepo with separated runtimes

Status: accepted.

The repository contains a NestJS API in `apps/api`, a Next.js frontend in
`apps/web` and the Python analytics package at the root. They share versioning
and documentation but run as separate processes. This avoids rewriting the
statistical engine in TypeScript and allows each runtime to scale independently.

## ADR-006 — PostgreSQL as system of record

Status: accepted.

PostgreSQL will store canonical events, observed odds, model versions,
immutable signals, users and subscriptions. Redis is reserved for queues,
short-lived cache and job coordination; it is not the source of truth.
