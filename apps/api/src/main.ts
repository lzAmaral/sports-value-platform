import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:3000' });
  app.setGlobalPrefix('v1');

  const port = Number(process.env.API_PORT ?? 3001);
  await app.listen(port);
  console.log(`Sports Value API running at http://localhost:${port}/v1`);
}

void bootstrap();
