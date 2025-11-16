import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';
import { LoggingService } from './logger/logger.service';
import project from './project';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './lib';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const appConfigService = app.get(AppConfigService);
  const log = app.get(LoggingService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT || appConfigService.port;
  await app.listen(port);

  log.log(`${project.name} server is LIVE ⚡️ on port: ${port}`);
}
bootstrap();
