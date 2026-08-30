import type { FootballFixture, FootballFixturesQuery } from '../domain/football.types.js';

export const FOOTBALL_PROVIDER = Symbol('FOOTBALL_PROVIDER');

export interface FootballProvider {
  getFixtures(query: FootballFixturesQuery): Promise<FootballFixture[]>;
}

export class FootballProviderConfigurationError extends Error {}

export class FootballProviderUnavailableError extends Error {}
