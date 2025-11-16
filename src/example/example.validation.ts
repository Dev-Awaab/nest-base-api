import {
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CreateExampleDto,
  UpdateExampleDto,
  ExampleQueryParams,
} from './example.type';

/**
 * Validation classes using class-validator and class-transformer
 * These classes are used with NestJS ValidationPipe for automatic validation
 */

export class CreateExampleValidationDto implements CreateExampleDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @IsEnum(['active', 'inactive'], {
    message: 'Status must be either "active" or "inactive"',
  })
  @IsOptional()
  status?: 'active' | 'inactive';
}

export class UpdateExampleValidationDto implements UpdateExampleDto {
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @IsEnum(['active', 'inactive'], {
    message: 'Status must be either "active" or "inactive"',
  })
  @IsOptional()
  status?: 'active' | 'inactive';
}

export class ExampleQueryParamsValidationDto implements ExampleQueryParams {
  @Type(() => Number)
  @IsOptional()
  page?: string | number;

  @Type(() => Number)
  @IsOptional()
  size?: string | number;

  @IsEnum(['active', 'inactive'], {
    message: 'Status must be either "active" or "inactive"',
  })
  @IsOptional()
  status?: 'active' | 'inactive';

  @IsString()
  @IsOptional()
  search?: string;

  @IsDateString()
  @IsOptional()
  from?: Date;

  @IsDateString()
  @IsOptional()
  to?: Date;
}
