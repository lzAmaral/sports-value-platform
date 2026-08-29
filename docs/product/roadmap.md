# Delivery roadmap

## Phase 0 — foundation

- Maintain the upstream fork and contribution history.
- Record product decisions and licensing obligations.
- Select the initial leagues and markets.
- Compare licensed odds providers and request commercial proposals.

Exit: one approved data path and a written MVP specification.

## Phase 1 — reproducible football model

- Add a `penaltyblog` adapter behind an internal football-model interface.
- Establish canonical event/team/market identifiers.
- Build chronological datasets without leakage.
- Create Poisson/Dixon-Coles and logistic baselines.
- Produce calibration, ROI, yield and drawdown reports.

Exit: a reproducible out-of-sample benchmark and model card.

## Phase 2 — signal pipeline

- Ingest upcoming fixtures and current odds.
- Generate versioned signals on a schedule.
- Store every published signal immutably.
- Set minimum data quality and model confidence gates.

Exit: daily dry-run signals with no customer exposure.

## Phase 3 — product API

- Add a separate API service and PostgreSQL storage.
- Implement accounts, subscriptions, entitlements and rate limits.
- Expose signals and complete performance history.
- Add monitoring, alerts, backups and incident procedures.

Exit: private beta.

## Phase 4 — commercial launch

- Complete legal, privacy, security and provider-contract review.
- Publish terms, privacy policy, methodology and responsible-gambling notices.
- Run a controlled paid pilot.
- Measure retention and customer understanding, not only prediction outcomes.

Exit: public paid product with approved claims and licensed data.

## Later

- Basketball/NBA.
- Additional football markets.
- B2B and white-label API.
- In-play analysis only after licensing timestamped historical odds.
