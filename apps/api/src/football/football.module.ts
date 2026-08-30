import { Module } from '@nestjs/common';
import { FootballController } from './football.controller.js';
import { FootballService } from './football.service.js';
import { ApiFootballClient } from './providers/api-football.client.js';
import { FOOTBALL_PROVIDER } from './providers/football-provider.js';
import { EspnFootballClient } from './providers/espn-football.client.js';

const currentSeason = new Date().getUTCFullYear();

@Module({
  controllers: [FootballController],
  providers: [
    FootballService,
    ApiFootballClient,
    EspnFootballClient,
    {
      provide: FOOTBALL_PROVIDER,
      inject: [ApiFootballClient, EspnFootballClient],
      useFactory: (apiFootball: ApiFootballClient, espn: EspnFootballClient) => ({
        getFixtures: (query: Parameters<ApiFootballClient['getFixtures']>[0]) =>
          query.season >= currentSeason ? espn.getFixtures(query) : apiFootball.getFixtures(query),
      }),
    },
  ],
})
export class FootballModule {}
