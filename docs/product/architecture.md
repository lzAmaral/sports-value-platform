# Target architecture

## System boundaries

```text
Statistics provider       Licensed odds provider
         |                         |
         +------ ingestion --------+
                       |
              canonical snapshots
                       |
        feature and identity reconciliation
                       |
     sports-betting + penaltyblog models
                       |
         time-series backtest and registry
                       |
             immutable signal store
                       |
             product API and workers
                       |
              web/mobile clients
```

## Components

### Analytics core

The existing `sportsbet` package remains the domain core. It owns source
contracts, snapshot validation, feature/target/odds extraction, bettors and
backtesting.

### Football engine

`penaltyblog` is an optional adapter behind an internal interface. The first
implementations should expose Poisson/Dixon-Coles probabilities and implied
probability conversion without leaking library-specific objects into the
product API.

### Ingestion

Provider adapters fetch statistics and odds. Raw provider payloads are kept for
audit where contracts allow it. Canonical data uses UTC timestamps, stable
event identifiers, provider identifiers and explicit market/selection keys.

### Model registry

Every production prediction references a model version, training window,
feature schema and evaluation report. A model is promoted only after
time-ordered out-of-sample evaluation.

### Signal store

A published signal is immutable. Corrections create a new version rather than
overwriting history. This prevents selective deletion of losing tips.

### Product API

A separate API service will handle authentication, subscriptions, rate limits,
entitlements and presentation DTOs. It must not be embedded in the modelling
package.

## Engineering rules

- No future information in training features.
- Training and serving use the same transformations.
- Provider credentials come from a secret manager or environment, never source
  control.
- Third-party payloads and derived data have separate retention policies.
- Financial and performance claims must be derived from the immutable signal
  history.
