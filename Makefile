# Variables
NODE_ENV ?= development
PORT ?= 3000
MODULE ?= example

# Database variables (configurable via environment or Makefile)
DB_NAME ?= nestbase
DB_USER ?= postgres
DB_PASSWORD ?= postgres
DB_PORT ?= 5432
DB_HOST ?= localhost
CONTAINER_NAME ?= nest-base-postgres

# Construct DB_URL from components if not provided
DB_URL ?= postgres://$(DB_USER):$(DB_PASSWORD)@$(DB_HOST):$(DB_PORT)/$(DB_NAME)

.PHONY: help install start start-dev build lint test format clean new migrate generate studio db-push postgres createdb dropdb startdb stopdb restartdb

help:
	@echo "Available commands:"
	@echo "  make install           Install all dependencies"
	@echo "  make start             Start the app"
	@echo "  make start-dev         Start in development mode"
	@echo "  make build             Build the project"
	@echo "  make lint              Run linter"
	@echo "  make test              Run tests"
	@echo "  make format            Format code"
	@echo "  make clean             Clean dist folder"
	@echo "  make new MODULE=name   Generate module + service + controller"
	@echo ""
	@echo "Database commands:"
	@echo "  make migrate           Run Drizzle migrations"
	@echo "  make generate          Generate Drizzle SQL"
	@echo "  make studio            Open Drizzle Studio"
	@echo "  make db-push           Push schema to DB"
	@echo ""
	@echo "PostgreSQL Docker commands:"
	@echo "  make postgres          Run PostgreSQL 16.1 in Docker"
	@echo "  make createdb          Create database in container"
	@echo "  make dropdb            Drop database in container"
	@echo "  make startdb           Start PostgreSQL container"
	@echo "  make stopdb            Stop PostgreSQL container"
	@echo "  make restartdb         Restart PostgreSQL container"
	@echo ""
	@echo "Variables (override with VAR=value):"
	@echo "  DB_NAME=$(DB_NAME)"
	@echo "  DB_USER=$(DB_USER)"
	@echo "  DB_PASSWORD=$(DB_PASSWORD)"
	@echo "  DB_PORT=$(DB_PORT)"
	@echo "  CONTAINER_NAME=$(CONTAINER_NAME)"

install:
	npm install

start:
	NODE_ENV=$(NODE_ENV) PORT=$(PORT) npm run start

start-dev:
	NODE_ENV=$(NODE_ENV) PORT=$(PORT) npm run start:dev

build:
	npm run build

lint:
	npm run lint

test:
	npm run test

format:
	npm run format

clean:
	rm -rf dist

new:
	@echo "Generating module, service, and controller for: $(MODULE)"
	npx nest generate module $(MODULE)
	npx nest generate service $(MODULE) --no-spec
	npx nest generate controller $(MODULE) --no-spec

# Drizzle ORM commands
migrate:
	npx drizzle-kit migrate

generate:
	npx drizzle-kit generate

studio:
	npx drizzle-kit studio

db-push:
	npx drizzle-kit push

# PostgreSQL Docker commands
postgres:
	@echo "Starting PostgreSQL container: $(CONTAINER_NAME)"
	@docker run --name $(CONTAINER_NAME) \
		-e POSTGRES_USER=$(DB_USER) \
		-e POSTGRES_PASSWORD=$(DB_PASSWORD) \
		-e POSTGRES_DB=$(DB_NAME) \
		-p $(DB_PORT):5432 \
		-d postgres:16.1-alpine || \
		(docker start $(CONTAINER_NAME) && echo "Container already exists, started it")

createdb:
	@echo "Creating database: $(DB_NAME)"
	@docker exec -i $(CONTAINER_NAME) psql -U $(DB_USER) -c "CREATE DATABASE $(DB_NAME);" || \
		echo "Database $(DB_NAME) might already exist"

dropdb:
	@echo "Dropping database: $(DB_NAME)"
	@docker exec -i $(CONTAINER_NAME) psql -U $(DB_USER) -c "DROP DATABASE IF EXISTS $(DB_NAME);"

startdb:
	@echo "Starting PostgreSQL container: $(CONTAINER_NAME)"
	@docker start $(CONTAINER_NAME) || echo "Container $(CONTAINER_NAME) not found. Run 'make postgres' first."

stopdb:
	@echo "Stopping PostgreSQL container: $(CONTAINER_NAME)"
	@docker stop $(CONTAINER_NAME) || echo "Container $(CONTAINER_NAME) not running."

restartdb:
	@echo "Restarting PostgreSQL container: $(CONTAINER_NAME)"
	@docker restart $(CONTAINER_NAME) || echo "Container $(CONTAINER_NAME) not found. Run 'make postgres' first."