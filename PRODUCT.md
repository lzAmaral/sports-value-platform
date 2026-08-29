# Sports Value Platform

This repository is a fork of `georgedouzas/sports-betting` and will be used as
the analytics core of a commercial sports intelligence product. The first
vertical is pre-match football analysis. Basketball can reuse the same core in
a later milestone.

The product will estimate probabilities, compare them with market odds and
publish traceable value-bet signals. It will not promise profit, act as a
bookmaker, hold customer funds or place bets automatically in the MVP.

## Product documentation

- [Vision and scope](docs/product/vision.md)
- [Target architecture](docs/product/architecture.md)
- [Odds and data strategy](docs/product/data-and-odds.md)
- [Legal and compliance boundaries](docs/product/legal-and-compliance.md)
- [Delivery roadmap](docs/product/roadmap.md)
- [Architecture decisions](docs/product/decisions.md)

## Technical foundation

- `sports-betting`: data contracts, loaders, backtesting, estimators and
  value-bet selection.
- `penaltyblog`: optional football modelling engine for Poisson, Dixon-Coles,
  implied probabilities and related domain calculations.
- A licensed odds provider: current and historical bookmaker prices under a
  contract that permits the intended commercial use.

Install the football modelling extra during development:

```bash
pip install -e '.[football]'
```

The original MIT copyright and license must remain in distributions that
contain this code.
