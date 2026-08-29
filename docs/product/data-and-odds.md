# Odds and data strategy

## What an odds provider does

An odds provider supplies prices offered by one or more bookmakers through an
API. It is not necessarily a bookmaker. Depending on the contract, it may
provide current prices, historical snapshots, closing prices, market metadata
and bookmaker coverage.

For example, the product can ask for the current 1X2 prices for one match and
compare each price with the model's estimated probability. A direct bookmaker
API can serve the same purpose for that bookmaker only.

## Why commercial rights matter

Technical API access does not automatically grant the right to display,
cache, derive products from or resell the data. Before selecting a provider,
obtain written answers for:

- commercial use and public display;
- derived analytics and probability signals;
- redistribution through our own API;
- historical-data retention;
- caching limits;
- permitted countries and sports;
- attribution requirements;
- request limits and overage pricing;
- service-level commitments;
- termination and deletion obligations.

## Provider evaluation checklist

- Brazilian and international bookmaker coverage.
- Football leagues required by the MVP.
- Stable event, market and selection identifiers.
- Pre-match historical snapshots, not only final closing odds.
- Timestamp precision and UTC support.
- Results and settlement status.
- Sandbox and test credentials.
- Webhooks or efficient change polling.
- Documented corrections and postponed-match handling.
- Contract permits the planned product.

## MVP data policy

- Begin with pre-match markets.
- Store the observed price and observation timestamp used by every signal.
- Keep provider data isolated from our derived predictions.
- Do not expose raw odds history through the customer API unless licensed.
- Use free sources only for development and evaluation until their terms have
  been reviewed for production use.
