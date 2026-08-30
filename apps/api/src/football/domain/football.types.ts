export const brazilianCompetitionSlugs = [
  'brasileirao-serie-a',
  'brasileirao-serie-b',
  'copa-do-brasil',
] as const;

export type BrazilianCompetitionSlug = (typeof brazilianCompetitionSlugs)[number];

export type FootballCompetition = {
  slug: BrazilianCompetitionSlug;
  name: string;
  countryCode: 'BR';
};

export type FootballTeam = {
  providerId: string;
  name: string;
  logoUrl: string | null;
};

export type FootballFixtureStatus =
  | 'scheduled'
  | 'live'
  | 'finished'
  | 'postponed'
  | 'cancelled'
  | 'unknown';

export type FootballFixture = {
  providerId: string;
  competition: FootballCompetition;
  season: number;
  kickoffAt: string;
  status: FootballFixtureStatus;
  venueName: string | null;
  homeTeam: FootballTeam;
  awayTeam: FootballTeam;
  score: {
    home: number | null;
    away: number | null;
  };
};

export type FootballFixturesQuery = {
  competition: BrazilianCompetitionSlug;
  season: number;
  from?: string;
  to?: string;
};
