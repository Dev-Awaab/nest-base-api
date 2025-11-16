import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConfig } from './config.interface';
import { NODE_ENV } from 'src/lib';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService<IConfig, true>) {}

  get<T extends keyof IConfig>(key: T): IConfig[T] {
    return this.configService.get(key, { infer: true });
  }

  // Helper methods
  get port(): number {
    return this.get('START_PORT');
  }

  get isProduction(): boolean {
    return this.get('NODE_ENV') === NODE_ENV.PRODUCTION;
  }
}
