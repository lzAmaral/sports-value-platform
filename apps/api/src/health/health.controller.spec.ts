import { Test } from '@nestjs/testing';
import { describe, expect, it, vi } from 'vitest';
import { DatabaseService } from '../database/database.service.js';
import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  it('reports the API as live', async () => {
    const module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: DatabaseService, useValue: { ping: vi.fn() } }],
    }).compile();

    expect(module.get(HealthController).live()).toEqual({
      status: 'ok',
      service: 'sports-value-api',
    });
  });
});
