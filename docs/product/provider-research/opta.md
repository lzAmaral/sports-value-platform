# Opta / Stats Perform assessment

Reviewed: 2026-08-30.

## Conclusion

Opta is a strong enterprise candidate for official, low-latency sports data,
but it is not a free startup API. Stats Perform states that it sells data at
enterprise level. Public product pages direct prospective customers to sales
for access and pricing. Demo or trial access may be negotiated, but there is no
published self-service free tier or daily free request allowance.

## What it supplies

Official material describes REST APIs, WebSockets, push/pull feeds and S3
delivery for live and historical data, scores, events, player/team statistics,
advanced metrics, predictions and some odds-related products. Data has stable
game, team and player identifiers and is designed for media, teams, technology
platforms and betting systems.

Opta should not be confused with a bookmaker. It may power event data,
settlement context, models and betting products, while displayed bookmaker
prices can still come from a separate odds provider, trading platform or the
bookmakers themselves.

## Commercial finding

- No public price list was found.
- No public free tier or quota was found.
- A demo/trial requires contacting the sales team.
- Licensing scope must explicitly cover our public display, derived
  probabilities, retained history and any B2B redistribution.
- Live broadcast rights are separate from the data license.

## Recommendation

Do not block the MVP on Opta. Build the provider boundary with free/sample data,
then request an enterprise proposal when we can specify competitions, markets,
latency, historical depth, countries, display rights and expected traffic.
Compare the proposal with at least two lower-cost providers using the same
contract checklist.

## Official sources

- [Stats Perform API and delivery FAQ](https://www.statsperform.com/stats-perform-faqs-apis-and-data-delivery/)
- [Stats Perform support and trial FAQ](https://www.statsperform.com/faqs/stats-perform-faqs-support/)
- [Opta API overview for apps](https://www.statsperform.com/insights/crafting-next-gen-sports-apps-and-media-experiences-with-stats-performs-opta-apis/)
- [Stats Perform contact form](https://www.statsperform.com/contact/)
