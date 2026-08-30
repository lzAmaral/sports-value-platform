import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  BrazilianCompetitionSlug,
  FootballFixture,
  FootballFixturesQuery,
  FootballFixtureStatus,
} from '../domain/football.types.js';
import {
  FootballProviderConfigurationError,
  FootballProviderUnavailableError,
  type FootballProvider,
} from './football-provider.js';

const API_FOOTBALL_LEAGUE_IDS: Record<BrazilianCompetitionSlug, number> = {
  'brasileirao-serie-a': 71,
  'brasileirao-serie-b': 72,
  'copa-do-brasil': 73,
};

const API_FOOTBALL_BASE_URL = 'https://v3.football.api-sports.io';

type JsonRecord = Record<string, unknown>;

@Injectable()
export class ApiFootballClient implements FootballProvider {
  constructor(private readonly config: ConfigService) {}

  async getFixtures(query: FootballFixturesQuery): Promise<FootballFixture[]> {
    const apiKey = this.config.get<string>('API_FOOTBALL_KEY')?.trim();
    if (!apiKey) {
      throw new FootballProviderConfigurationError('API_FOOTBALL_KEY is not configured');
    }

    const url = new URL('/fixtures', API_FOOTBALL_BASE_URL);
    url.searchParams.set('league', String(API_FOOTBALL_LEAGUE_IDS[query.competition]));
    url.searchParams.set('season', String(query.season));
    if (query.from) url.searchParams.set('from', query.from);
    if (query.to) url.searchParams.set('to', query.to);

    let response: Response;
    try {
      response = await fetch(url, {
        headers: { 'x-apisports-key': apiKey },
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      throw new FootballProviderUnavailableError('API-Football request failed');
    }

    if (!response.ok) {
      throw new FootballProviderUnavailableError(`API-Football returned HTTP ${response.status}`);
    }

    const payload: unknown = await response.json();
    const root = asRecord(payload, 'response body');
    const errors = root.errors;
    if (hasProviderErrors(errors)) {
      throw new FootballProviderUnavailableError('API-Football rejected the request');
    }

    if (!Array.isArray(root.response)) {
      throw new FootballProviderUnavailableError('API-Football returned an invalid response');
    }

    return root.response.map((item) => this.toFixture(item, query));
  }

  private toFixture(value: unknown, query: FootballFixturesQuery): FootballFixture {
    try {
      const item = asRecord(value, 'fixture item');
      const fixture = asRecord(item.fixture, 'fixture');
      const status = asRecord(fixture.status, 'fixture.status');
      const venue = nullableRecord(fixture.venue);
      const teams = asRecord(item.teams, 'teams');
      const goals = asRecord(item.goals, 'goals');

      return {
        providerId: String(requiredNumber(fixture.id, 'fixture.id')),
        competition: competitionFor(query.competition),
        season: query.season,
        kickoffAt: requiredUtcTimestamp(fixture.date, 'fixture.date'),
        status: normalizeStatus(requiredString(status.short, 'fixture.status.short')),
        venueName: nullableString(venue?.name),
        homeTeam: toTeam(teams.home, 'teams.home'),
        awayTeam: toTeam(teams.away, 'teams.away'),
        score: {
          home: nullableNumber(goals.home, 'goals.home'),
          away: nullableNumber(goals.away, 'goals.away'),
        },
      };
    } catch (error) {
      if (error instanceof FootballProviderUnavailableError) throw error;
      throw new FootballProviderUnavailableError('API-Football returned an invalid fixture');
    }
  }
}

function competitionFor(slug: BrazilianCompetitionSlug) {
  const names: Record<BrazilianCompetitionSlug, string> = {
    'brasileirao-serie-a': 'Campeonato Brasileiro Série A',
    'brasileirao-serie-b': 'Campeonato Brasileiro Série B',
    'copa-do-brasil': 'Copa do Brasil',
  };
  return { slug, name: names[slug], countryCode: 'BR' as const };
}

function toTeam(value: unknown, field: string) {
  const team = asRecord(value, field);
  return {
    providerId: String(requiredNumber(team.id, `${field}.id`)),
    name: requiredString(team.name, `${field}.name`),
    logoUrl: nullableString(team.logo),
  };
}

function normalizeStatus(status: string): FootballFixtureStatus {
  if (['TBD', 'NS'].includes(status)) return 'scheduled';
  if (['1H', 'HT', '2H', 'ET', 'BT', 'P', 'SUSP', 'INT', 'LIVE'].includes(status)) return 'live';
  if (['FT', 'AET', 'PEN'].includes(status)) return 'finished';
  if (status === 'PST') return 'postponed';
  if (['CANC', 'ABD', 'AWD', 'WO'].includes(status)) return 'cancelled';
  return 'unknown';
}

function asRecord(value: unknown, field: string): JsonRecord {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new FootballProviderUnavailableError(`Invalid ${field}`);
  }
  return value as JsonRecord;
}

function nullableRecord(value: unknown): JsonRecord | null {
  return value === null || value === undefined ? null : asRecord(value, 'object');
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new FootballProviderUnavailableError(`Invalid ${field}`);
  }
  return value;
}

function nullableString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function requiredNumber(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new FootballProviderUnavailableError(`Invalid ${field}`);
  }
  return value;
}

function nullableNumber(value: unknown, field: string): number | null {
  if (value === null) return null;
  return requiredNumber(value, field);
}

function requiredUtcTimestamp(value: unknown, field: string): string {
  const timestamp = requiredString(value, field);
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    throw new FootballProviderUnavailableError(`Invalid ${field}`);
  }
  return parsed.toISOString();
}

function hasProviderErrors(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
  return false;
}
