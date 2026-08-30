import { BadRequestException, Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import {
  brazilianCompetitionSlugs,
  type BrazilianCompetitionSlug,
  type FootballCompetition,
  type FootballFixture,
} from './domain/football.types.js';
import {
  FOOTBALL_PROVIDER,
  FootballProviderConfigurationError,
  type FootballProvider,
} from './providers/football-provider.js';

const competitions: FootballCompetition[] = [
  { slug: 'brasileirao-serie-a', name: 'Campeonato Brasileiro Série A', countryCode: 'BR' },
  { slug: 'brasileirao-serie-b', name: 'Campeonato Brasileiro Série B', countryCode: 'BR' },
  { slug: 'copa-do-brasil', name: 'Copa do Brasil', countryCode: 'BR' },
];

@Injectable()
export class FootballService {
  constructor(@Inject(FOOTBALL_PROVIDER) private readonly provider: FootballProvider) {}

  listCompetitions(): FootballCompetition[] {
    return competitions;
  }

  async listFixtures(input: {
    competition?: string;
    season?: string;
    from?: string;
    to?: string;
  }): Promise<FootballFixture[]> {
    const competition = parseCompetition(input.competition);
    const season = parseSeason(input.season);
    const from = parseDate(input.from, 'from');
    const to = parseDate(input.to, 'to');

    if (from && to && from > to) {
      throw invalidQuery('INVALID_DATE_RANGE', '`from` must not be after `to`');
    }

    try {
      return await this.provider.getFixtures({ competition, season, from, to });
    } catch (error) {
      const code = error instanceof FootballProviderConfigurationError
        ? 'FOOTBALL_PROVIDER_NOT_CONFIGURED'
        : 'FOOTBALL_PROVIDER_UNAVAILABLE';
      throw new ServiceUnavailableException({ code, message: 'Football data is temporarily unavailable' });
    }
  }
}

function parseCompetition(value: string | undefined): BrazilianCompetitionSlug {
  const competition = brazilianCompetitionSlugs.find((slug) => slug === value);
  if (competition) return competition;
  throw invalidQuery(
    'INVALID_COMPETITION',
    `competition must be one of: ${brazilianCompetitionSlugs.join(', ')}`,
  );
}

function parseSeason(value: string | undefined): number {
  if (value && /^\d{4}$/.test(value)) {
    const season = Number(value);
    if (season >= 2010 && season <= new Date().getUTCFullYear() + 1) return season;
  }
  throw invalidQuery('INVALID_SEASON', 'season must be a valid four-digit year');
}

function parseDate(value: string | undefined, field: string): string | undefined {
  if (value === undefined) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))) return value;
  throw invalidQuery('INVALID_DATE', `${field} must use YYYY-MM-DD`);
}

function invalidQuery(code: string, message: string): BadRequestException {
  return new BadRequestException({ code, message });
}
