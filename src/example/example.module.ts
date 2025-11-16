import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { ExampleRepository } from './example.repository';
import { ExampleServiceImpl } from './example.service-impl';

@Module({
  providers: [ExampleServiceImpl, ExampleRepository],
  controllers: [ExampleController],
  exports: [ExampleRepository],
})
export class ExampleModule {}
