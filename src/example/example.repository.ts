import { Injectable } from '@nestjs/common';
import {
  ExampleEntity,
  CreateExampleDto,
  UpdateExampleDto,
  ExampleQueryParams,
  ExampleRepo,
} from './example.type';
import { BuildPaginatedResponse, PaginationResponse } from 'src/lib';

/**
 * Repository implementation
 * This class implements the database abstraction defined in example.repo.ts
 *
 * NOTE: This is a mock implementation for demonstration purposes.
 * Replace this with your actual database implementation (Drizzle, TypeORM, Prisma, etc.)
 */
@Injectable()
export class ExampleRepository implements ExampleRepo {
  // In-memory store for demonstration (replace with actual database)
  private examples: ExampleEntity[] = [];
  private idCounter = 1;

  async create(data: CreateExampleDto): Promise<ExampleEntity> {
    const now = new Date();
    const example: ExampleEntity = {
      id: `example-${this.idCounter++}`,
      name: data.name,
      description: data.description || null,
      status: data.status || 'active',
      createdAt: now,
      updatedAt: now,
    };

    this.examples.push(example);
    return example;
  }

  async findById(id: string): Promise<ExampleEntity | null> {
    return this.examples.find((ex) => ex.id === id) || null;
  }

  async findAll(
    query?: ExampleQueryParams,
  ): Promise<PaginationResponse<ExampleEntity>> {
    let filtered = [...this.examples];

    // Apply filters
    if (query?.status) {
      filtered = filtered.filter((ex) => ex.status === query.status);
    }

    if (query?.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter(
        (ex) =>
          ex.name.toLowerCase().includes(searchLower) ||
          ex.description?.toLowerCase().includes(searchLower),
      );
    }

    // Apply date range filters
    if (query?.from) {
      filtered = filtered.filter((ex) => ex.createdAt >= query.from!);
    }

    if (query?.to) {
      filtered = filtered.filter((ex) => ex.createdAt <= query.to!);
    }

    // Pagination - normalize page and size
    const page = Number(query?.page) || 1;
    const size = Number(query?.size) || 10;
    const total = filtered.length;
    const totalPages = Math.ceil(total / size);
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const data = filtered.slice(startIndex, endIndex);

    return BuildPaginatedResponse(data, {
      page,
      size,
      total,
      totalPages,
    });
  }

  async update(
    id: string,
    data: UpdateExampleDto,
  ): Promise<ExampleEntity | null> {
    const index = this.examples.findIndex((ex) => ex.id === id);
    if (index === -1) {
      return null;
    }

    const updated: ExampleEntity = {
      ...this.examples[index],
      ...data,
      updatedAt: new Date(),
    };

    this.examples[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.examples.findIndex((ex) => ex.id === id);
    if (index === -1) {
      return false;
    }

    this.examples.splice(index, 1);
    return true;
  }

  async exists(id: string): Promise<boolean> {
    return this.examples.some((ex) => ex.id === id);
  }
}
