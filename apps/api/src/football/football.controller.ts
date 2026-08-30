import { Controller, Get, Query } from '@nestjs/common';
import type { FootballCompetition, FootballFixture } from './domain/football.types.js';
import { FootballService } from './football.service.js';

@Controller('football')
export class FootballController {
  constructor(private readonly football: FootballService) {}

  @Get('competitions')
  competitions(): { data: FootballCompetition[] } {
    return { data: this.football.listCompetitions() };
  }

  @Get('fixtures')
  async fixtures(
    @Query('competition') competition?: string,
    @Query('season') season?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<{ data: FootballFixture[] }> {
    return { data: await this.football.listFixtures({ competition, season, from, to }) };
  }
}
