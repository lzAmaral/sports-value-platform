const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
type FootballFixtureStatus = 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled' | 'unknown';
type FootballTeam = { providerId: string; name: string; logoUrl: string | null };
export type FootballFixture = { providerId: string; competition: { slug: string; name: string; countryCode: 'BR' }; season: number; kickoffAt: string; status: FootballFixtureStatus; venueName: string | null; homeTeam: FootballTeam; awayTeam: FootballTeam; score: { home: number | null; away: number | null } };

export async function fetchFixtures(query: { competition: string; season: number; from: string; to: string }): Promise<FootballFixture[]> {
  const url = new URL('/v1/football/fixtures', apiUrl);
  url.searchParams.set('competition', query.competition); url.searchParams.set('season', String(query.season)); url.searchParams.set('from', query.from); url.searchParams.set('to', query.to);
  const response = await fetch(url);
  if (!response.ok) throw new Error('Football API request failed');
  return parseFixturesResponse(await response.json());
}

function parseFixturesResponse(value: unknown): FootballFixture[] {
  if (!isRecord(value) || !Array.isArray(value.data)) throw new Error('Invalid football response');
  return value.data.map(parseFixture);
}
function parseFixture(value: unknown): FootballFixture {
  if (!isRecord(value) || !isRecord(value.competition) || !isRecord(value.homeTeam) || !isRecord(value.awayTeam) || !isRecord(value.score)) throw new Error('Invalid fixture');
  return { providerId: stringField(value.providerId), competition: { slug: stringField(value.competition.slug), name: stringField(value.competition.name), countryCode: brCode(value.competition.countryCode) }, season: numberField(value.season), kickoffAt: stringField(value.kickoffAt), status: statusField(value.status), venueName: nullableString(value.venueName), homeTeam: parseTeam(value.homeTeam), awayTeam: parseTeam(value.awayTeam), score: { home: nullableNumber(value.score.home), away: nullableNumber(value.score.away) } };
}
function parseTeam(value: Record<string, unknown>): FootballTeam { return { providerId: stringField(value.providerId), name: stringField(value.name), logoUrl: nullableString(value.logoUrl) }; }
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value); }
function stringField(value: unknown): string { if (typeof value !== 'string') throw new Error('Invalid string'); return value; }
function numberField(value: unknown): number { if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error('Invalid number'); return value; }
function nullableString(value: unknown): string | null { if (value === null) return null; return stringField(value); }
function nullableNumber(value: unknown): number | null { if (value === null) return null; return numberField(value); }
function brCode(value: unknown): 'BR' { if (value !== 'BR') throw new Error('Invalid country code'); return value; }
function statusField(value: unknown): FootballFixtureStatus { if (value === 'scheduled' || value === 'live' || value === 'finished' || value === 'postponed' || value === 'cancelled' || value === 'unknown') return value; throw new Error('Invalid fixture status'); }
