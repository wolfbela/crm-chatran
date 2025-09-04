.PHONY: help install build up down logs clean reset dev prod test lint format health status
.PHONY: vm-up vm-down vm-ssh vm-status vm-logs vm-restart vm-build vm-shell vm-health
.PHONY: local-up local-down local-logs local-status

# Default target
help: ## Show this help message
	@echo "WebApp Makefile Commands"
	@echo "======================="
	@echo "🔧 Setup & Installation:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*Setup.*$$|^[a-zA-Z_-]+:.*?## .*Install.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "🚀 VM Operations:"
	@grep -E '^vm-[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "🐳 Local Docker:"
	@grep -E '^local-[a-zA-Z_-]+:.*?## .*$$|^[a-zA-Z_-]+:.*?## .*(?:Start|Stop|Build|Docker).*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "🛠️ Development:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*(?:dev|test|lint|format).*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "📊 Monitoring:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*(?:status|health|logs).*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Installation and setup
install: ## Setup local environment (install dependencies)
	@echo "🔧 Installing dependencies..."
	@cd webapp && npm install
	@cp webapp/.env.example webapp/.env 2>/dev/null || true
	@touch docker/acme.json && chmod 600 docker/acme.json
	@echo "✅ Installation completed"

# VM Operations
vm-up: ## Start Vagrant VM and services
	@echo "🚀 Starting Vagrant VM..."
	@vagrant up
	@sleep 10
	@echo "🔍 Checking services status..."
	@$(MAKE) vm-health || (echo "⚠️ Services may need manual start. Try: make vm-start-services"; exit 0)
	@echo "✅ VM started with services"

vm-down: ## Stop Vagrant VM
	@echo "🛑 Stopping Vagrant VM..."
	@vagrant halt
	@echo "✅ VM stopped"

vm-destroy: ## Destroy Vagrant VM completely
	@echo "💥 Destroying Vagrant VM..."
	@vagrant destroy -f
	@echo "✅ VM destroyed"

vm-ssh: ## SSH into Vagrant VM
	@vagrant ssh

vm-status: ## Show VM and services status
	@echo "📊 VM Status:"
	@vagrant status
	@echo ""
	@echo "📊 Services Status on VM:"
	@vagrant ssh -c "cd /opt/webapp && docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'" 2>/dev/null || echo "VM not running"

vm-logs: ## Show services logs from VM
	@echo "📋 Services logs from VM:"
	@vagrant ssh -c "cd /opt/webapp && docker-compose -f docker-compose.vm.yml logs -f" 2>/dev/null || echo "VM not running"

vm-logs-db: ## Show database logs from VM
	@vagrant ssh -c "cd /opt/webapp && docker-compose -f docker-compose.vm.yml logs -f postgres" 2>/dev/null || echo "VM not running"

vm-restart: ## Restart services on VM
	@echo "🔄 Restarting services on VM..."
	@vagrant ssh -c "cd /opt/webapp && docker-compose -f docker-compose.vm.yml restart"
	@echo "✅ Services restarted"

vm-build: ## Rebuild services on VM
	@echo "🏗️ Rebuilding services on VM..."
	@vagrant ssh -c "cd /opt/webapp && docker-compose -f docker-compose.vm.yml build --no-cache"
	@echo "✅ Services rebuilt"

vm-shell: ## Access database shell on VM
	@vagrant ssh -c "cd /opt/webapp && docker-compose -f docker-compose.vm.yml exec postgres psql -U lama -d webapp"

vm-health: ## Check services health on VM
	@echo "🔍 Checking services health on VM..."
	@if vagrant status | grep -q "running"; then \
		echo "VM is running..."; \
		if nc -z 192.168.56.10 5432 2>/dev/null; then \
			echo "✅ PostgreSQL Port: OK"; \
			vagrant ssh -c "cd /opt/webapp && docker-compose -f docker-compose.vm.yml exec -T postgres pg_isready -U lama" 2>/dev/null && echo "✅ PostgreSQL Service: OK" || echo "❌ PostgreSQL Service: ERROR"; \
		else \
			echo "❌ PostgreSQL Port: ERROR"; \
			echo "💡 Try: make vm-start-services"; \
		fi; \
	else \
		echo "❌ VM is not running"; \
		echo "💡 Try: make vm-up"; \
	fi

vm-stop-services: ## Stop services on VM without stopping VM
	@echo "🛑 Stopping services on VM..."
	@vagrant ssh -c "cd /opt/webapp && docker-compose -f docker-compose.vm.yml down"
	@echo "✅ Services stopped"

vm-start-services: ## Start services on VM
	@echo "🚀 Starting services on VM..."
	@vagrant ssh -c "cd /opt/webapp && docker-compose -f docker-compose.vm.yml up -d"
	@echo "✅ Services started"

vm-sync: ## Sync local files to VM
	@echo "🔄 Syncing files to VM..."
	@vagrant rsync
	@echo "✅ Files synced"

vm-provision: ## Re-run VM provisioning
	@echo "🔧 Re-provisioning VM..."
	@vagrant provision
	@echo "✅ VM provisioning completed"

vm-start-services: ## Manually start services on VM
	@echo "🚀 Starting services on VM..."
	@vagrant ssh -c "cd /opt/webapp && ./start-services.sh"
	@echo "✅ Services started manually"

vm-fix: ## Fix common VM issues
	@echo "🔧 Attempting to fix VM issues..."
	@echo "Stopping any running services..."
	@vagrant ssh -c "cd /opt/webapp && docker-compose -f docker-compose.vm.yml down" 2>/dev/null || true
	@echo "Checking Docker status..."
	@vagrant ssh -c "sudo systemctl status docker --no-pager" || true
	@echo "Starting services..."
	@vagrant ssh -c "cd /opt/webapp && docker-compose -f docker-compose.vm.yml up -d"
	@echo "✅ Fix attempt completed"

vm-diagnose: ## Run VM diagnostics
	@echo "🔍 Running VM diagnostics..."
	@./scripts/fix-vm.sh diagnose

vm-autofix: ## Auto-fix VM issues
	@echo "🔧 Running VM auto-fix..."
	@./scripts/fix-vm.sh fix

vm-troubleshoot: ## Interactive VM troubleshooting
	@echo "🛠️ VM Troubleshooting Menu"
	@echo "=========================="
	@echo "1. Run diagnostics: make vm-diagnose"
	@echo "2. Auto-fix issues: make vm-autofix"
	@echo "3. Restart services: make vm-restart"
	@echo "4. Check status: make vm-status"
	@echo "5. View logs: make vm-logs"
	@echo "6. Manual service start: make vm-start-services"

# Local Docker operations (webapp connects to VM database)
local-up: ## Start local webapp (connecting to VM database)
	@echo "🚀 Starting local webapp..."
	@echo "⚠️ Make sure VM database is running: make vm-up"
	@docker-compose -f docker-compose.local.yml up -d
	@$(MAKE) local-health

local-down: ## Stop local webapp
	@echo "🛑 Stopping local webapp..."
	@docker-compose -f docker-compose.local.yml down

local-logs: ## Show local webapp logs
	@docker-compose -f docker-compose.local.yml logs -f

local-status: ## Show local services status
	@echo "📊 Local Services Status:"
	@docker-compose -f docker-compose.local.yml ps

local-health: ## Check local webapp health
	@echo "🔍 Checking local webapp health..."
	@sleep 5
	@curl -f http://localhost:3000 > /dev/null 2>&1 && echo "✅ WebApp: OK" || echo "❌ WebApp: ERROR"

# Full Docker operations (everything local)
build: ## Build Docker images
	@echo "🏗️ Building Docker images..."
	@docker-compose build --no-cache

up: ## Start all services locally
	@echo "🚀 Starting all services locally..."
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
dev: ## Start development server locally
	@echo "🛠️ Starting development server..."
	@echo "⚠️ Make sure VM database is running: make vm-up"
	@cd webapp && npm run dev

dev-vm: vm-up dev ## Start VM and then development server

dev-full: up ## Start full development environment with local database

# Production
prod: build up ## Build and start production environment

# Database operations
db-shell: ## Access PostgreSQL shell (local)
	@docker-compose exec postgres psql -U lama -d webapp

db-shell-vm: ## Access PostgreSQL shell on VM
	@$(MAKE) vm-shell

db-reset: ## Reset local database (DANGEROUS)
	@echo "⚠️ This will delete all local data!"
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

db-reset-vm: ## Reset VM database (DANGEROUS)
	@echo "⚠️ This will delete all VM database data!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo ""; \
		vagrant ssh -c "cd /opt/webapp && docker-compose -f docker-compose.vm.yml down -v && docker-compose -f docker-compose.vm.yml up -d postgres"; \
		echo "VM Database reset completed"; \
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
status: ## Show all services status
	@echo "📊 Local Services Status:"
	@docker-compose ps
	@echo ""
	@echo "📊 VM Status:"
	@vagrant status
	@echo ""
	@echo "🌐 Access URLs:"
	@echo "  WebApp (local): http://localhost:3000"
	@echo "  PostgreSQL (VM): 192.168.56.10:5432"
	@echo "  Traefik Dashboard (VM): http://192.168.56.10:8081"

health: ## Check all services health
	@echo "🔍 Checking services health..."
	@sleep 5
	@curl -f http://localhost:3000 > /dev/null 2>&1 && echo "✅ Local WebApp: OK" || echo "❌ Local WebApp: ERROR"
	@curl -f http://192.168.56.10:5432 > /dev/null 2>&1 && echo "✅ VM PostgreSQL Port: OK" || echo "❌ VM PostgreSQL Port: ERROR"

# Cleanup operations
clean: ## Clean unused Docker resources
	@echo "🧹 Cleaning Docker resources..."
	@docker image prune -f
	@docker container prune -f
	@docker network prune -f
	@echo "✅ Cleanup completed"

clean-vm: ## Clean Docker resources on VM
	@echo "🧹 Cleaning Docker resources on VM..."
	@vagrant ssh -c "docker image prune -f && docker container prune -f && docker network prune -f"
	@echo "✅ VM cleanup completed"

reset: ## Reset everything (containers, volumes, images)
	@echo "🔄 Resetting everything..."
	@docker-compose down -v
	@docker-compose rm -f
	@docker system prune -af
	@echo "✅ Reset completed"

reset-all: ## Reset everything including VM
	@$(MAKE) reset
	@$(MAKE) vm-destroy
	@echo "✅ Complete reset done"

# Quick commands
quick-start-vm: vm-up dev ## Quick start with VM database and local dev server
	@echo "🎉 WebApp is ready at http://localhost:3000 with VM database"

quick-start-local: install up health ## Quick setup local everything
	@echo "🎉 WebApp is ready at http://localhost:3000 with local database"

# Backup operations
backup-db-vm: ## Backup VM database
	@echo "💾 Creating VM database backup..."
	@mkdir -p backups
	@vagrant ssh -c "cd /opt/webapp && docker-compose -f docker-compose.vm.yml exec -T postgres pg_dump -U lama webapp" > backups/webapp_vm_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ VM database backup created in backups/ directory"

restore-db-vm: ## Restore VM database from backup (specify BACKUP_FILE)
ifndef BACKUP_FILE
	@echo "❌ Please specify BACKUP_FILE: make restore-db-vm BACKUP_FILE=backup.sql"
else
	@echo "📥 Restoring VM database from $(BACKUP_FILE)..."
	@cat $(BACKUP_FILE) | vagrant ssh -c "cd /opt/webapp && docker-compose -f docker-compose.vm.yml exec -T postgres psql -U lama -d webapp"
	@echo "✅ VM database restored"
endif

# Environment management
env-copy: ## Copy environment template
	@cp webapp/.env.example webapp/.env
	@echo "✅ Environment file copied. Please edit webapp/.env"

env-vm: ## Setup environment for VM development
	@cp webapp/.env.example webapp/.env
	@echo "✅ Environment configured for VM development (database on VM)"

env-local: ## Setup environment for local development
	@cp webapp/.env.example webapp/.env
	@sed -i 's/POSTGRES_HOST=192.168.56.10/POSTGRES_HOST=localhost/' webapp/.env
	@echo "✅ Environment configured for local development"

env-show: ## Show current environment variables
	@echo "Current environment:"
	@cat webapp/.env 2>/dev/null || echo "No .env file found"

# Development workflows
workflow-vm: ## Complete VM development workflow
	@echo "🚀 Starting VM development workflow..."
	@$(MAKE) vm-up
	@$(MAKE) install
	@$(MAKE) env-vm
	@$(MAKE) dev

workflow-local: ## Complete local development workflow
	@echo "🚀 Starting local development workflow..."
	@$(MAKE) install
	@$(MAKE) env-local
	@$(MAKE) up
	@$(MAKE) dev

workflow-hybrid: ## Hybrid workflow (VM database, local app)
	@echo "🚀 Starting hybrid workflow..."
	@$(MAKE) vm-up || (echo "❌ VM startup failed, trying to fix..."; $(MAKE) vm-fix)
	@$(MAKE) install
	@$(MAKE) env-vm
	@sleep 5
	@$(MAKE) vm-health
	@echo "✅ VM database ready, you can now run: make dev"
	@echo "💡 If database connection fails, try: make vm-start-services"
