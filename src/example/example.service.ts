import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  ExampleRepo,
  ExampleEntity,
  CreateExampleDto,
  UpdateExampleDto,
  ExampleQueryParams,
} from './example.type';
import type { PaginationResponse } from 'src/lib';

@Injectable()
export class ExampleService {
  constructor(private readonly exampleRepo: ExampleRepo) {}

  /**
   * Create a new example
   * Business logic: Validates business rules before creation
   */
  async create(data: CreateExampleDto): Promise<ExampleEntity> {
    // Business logic: Apply default values
    if (!data.status) {
      data.status = 'active'; // Default status
    }

    // Additional business validation can go here
    // e.g., check if name already exists, validate against business rules, etc.

    return this.exampleRepo.create(data);
  }

  /**
   * Get an example by ID
   * Business logic: May include authorization checks, data transformation, etc.
   */
  async findById(id: string): Promise<ExampleEntity | null> {
    // Business logic: May include authorization checks, data transformation
    const example = await this.exampleRepo.findById(id);

    if (!example) {
      return null;
    }

    // Additional business logic can go here
    // e.g., check if user has permission to view this example, transform data, etc.

    return example;
  }

  /**
   * Get all examples with pagination and filtering
   * Business logic: Applies business rules for filtering, sorting, etc.
   */
  async findAll(
    query?: ExampleQueryParams,
  ): Promise<PaginationResponse<ExampleEntity>> {
    // Business logic: Apply business rules for filtering, sorting, etc.
    // Normalize pagination parameters (handle both page/limit and page/size)
    const normalizedQuery: ExampleQueryParams = {
      page: query?.page || 1,
      size: query?.size || query?.limit || 10,
      status: query?.status,
      search: query?.search,
      from: query?.from,
      to: query?.to,
    };

    // Additional business logic can go here
    // e.g., filter by user permissions, apply business-specific sorting, etc.

    return this.exampleRepo.findAll(normalizedQuery);
  }

  /**
   * Update an example
   * Business logic: Validates business rules, handles partial updates
   */
  async update(
    id: string,
    data: UpdateExampleDto,
  ): Promise<ExampleEntity | null> {
    // Business logic: Validate business rules before update
    // Example: Check if update is allowed, validate state transitions, etc.

    // Check if example exists
    const exists = await this.exampleRepo.exists(id);
    if (!exists) {
      throw new NotFoundException(`Example with ID ${id} not found`);
    }

    // Additional business validation can go here
    // e.g., check permissions, validate status transitions, etc.

    return this.exampleRepo.update(id, data);
  }

  /**
   * Delete an example
   * Business logic: May include soft delete, cascade checks, etc.
   */
  async delete(id: string): Promise<boolean> {
    // Business logic: May include soft delete, cascade checks, etc.
    // Example: Check if deletion is allowed, handle related entities, etc.

    // Check if example exists
    const exists = await this.exampleRepo.exists(id);
    if (!exists) {
      throw new NotFoundException(`Example with ID ${id} not found`);
    }

    // Additional business logic can go here
    // e.g., check if example can be deleted (not referenced elsewhere), soft delete, etc.

    return this.exampleRepo.delete(id);
  }
}
