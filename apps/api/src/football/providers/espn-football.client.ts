import { Injectable } from '@nestjs/common';
import type {
  BrazilianCompetitionSlug,
  FootballFixture,
  FootballFixturesQuery,
  FootballFixtureStatus,
} from '../domain/football.types.js';
import { FootballProviderUnavailableError, type FootballProvider } from './football-provider.js';

const ESPN_LEAGUES: Record<BrazilianCompetitionSlug, string> = {
  'brasileirao-serie-a': 'bra.1',
  'brasileirao-serie-b': 'bra.2',
  'copa-do-brasil': 'bra.copa_do_brazil',
};

type JsonRecord = Record<string, unknown>;

@Injectable()
export class EspnFootballClient implements FootballProvider {
  async getFixtures(query: FootballFixturesQuery): Promise<FootballFixture[]> {
    const url = new URL(
      `/apis/site/v2/sports/soccer/${ESPN_LEAGUES[query.competition]}/scoreboard`,
      'https://site.api.espn.com',
    );
    if (query.from || query.to) {
      const from = (query.from ?? query.to)?.replaceAll('-', '');
      const to = (query.to ?? query.from)?.replaceAll('-', '');
      url.searchParams.set('dates', from === to ? String(from) : `${from}-${to}`);
    }

    let response: Response;
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    } catch {
      throw new FootballProviderUnavailableError('ESPN request failed');
    }
    if (!response.ok) throw new FootballProviderUnavailableError(`ESPN returned HTTP ${response.status}`);

    const root = record(await response.json(), 'response body');
    if (!Array.isArray(root.events)) throw new FootballProviderUnavailableError('ESPN returned an invalid response');
    return root.events.map((event) => toFixture(event, query));
  }
}

function toFixture(value: unknown, query: FootballFixturesQuery): FootballFixture {
  const event = record(value, 'event');
  const status = record(record(event.status, 'status').type, 'status.type');
  const competitions = array(event.competitions, 'competitions');
  const competition = record(competitions[0], 'competition');
  const competitors = array(competition.competitors, 'competitors').map((item) => record(item, 'competitor'));
  const home = competitors.find((item) => item.homeAway === 'home');
  const away = competitors.find((item) => item.homeAway === 'away');
  if (!home || !away) throw new FootballProviderUnavailableError('ESPN fixture has no home or away team');
  const venue = nullableRecord(competition.venue);

  return {
    providerId: text(event.id, 'event.id'),
    competition: competitionFor(query.competition),
    season: query.season,
    kickoffAt: timestamp(event.date, 'event.date'),
    status: normalizeStatus(status),
    venueName: optionalText(venue?.fullName),
    homeTeam: team(home),
    awayTeam: team(away),
    score: { home: score(home.score), away: score(away.score) },
  };
}

function team(competitor: JsonRecord) {
  const value = record(competitor.team, 'team');
  return {
    providerId: text(value.id, 'team.id'),
    name: text(value.displayName, 'team.displayName'),
    logoUrl: optionalText(value.logo),
  };
}

function normalizeStatus(value: JsonRecord): FootballFixtureStatus {
  if (value.state === 'pre') return 'scheduled';
  if (value.state === 'in') return 'live';
  if (value.state === 'post' && value.completed === true) return 'finished';
  const name = optionalText(value.name) ?? '';
  if (name.includes('POSTPONED')) return 'postponed';
  if (name.includes('CANCELED') || name.includes('CANCELLED')) return 'cancelled';
  return 'unknown';
}

function competitionFor(slug: BrazilianCompetitionSlug) {
  const names: Record<BrazilianCompetitionSlug, string> = {
    'brasileirao-serie-a': 'Campeonato Brasileiro Série A',
    'brasileirao-serie-b': 'Campeonato Brasileiro Série B',
    'copa-do-brasil': 'Copa do Brasil',
  };
  return { slug, name: names[slug], countryCode: 'BR' as const };
}

function record(value: unknown, field: string): JsonRecord {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new FootballProviderUnavailableError(`Invalid ${field}`);
  }
  return value as JsonRecord;
}

function nullableRecord(value: unknown): JsonRecord | null {
  return value === null || value === undefined ? null : record(value, 'object');
}

function array(value: unknown, field: string): unknown[] {
  if (!Array.isArray(value) || value.length === 0) throw new FootballProviderUnavailableError(`Invalid ${field}`);
  return value;
}

function text(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.length === 0) throw new FootballProviderUnavailableError(`Invalid ${field}`);
  return value;
}

function optionalText(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function timestamp(value: unknown, field: string): string {
  const parsed = new Date(text(value, field));
  if (Number.isNaN(parsed.getTime())) throw new FootballProviderUnavailableError(`Invalid ${field}`);
  return parsed.toISOString();
}

function score(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
