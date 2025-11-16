import { Injectable, NotFoundException } from '@nestjs/common';
import { ExampleService } from './example.service';
import { ExampleRepository } from './example.repository';

/**
 * Service implementation
 * This class extends ExampleService and implements business logic
 * It uses the ExampleRepository for database operations
 */
@Injectable()
export class ExampleServiceImpl extends ExampleService {
  constructor(exampleRepository: ExampleRepository) {
    super(exampleRepository);
  }
}
