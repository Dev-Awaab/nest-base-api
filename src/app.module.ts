import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { LoggerModule } from './logger/logger.module';
import { ExampleModule } from './example/example.module';

@Module({
  imports: [AppConfigModule, LoggerModule, ExampleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
