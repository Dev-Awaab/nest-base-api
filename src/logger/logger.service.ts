import { Injectable } from '@nestjs/common';
import pino, { Logger } from 'pino';
import { AppConfigService } from '../config/config.service';
import project from '../project';
import { LogLevels } from 'src/lib';
import { errorSerializer, requestSerializer } from 'src/lib';

@Injectable()
export class LoggingService {
  private logger: Logger;

  constructor(private configService: AppConfigService) {
    const isTest = configService.get('NODE_ENV') === 'test';
    const isProduction = configService.get('NODE_ENV') === 'production';

    this.logger = pino(
      {
        name: project.logName,
        level: isTest ? LogLevels.silent : LogLevels.info,
        redact: {
          paths: ['password', '*.password', '*.newPassword', 'token'],
          censor: '**REDACTED**',
        },
        serializers: {
          err: errorSerializer,
          error: errorSerializer,
          request: requestSerializer,
        },
        formatters: {
          level: (label) => ({ level: label }),
        },
        timestamp: () => `,"time":"${new Date().toISOString()}"`,
      },
      isProduction
        ? undefined
        : pino.transport({
            target: 'pino-pretty',
            options: { colorize: true },
          }),
    );
  }

  log(message: string, data?: Record<string, unknown>) {
    this.logger.info(data || {}, message);
  }

  info(context: string, message: string, data?: Record<string, unknown>) {
    this.logger.info(data, `[${context}] ${message}`);
  }

  error(
    context: string,
    error: Error,
    message?: string,
    data?: Record<string, unknown>,
  ) {
    this.logger.error(
      { ...data, error },
      `[${context}] ${message || error.message}`,
    );
  }

  warn(context: string, message: string, data?: Record<string, unknown>) {
    this.logger.warn(data, `[${context}] ${message}`);
  }

  debug(context: string, message: string, data?: Record<string, unknown>) {
    this.logger.debug(data, `[${context}] ${message}`);
  }

  http(
    requestId: string,
    data: {
      method: string;
      url: string;
      headers?: Record<string, string>;
      body?: unknown;
    },
  ) {
    this.logger.info({ requestId, ...data }, '[HTTP Request]');
  }
}
