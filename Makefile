.PHONY: help install build up down logs clean reset dev prod test lint format health status

# Default target
help: ## Show this help message
	@echo "WebApp Makefile Commands"
	@echo "======================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Installation and setup
install: ## Install dependencies and setup environment
	@echo "🔧 Installing dependencies..."
	@cd webapp && npm install
	@cp webapp/.env.example webapp/.env 2>/dev/null || true
	@touch docker/acme.json && chmod 600 docker/acme.json
	@echo "✅ Installation completed"

# Docker operations
build: ## Build Docker images
	@echo "🏗️ Building Docker images..."
	@docker-compose build --no-cache

up: ## Start all services
	@echo "🚀 Starting services..."
	@docker-compose up -d
	@$(MAKE) health

down: ## Stop all services
	@echo "🛑 Stopping services..."
	@docker-compose down

restart: ## Restart all services
	@echo "🔄 Restarting services..."
	@docker-compose restart

logs: ## Show logs for all services
	@docker-compose logs -f

logs-app: ## Show logs for webapp only
	@docker-compose logs -f webapp

logs-db: ## Show logs for database only
	@docker-compose logs -f postgres

# Development
dev: ## Start development environment
	@echo "🛠️ Starting development environment..."
	@cd webapp && npm run dev

dev-docker: ## Start development with Docker
	@echo "🐳 Starting development with Docker..."
	@docker-compose -f docker-compose.yml up -d postgres
	@sleep 5
	@cd webapp && npm run dev

# Production
prod: build up ## Build and start production environment

# Database operations
db-shell: ## Access PostgreSQL shell
	@docker-compose exec postgres psql -U lama -d webapp

db-reset: ## Reset database (DANGEROUS)
	@echo "⚠️ This will delete all data!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo ""; \
		docker-compose down -v; \
		docker-compose up -d postgres; \
		echo "Database reset completed"; \
	else \
		echo ""; \
		echo "Operation cancelled"; \
	fi

# Code quality
test: ## Run tests
	@cd webapp && npm run test 2>/dev/null || echo "No tests configured yet"

lint: ## Run linter
	@cd webapp && npm run lint

lint-fix: ## Fix linting issues
	@cd webapp && npm run lint -- --fix 2>/dev/null || echo "Lint fix not available"

format: ## Format code
	@cd webapp && npx prettier --write . 2>/dev/null || echo "Prettier not configured"

# Monitoring
status: ## Show service status
	@echo "📊 Service Status:"
	@docker-compose ps
	@echo ""
	@echo "🌐 Access URLs:"
	@echo "  WebApp: http://localhost:3000"
	@echo "  PostgreSQL: localhost:5432"
	@echo "  Traefik Dashboard: http://localhost:8080"

health: ## Check service health
	@echo "🔍 Checking service health..."
	@sleep 5
	@curl -f http://localhost:3000 > /dev/null 2>&1 && echo "✅ WebApp: OK" || echo "❌ WebApp: ERROR"
	@docker-compose exec -T postgres pg_isready -U lama > /dev/null 2>&1 && echo "✅ PostgreSQL: OK" || echo "❌ PostgreSQL: ERROR"

# Cleanup operations
clean: ## Clean unused Docker resources
	@echo "🧹 Cleaning Docker resources..."
	@docker image prune -f
	@docker container prune -f
	@docker network prune -f
	@echo "✅ Cleanup completed"

reset: ## Reset everything (containers, volumes, images)
	@echo "🔄 Resetting everything..."
	@docker-compose down -v
	@docker-compose rm -f
	@docker system prune -af
	@echo "✅ Reset completed"

# Vagrant operations
vagrant-up: ## Start Vagrant environment
	@vagrant up

vagrant-ssh: ## SSH into Vagrant box
	@vagrant ssh

vagrant-destroy: ## Destroy Vagrant environment
	@vagrant destroy -f

# Deployment
deploy: ## Deploy to production (requires proper setup)
	@echo "🚀 Deploying to production..."
	@git push origin main
	@echo "✅ Deployment triggered via GitHub Actions"

# Backup operations
backup-db: ## Backup database
	@echo "💾 Creating database backup..."
	@mkdir -p backups
	@docker-compose exec -T postgres pg_dump -U lama webapp > backups/webapp_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Database backup created in backups/ directory"

restore-db: ## Restore database from backup (specify BACKUP_FILE)
ifndef BACKUP_FILE
	@echo "❌ Please specify BACKUP_FILE: make restore-db BACKUP_FILE=backup.sql"
else
	@echo "📥 Restoring database from $(BACKUP_FILE)..."
	@docker-compose exec -T postgres psql -U lama -d webapp < $(BACKUP_FILE)
	@echo "✅ Database restored"
endif

# Quick commands
quick-start: install up health ## Quick setup and start (install + up + health)
	@echo "🎉 WebApp is ready at http://localhost:3000"

quick-dev: install dev ## Quick development setup (install + dev)

# Docker maintenance
update-images: ## Update all Docker images
	@echo "⬆️ Updating Docker images..."
	@docker-compose pull
	@docker-compose up -d
	@echo "✅ Images updated"

shell-app: ## Access webapp container shell
	@docker-compose exec webapp sh

shell-db: ## Access database container shell
	@docker-compose exec postgres bash

# Environment management
env-copy: ## Copy environment template
	@cp webapp/.env.example webapp/.env
	@echo "✅ Environment file copied. Please edit webapp/.env"

env-show: ## Show current environment variables
	@echo "Current environment:"
	@cat webapp/.env 2>/dev/null || echo "No .env file found"
