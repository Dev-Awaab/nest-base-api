# Nest Base API

A reusable NestJS base API project following clean architecture principles. This project provides a standardized structure and patterns for building scalable, maintainable backend applications.

## 🚀 Features

- **Clean Architecture** - Layered architecture with clear separation of concerns
- **Type Safety** - Full TypeScript support with strict type checking
- **Validation** - Automatic request validation using `class-validator` and `class-transformer`
- **Pagination** - Built-in pagination support with standardized response format
- **Error Handling** - Global exception filter for consistent error responses
- **Logging** - Structured logging with Pino
- **Database Ready** - PostgreSQL support with Drizzle ORM (ready to integrate)
- **Docker Support** - Easy PostgreSQL setup with Docker
- **Code Quality** - ESLint and Prettier configured
- **Testing** - Jest configured for unit and e2e tests

## 📋 Tech Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.7+
- **Runtime**: Node.js
- **Database**: PostgreSQL (with Drizzle ORM support)
- **Validation**: class-validator & class-transformer
- **Logging**: Pino
- **Testing**: Jest

## 🏗️ Architecture

This project follows a **layered architecture** pattern:

```
Controller → Service → Repository → Database
```

### Module Structure

Each feature module follows a standardized structure:

```
src/{module-name}/
├── {module-name}.type.ts          # All types and interfaces
├── {module-name}.validation.ts     # Validation DTOs
├── {module-name}.repository.ts     # Database implementation
├── {module-name}.service.ts        # Business logic
├── {module-name}.service-impl.ts  # Service implementation
├── {module-name}.controller.ts     # HTTP endpoints
└── {module-name}.module.ts         # NestJS module
```

See the `example` module for a complete reference implementation.

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (for PostgreSQL)

### Installation

```bash
# Install dependencies
npm install
# or
make install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/dbname
```

### Running the Application

```bash
# Development mode (with hot reload)
npm run start:dev
# or
make start-dev

# Production mode
npm run start:prod

# Build
npm run build
```

The API will be available at `http://localhost:3000/api`

## 📁 Project Structure

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
└── {feature}/                 # Feature modules
    └── example/               # Example module (reference)
```

## 🛠️ Development

### Creating a New Module

1. Generate module files:
   ```bash
   make new MODULE=myfeature
   ```

2. Create the remaining files following the pattern:
   - `myfeature.type.ts` - Define types and repository interface
   - `myfeature.validation.ts` - Create validation DTOs
   - `myfeature.repository.ts` - Implement database access
   - `myfeature.service-impl.ts` - Extend service (if needed)

3. Wire up dependencies in `myfeature.module.ts`

4. Import module in `app.module.ts`

See `src/example/` for a complete reference implementation.

### Code Quality

```bash
# Lint code
npm run lint
# or
make lint

# Format code
npm run format
# or
make format
```

## 🗄️ Database

### PostgreSQL with Docker

```bash
# Start PostgreSQL container
make postgres

# Create database
make createdb

# Start existing container
make startdb

# Stop container
make stopdb

# Restart container
make restartdb
```

### Database Migrations (Drizzle)

```bash
# Generate migration SQL
make generate

# Run migrations
make migrate

# Push schema to database
make db-push

# Open Drizzle Studio
make studio
```

### Database Configuration

Override database variables in Makefile or environment:

```bash
make postgres DB_NAME=myapp DB_USER=admin DB_PASSWORD=secret DB_PORT=5433
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 📚 API Documentation

### Example Endpoints

The `example` module demonstrates a full CRUD API:

- `POST /api/example` - Create a new example
- `GET /api/example` - List examples (with pagination and filtering)
- `GET /api/example/:id` - Get example by ID
- `PUT /api/example/:id` - Update example
- `DELETE /api/example/:id` - Delete example

### Query Parameters

- `page` - Page number (default: 1)
- `size` - Items per page (default: 10)
- `search` - Search term
- `from` - Start date (ISO format)
- `to` - End date (ISO format)
- `status` - Filter by status

### Response Format

Paginated responses follow this structure:

```json
{
  "data": [...],
  "pagination": {
    "next": { "page": 2, "size": 10 },
    "previous": null,
    "current_page": 1,
    "size": 10,
    "total": 25
  }
}
```

## 📝 Available Commands

### Development

```bash
make install          # Install dependencies
make start            # Start app
make start-dev        # Start in development mode
make build            # Build project
make clean            # Clean dist folder
```

### Code Quality

```bash
make lint             # Run linter
make format           # Format code
make test             # Run tests
```

### Module Generation

```bash
make new MODULE=name  # Generate module + service + controller
```

### Database

```bash
make postgres         # Start PostgreSQL container
make createdb         # Create database
make migrate          # Run migrations
make generate         # Generate migration SQL
make studio           # Open Drizzle Studio
make db-push          # Push schema to DB
```

See `make help` for all available commands.

## 🔧 Configuration

### Environment Variables

The application uses `@nestjs/config` for configuration management. Environment variables are validated using `class-validator`.

Required variables:
- `NODE_ENV` - Environment (development, production, test)
- `PORT` - Server port
- `DATABASE_URL` - PostgreSQL connection string

See `src/config/config.schema.ts` for validation rules.

## 🎯 Key Patterns

### Repository Pattern

Repository interface is defined in `.type.ts`:

```typescript
export interface ExampleRepo {
  create(data: CreateExampleDto): Promise<ExampleEntity>;
  findById(id: string): Promise<ExampleEntity | null>;
  findAll(query?: ExampleQueryParams): Promise<PaginationResponse<ExampleEntity>>;
  // ...
}
```

### Service Pattern

Service injects repository and contains business logic:

```typescript
@Injectable()
export class ExampleService {
  constructor(private readonly exampleRepo: ExampleRepo) {}
  
  async create(data: CreateExampleDto): Promise<ExampleEntity> {
    // Business logic here
    return this.exampleRepo.create(data);
  }
}
```

### Validation Pattern

Validation DTOs use `class-validator`:

```typescript
export class CreateExampleValidationDto implements CreateExampleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;
}
```

## 📖 Documentation

- [AI.md](./AI.md) - Detailed documentation for AI assistants
- [NestJS Documentation](https://docs.nestjs.com)
- See `src/example/` for reference implementation

## 🤝 Contributing

1. Follow the established module structure pattern
2. Use TypeScript strict mode
3. Add validation for all DTOs
4. Write tests for new features
5. Follow existing code style (ESLint + Prettier)

## 📄 License

This project is private and unlicensed.

## 🙏 Acknowledgments

Built with [NestJS](https://nestjs.com/) - A progressive Node.js framework.
