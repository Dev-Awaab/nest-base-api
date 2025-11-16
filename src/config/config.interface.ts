import { NODE_ENV } from 'src/lib';

export interface IConfig {
  START_PORT: number;
  NODE_ENV: NODE_ENV;
  DATABASE_URL: string;
  DATABASE_SCHEMA: string;
  LOKI_URL: string;
  LOKI_USERNAME: string;
  LOKI_PASSWORD: string;
  LOGTAIL_TOKEN: string;
}
