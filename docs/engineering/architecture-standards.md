# Architecture and TypeScript standard

This is the detailed engineering reference for the platform. The root
`AGENTS.md` contains the short rules that agents must always load.

## Target system

```text
Next.js web
    |
NestJS product API
    |---------------- PostgreSQL (source of truth)
    |---------------- Redis (queues/cache only)
    |
job/event contract
    |
Python workers and analytics core
    |
statistics and licensed odds providers
```

Deployments may scale these processes independently even though source code is
kept in one repository.

## NestJS module design

Organize the API by business capability, not technical file type:

```text
apps/api/src/
  events/
    domain/
    application/
    infrastructure/
    http/
  odds/
  predictions/
  signals/
  models/
  identity/
  subscriptions/
  shared/
```

Within each capability:

- domain types express business invariants;
- application services implement use cases;
- repositories are interfaces owned by the application/domain side;
- infrastructure implements PostgreSQL and external providers;
- controllers and DTOs translate HTTP without containing business logic.

Do not create distributed microservices at the start. These boundaries make a
modular monolith that can be split later only when operational evidence demands
it.

## Type strategy

### Compile-time and runtime are different

An interface disappears when TypeScript compiles. All untrusted values from
HTTP, environment variables, queues, providers and databases require runtime
validation before entering the domain.

### Avoid primitive ambiguity

Prefer types whose names carry meaning:

```ts
type EventId = string & { readonly __brand: 'EventId' };
type ModelVersionId = string & { readonly __brand: 'ModelVersionId' };

interface DecimalOdds {
  readonly value: string; // decimal string, not binary floating point
}

interface Probability {
  readonly value: number; // invariant: 0 <= value <= 1
}
```

Construct these values through validating functions. Do not cast raw strings
directly to branded IDs.

### Model finite states exhaustively

```ts
type EventStatus =
  | { kind: 'scheduled'; startsAt: string }
  | { kind: 'live'; minute: number }
  | { kind: 'finished'; finishedAt: string }
  | { kind: 'cancelled'; reason?: string };
```

Use exhaustive switches so adding a state produces a compile-time reminder in
every relevant use case.

### DTO rules

- Request DTOs validate shape, bounds, enums and formats.
- Response DTOs form a versioned public contract.
- Domain entities are not serialized directly.
- Provider DTOs remain inside the provider adapter.
- Database rows remain inside persistence adapters.
- API errors contain a stable machine code, a safe message and an optional
  correlation ID.

## Database rules

PostgreSQL owns durable state. Initial business tables should cover:

- competitions and seasons;
- teams and provider aliases;
- events and event status history;
- odds observations by provider/bookmaker/market/selection/time;
- model versions and training metadata;
- predictions and their probability distributions;
- immutable published signals and later outcomes;
- users, subscriptions and entitlements when identity is introduced.

Store provider identifiers alongside internal identifiers, but never use a
provider ID as the primary domain identity. Use migrations for every change.

Odds, stakes and money must use PostgreSQL `numeric`, not floating point.
Timestamps use `timestamptz` and are normalized to UTC.

## Analytics contract

NestJS owns product workflows and authorization. Python owns data science and
model execution. A prediction job should contain internal event IDs, an input
snapshot cutoff and a requested model version. Its result should contain a
versioned schema, probabilities, provenance and diagnostics.

No HTTP request should wait for model training. Long work goes through a queue.
Serving a precomputed prediction may use PostgreSQL and a short Redis cache.

## Testing layers

- unit tests for domain invariants and use cases;
- contract tests for provider adapters and Python/Nest messages;
- repository integration tests against PostgreSQL;
- API tests for validation, authorization and stable errors;
- chronological analytics tests against leakage;
- a small end-to-end path from seeded event to rendered prediction.

## Observability

Use structured logs with correlation IDs. Measure ingestion delay, provider
errors, stale odds, queue age, prediction duration, calibration drift and API
latency. Never log credentials, raw authorization headers or personal data.
