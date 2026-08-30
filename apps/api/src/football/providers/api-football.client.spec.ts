import { ConfigService } from '@nestjs/config';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiFootballClient } from './api-football.client.js';
import { FootballProviderConfigurationError } from './football-provider.js';

describe('ApiFootballClient', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('requires a server-side API key', async () => {
    const client = new ApiFootballClient(new ConfigService({}));

    await expect(
      client.getFixtures({ competition: 'brasileirao-serie-a', season: 2026 }),
    ).rejects.toBeInstanceOf(FootballProviderConfigurationError);
  });

  it('maps an API-Football fixture to the canonical contract', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        errors: {},
        response: [{
          fixture: {
            id: 123,
            date: '2026-08-30T19:00:00-03:00',
            status: { short: 'NS' },
            venue: { name: 'Maracanã' },
          },
          teams: {
            home: { id: 10, name: 'Time A', logo: 'https://example.test/a.png' },
            away: { id: 20, name: 'Time B', logo: null },
          },
          goals: { home: null, away: null },
        }],
      }), { status: 200 }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const client = new ApiFootballClient(new ConfigService({ API_FOOTBALL_KEY: 'test-key' }));

    const fixtures = await client.getFixtures({
      competition: 'brasileirao-serie-a',
      season: 2026,
      from: '2026-08-30',
      to: '2026-08-31',
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const requestedUrl = new URL(fetchMock.mock.calls[0][0]);
    expect(requestedUrl.searchParams.get('league')).toBe('71');
    expect(fixtures).toEqual([{
      providerId: '123',
      competition: {
        slug: 'brasileirao-serie-a',
        name: 'Campeonato Brasileiro Série A',
        countryCode: 'BR',
      },
      season: 2026,
      kickoffAt: '2026-08-30T22:00:00.000Z',
      status: 'scheduled',
      venueName: 'Maracanã',
      homeTeam: {
        providerId: '10',
        name: 'Time A',
        logoUrl: 'https://example.test/a.png',
      },
      awayTeam: { providerId: '20', name: 'Time B', logoUrl: null },
      score: { home: null, away: null },
    }]);
  });
});
