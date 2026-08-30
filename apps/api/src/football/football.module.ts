import { Module } from '@nestjs/common';
import { FootballController } from './football.controller.js';
import { FootballService } from './football.service.js';
import { ApiFootballClient } from './providers/api-football.client.js';
import { FOOTBALL_PROVIDER } from './providers/football-provider.js';

@Module({
  controllers: [FootballController],
  providers: [
    FootballService,
    ApiFootballClient,
    { provide: FOOTBALL_PROVIDER, useExisting: ApiFootballClient },
  ],
})
export class FootballModule {}
