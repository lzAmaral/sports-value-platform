import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { FootballService } from './football.service.js';
import {
  FootballProviderConfigurationError,
  type FootballProvider,
} from './providers/football-provider.js';

function provider(): FootballProvider {
  return { getFixtures: vi.fn().mockResolvedValue([]) };
}

describe('FootballService', () => {
  it('publishes the supported Brazilian competitions', () => {
    const service = new FootballService(provider());

    expect(service.listCompetitions().map(({ slug }) => slug)).toEqual([
      'brasileirao-serie-a',
      'brasileirao-serie-b',
      'copa-do-brasil',
    ]);
  });

  it('passes a validated canonical query to the provider', async () => {
    const footballProvider = provider();
    const service = new FootballService(footballProvider);

    await service.listFixtures({
      competition: 'brasileirao-serie-a',
      season: '2026',
      from: '2026-08-01',
      to: '2026-08-31',
    });

    expect(footballProvider.getFixtures).toHaveBeenCalledWith({
      competition: 'brasileirao-serie-a',
      season: 2026,
      from: '2026-08-01',
      to: '2026-08-31',
    });
  });

  it('rejects unsupported competitions before calling the provider', async () => {
    const footballProvider = provider();
    const service = new FootballService(footballProvider);

    await expect(
      service.listFixtures({ competition: 'premier-league', season: '2026' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(footballProvider.getFixtures).not.toHaveBeenCalled();
  });

  it('does not leak provider configuration details', async () => {
    const footballProvider: FootballProvider = {
      getFixtures: vi.fn().mockRejectedValue(new FootballProviderConfigurationError('secret detail')),
    };
    const service = new FootballService(footballProvider);

    const request = service.listFixtures({ competition: 'copa-do-brasil', season: '2026' });
    await expect(request).rejects.toBeInstanceOf(ServiceUnavailableException);
    await expect(request).rejects.not.toThrow('secret detail');
  });
});
