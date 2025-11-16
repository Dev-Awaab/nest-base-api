# AI.md - Project Documentation

This document provides context and guidelines for AI assistants working on this NestJS base API project.

## Project Overview

**nest-base-api** is a reusable NestJS base API project that follows clean architecture principles and provides a standardized structure for building scalable backend applications.

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.7+
- **Runtime**: Node.js
- **Database**: PostgreSQL (with Drizzle ORM support)
- **Validation**: class-validator & class-transformer
- **Logging**: Pino

## Architecture Pattern

This project follows a **layered architecture** with clear separation of concerns:

```
Controller → Service → Repository → Database
```

### Module Structure Pattern

Each feature module follows this structure:

```
src/{module-name}/
├── {module-name}.type.ts          # All types and interfaces
├── {module-name}.validation.ts     # Validation DTOs (class-validator)
├── {module-name}.repository.ts     # Database implementation
├── {module-name}.service.ts        # Business logic (injectable)
├── {module-name}.service-impl.ts  # Service implementation (extends service)
├── {module-name}.controller.ts     # HTTP endpoints
└── {module-name}.module.ts         # NestJS module definition
```

### File Responsibilities

1. **`{module-name}.type.ts`**
   - Contains all TypeScript types and interfaces
   - Entity types, DTOs, query parameters
   - Repository interface (`{Module}Repo`) that defines the contract
   - Extends shared types from `src/lib/types` (e.g., `PaginationParam`, `RangeFilter`)

2. **`{module-name}.validation.ts`**
   - Validation classes using `class-validator` and `class-transformer`
   - Implements DTOs from `.type.ts`
   - Used with NestJS `ValidationPipe` for automatic validation
   - Example: `CreateExampleValidationDto`, `UpdateExampleValidationDto`

3. **`{module-name}.repository.ts`**
   - Implements the repository interface from `.type.ts`
   - Contains database access logic
   - Injectable service that handles all data persistence
   - Currently uses in-memory mock (replace with actual DB implementation)

4. **`{module-name}.service.ts`**
   - Injectable service class
   - Contains business logic methods
   - Injects repository via constructor: `constructor(private readonly {module}Repo: {Module}Repo)`
   - Methods: `create()`, `findById()`, `findAll()`, `update()`, `delete()`

5. **`{module-name}.service-impl.ts`**
   - Extends `{Module}Service`
   - Passes repository to super constructor
   - Can add additional implementation-specific logic
   - Currently minimal, but allows for extension

6. **`{module-name}.controller.ts`**
   - HTTP endpoints (GET, POST, PUT, DELETE)
   - Uses validation DTOs from `.validation.ts`
   - Injects `{Module}ServiceImpl` (not the abstract service)
   - Handles HTTP status codes and error responses

7. **`{module-name}.module.ts`**
   - NestJS module definition
   - Provides: `{Module}ServiceImpl`, `{Module}Repository`
   - Controllers: `{Module}Controller`
   - Exports: `{Module}Repository` (for use in other modules)

## Key Conventions

### Type Definitions

- **Repository Interface**: Defined in `.type.ts` as `{Module}Repo` interface
- **Pagination**: Use `PaginationResponse<T>` from `src/lib/types`
- **Query Params**: Extend `PaginationParam` and `RangeFilter` from `src/lib/types`
- **Response Types**: Use `BuildPaginatedResponse()` helper function

### Dependency Injection Pattern

```typescript
// Service receives repository interface
@Injectable()
export class ExampleService {
  constructor(private readonly exampleRepo: ExampleRepo) {}
}

// Service implementation extends service and passes repository
@Injectable()
export class ExampleServiceImpl extends ExampleService {
  constructor(exampleRepository: ExampleRepository) {
    super(exampleRepository);
  }
}

// Module provides both
@Module({
  providers: [ExampleServiceImpl, ExampleRepository],
  // ...
})
```

### Validation Pattern

- Validation DTOs implement the base DTOs from `.type.ts`
- Use `class-validator` decorators: `@IsString()`, `@IsOptional()`, `@IsEnum()`, etc.
- Use `@Type(() => Number)` for query parameter transformation
- Use `@IsDateString()` for date fields

### Pagination Pattern

```typescript
// Query params extend PaginationParam and RangeFilter
export interface ExampleQueryParams extends RangeFilter, PaginationParam {
  status?: 'active' | 'inactive';
}

// Repository returns PaginationResponse
async findAll(query?: ExampleQueryParams): Promise<PaginationResponse<ExampleEntity>> {
  // ... filtering logic
  return BuildPaginatedResponse(data, { page, size, total, totalPages });
}
```

## Shared Utilities (`src/lib/`)

### Types (`src/lib/types/`)

- **`PaginationParam`**: `{ page?: string | number; size?: string | number; }`
- **`PaginationResponse<T>`**: Standardized paginated response structure
- **`RangeFilter`**: `{ search?: string; from?: Date; to?: Date; }`
- **`BuildPaginatedResponse()`**: Helper to build paginated responses

### Exception Handling (`src/lib/allExceptions.ts`)

- Global exception filter: `AllExceptionsFilter`
- Handles all exceptions across the application

### Serializers (`src/lib/serializers.ts`)

- Shared serialization utilities

## Project Structure

```
src/
├── app.module.ts              # Root module
├── main.ts                    # Application bootstrap
├── project.ts                 # Project metadata
├── config/                    # Configuration module
│   ├── config.module.ts
│   ├── config.service.ts
│   ├── config.interface.ts
│   └── config.schema.ts       # Environment validation
├── logger/                    # Logging module
│   ├── logger.module.ts
│   └── logger.service.ts
├── lib/                       # Shared utilities
│   ├── index.ts               # Public exports
│   ├── types/                 # Shared types
│   │   ├── custom.ts          # Pagination, filters, etc.
│   │   └── enums/
│   ├── allExceptions.ts       # Global exception filter
│   └── serializers.ts         # Serialization utilities
└── {feature}/                 # Feature modules (follow pattern above)
    └── example/               # Example module (reference implementation)
```

## Development Workflow

### Creating a New Module

1. Use the Makefile command:

   ```bash
   make new MODULE=myfeature
   ```

   This generates: `myfeature.module.ts`, `myfeature.service.ts`, `myfeature.controller.ts`

2. Create the remaining files following the pattern:
   - `myfeature.type.ts`
   - `myfeature.validation.ts`
   - `myfeature.repository.ts`
   - `myfeature.service-impl.ts`

3. Update `myfeature.module.ts` to wire up dependencies

### Database Setup

The project supports PostgreSQL with Docker:

```bash
make postgres          # Start PostgreSQL container
make createdb          # Create database
make migrate           # Run migrations (Drizzle)
make generate          # Generate migration SQL
make studio            # Open Drizzle Studio
```

### Environment Variables

Configuration is managed through `src/config/`:

- Environment variables are validated using `class-validator`
- Schema defined in `config.schema.ts`
- Interface defined in `config.interface.ts`

## Code Style & Best Practices

1. **Type Safety**: Always use TypeScript types, avoid `any`
2. **Validation**: Use `class-validator` for all DTOs
3. **Error Handling**: Use NestJS exceptions (`NotFoundException`, etc.)
4. **Dependency Injection**: Always use constructor injection
5. **Separation of Concerns**: Keep business logic in services, data access in repositories
6. **Naming**: Use descriptive names, follow NestJS conventions
7. **Comments**: Add business logic comments explaining "why", not "what"

## Testing

- Unit tests: `*.spec.ts` files alongside source files
- E2E tests: `test/` directory
- Run tests: `npm run test` or `make test`

## Important Notes for AI Assistants

1. **Always follow the module pattern** when creating new features
2. **Repository interface** is defined in `.type.ts`, not a separate file
3. **Service is injectable**, not abstract - business logic goes here
4. **Service-impl extends service** - minimal implementation, mainly for DI setup
5. **Use shared types** from `src/lib/types` for pagination and filtering
6. **Validation DTOs** must implement the base DTOs from `.type.ts`
7. **Controller uses ServiceImpl**, not the base Service class
8. **Module exports Repository** for potential reuse in other modules

## Example Reference

See `src/example/` for a complete reference implementation following all patterns:

- Full CRUD operations
- Pagination with filtering
- Date range filtering
- Validation
- Error handling

## Makefile Commands

```bash
make install          # Install dependencies
make start-dev        # Start in development mode
make build            # Build project
make lint             # Run linter
make test             # Run tests
make format           # Format code
make new MODULE=name  # Generate new module
make postgres         # Start PostgreSQL Docker container
make migrate          # Run database migrations
```

## Common Patterns to Follow

### Creating a New Entity Module

1. Define types in `{module}.type.ts`
2. Create validation DTOs in `{module}.validation.ts`
3. Implement repository in `{module}.repository.ts`
4. Add business logic in `{module}.service.ts`
5. Create service implementation in `{module}.service-impl.ts`
6. Define endpoints in `{module}.controller.ts`
7. Wire up in `{module}.module.ts`
8. Import module in `app.module.ts`

### Adding Pagination

1. Extend `PaginationParam` and `RangeFilter` in query params type
2. Use `BuildPaginatedResponse()` in repository
3. Return `PaginationResponse<T>` from service
4. Add validation for `page`, `size`, `from`, `to` in validation DTO

### Error Handling

- Use NestJS exceptions: `NotFoundException`, `BadRequestException`, etc.
- Global exception filter handles formatting
- Throw exceptions in service layer, not repository layer
