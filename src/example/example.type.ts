/**
 * All types and interfaces for the Example module
 */

import { PaginationParam, PaginationResponse, RangeFilter } from 'src/lib';

export interface ExampleEntity {
  id: string;
  name: string;
  description: string | null;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// DTO for creating a new example
export interface CreateExampleDto {
  name: string;
  description?: string;
  status?: 'active' | 'inactive';
}

// DTO for updating an example
export interface UpdateExampleDto {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

// Query parameters for filtering/pagination
export interface ExampleQueryParams extends RangeFilter, PaginationParam {
  limit?: number; // Backward compatibility (use 'size' from PaginationParam)
  status?: 'active' | 'inactive';
}

export interface ExampleRepo {
  create(data: CreateExampleDto): Promise<ExampleEntity>;
  findById(id: string): Promise<ExampleEntity | null>;
  findAll(
    query?: ExampleQueryParams,
  ): Promise<PaginationResponse<ExampleEntity>>;
  update(id: string, data: UpdateExampleDto): Promise<ExampleEntity | null>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
}
