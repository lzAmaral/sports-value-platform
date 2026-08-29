import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly database: DatabaseService) {}

  @Get()
  live(): { status: string; service: string } {
    return { status: 'ok', service: 'sports-value-api' };
  }

  @Get('ready')
  async ready(): Promise<{ status: string; database: string }> {
    try {
      await this.database.ping();
      return { status: 'ok', database: 'connected' };
    } catch {
      throw new ServiceUnavailableException({ status: 'degraded', database: 'unavailable' });
    }
  }
}
