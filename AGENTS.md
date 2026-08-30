# Sports Value Platform — engineering instructions

These instructions apply to the whole repository. More specific `AGENTS.md`
files may add framework rules inside their directories.

## Product boundary

- Build an analytics product, not a sportsbook.
- Do not accept wagers, hold customer funds or automate bookmaker websites in
  the MVP.
- Never claim guaranteed profit or hide losing published signals.
- Treat provider licensing, privacy and responsible-gambling requirements as
  product requirements, not launch clean-up.

## Architecture

- Keep one monorepo with independently runnable boundaries:
  - `apps/web`: Next.js user interface.
  - `apps/api`: NestJS public/product API.
  - `src/sportsbet`: Python analytics core.
  - future Python workers: ingestion, training and prediction jobs.
- PostgreSQL is the system of record. Redis is only for queues, coordination,
  locks and short-lived cache.
- Keep provider adapters behind internal contracts. Never expose a vendor's
  response shape as our public API.
- Connect NestJS and Python through versioned jobs/events or an explicit
  internal HTTP contract. Do not spawn Python from request handlers.
- Store timestamps in UTC and money/odds with explicit precision and units.
- Published signals are immutable. Corrections create a new version.

## TypeScript

- Enable and preserve strict TypeScript.
- Do not introduce `any`, unchecked casts, non-null assertions or untyped JSON
  at system boundaries.
- Validate external input at runtime with DTO/schema validation; TypeScript
  types alone do not validate network or database data.
- Separate transport DTOs, domain types and persistence records.
- Prefer discriminated unions for finite states and exhaustive `switch`
  handling.
- Represent IDs, timestamps, percentages, decimal odds and money with names
  that make their semantics explicit.
- Controllers translate HTTP. Services implement use cases. Repositories own
  persistence. Provider clients own vendor protocol details.
- Return stable error codes and structured errors; do not leak provider or
  database exceptions to clients.

## Python analytics

- Prevent future-data leakage and use chronological evaluation.
- Training and serving must share transformations and feature definitions.
- Every prediction must reference data time, model version and input schema.
- Keep `penaltyblog` behind our own football-model adapter.
- Prefer calibrated probabilities and proper scoring rules over raw accuracy.

## Data and security

- Never commit API keys, credentials, raw licensed odds or personal data.
- Keep raw provider payloads separate from canonical and derived data.
- Record provider, observed-at time and market identity for every stored odd.
- Add migrations for schema changes; never rely on automatic production schema
  synchronization.
- Add tests for authorization, tenant boundaries and data leakage before those
  features ship.

## Delivery standard

- A change is complete only when relevant tests, type checks, builds and docs
  pass.
- Add or update an ADR when changing a system boundary, source of truth,
  provider, framework or data contract.
- Prefer a small vertical slice that runs end to end over several disconnected
  layers.
- Follow [the detailed engineering standard](docs/engineering/architecture-standards.md).
