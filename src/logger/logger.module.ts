import { Module } from '@nestjs/common';
import { LoggingService } from './logger.service';
import { AppConfigModule } from 'src/config/config.module';

@Module({
  imports: [AppConfigModule],
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggerModule {}
