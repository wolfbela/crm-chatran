#!/bin/bash

# WebApp Setup Script
# This script automates the setup process for the webapp project

set -e  # Exit on any error

echo "🚀 WebApp Setup Script"
echo "======================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_error "This script should not be run as root"
        exit 1
    fi
}

# Check system requirements
check_requirements() {
    print_status "Checking system requirements..."

    # Check for Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    # Check for Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    # Check for Node.js (optional for local development)
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
    else
        print_warning "Node.js not found. You'll need it for local development."
    fi

    print_success "System requirements check completed"
}

# Setup environment files
setup_env() {
    print_status "Setting up environment files..."

    cd webapp

    if [ ! -f .env ]; then
        cp .env.example .env
        print_success "Created .env file from template"
    else
        print_warning ".env file already exists, skipping"
    fi

    cd ..
}

# Setup Docker permissions
setup_docker() {
    print_status "Setting up Docker permissions..."

    # Create acme.json with correct permissions
    touch docker/acme.json
    chmod 600 docker/acme.json

    # Add user to docker group if not already
    if ! groups $USER | grep &>/dev/null '\bdocker\b'; then
        print_warning "Adding user to docker group. You may need to log out and back in."
        sudo usermod -aG docker $USER
    fi

    print_success "Docker setup completed"
}

# Install Node.js dependencies
install_dependencies() {
    print_status "Installing Node.js dependencies..."

    cd webapp

    if [ -f package.json ]; then
        if command -v npm &> /dev/null; then
            npm install
            print_success "Dependencies installed successfully"
        else
            print_warning "npm not found. Dependencies will be installed in Docker container."
        fi
    fi

    cd ..
}

# Start services
start_services() {
    print_status "Starting Docker services..."

    # Pull images first
    docker-compose pull

    # Start PostgreSQL first
    docker-compose up -d postgres

    # Wait for PostgreSQL to be ready
    print_status "Waiting for PostgreSQL to be ready..."
    sleep 10

    # Start all services
    docker-compose up -d

    print_success "Services started successfully"
}

# Show service status
show_status() {
    print_status "Service Status:"
    echo ""
    docker-compose ps
    echo ""

    print_status "Services should be accessible at:"
    echo "🌐 WebApp: http://localhost:3000"
    echo "🗄️  PostgreSQL: localhost:5432"
    echo "🔧 Traefik Dashboard: http://localhost:8080"
    echo ""
}

# Health check
health_check() {
    print_status "Performing health check..."

    # Wait a bit for services to fully start
    sleep 15

    # Check if webapp is responding
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        print_success "WebApp is responding correctly"
    else
        print_warning "WebApp might not be ready yet. Check logs with: docker-compose logs -f webapp"
    fi

    # Check if PostgreSQL is accessible
    if docker-compose exec -T postgres pg_isready -U lama > /dev/null 2>&1; then
        print_success "PostgreSQL is ready"
    else
        print_warning "PostgreSQL might not be ready yet"
    fi
}

# Display help information
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --help, -h          Show this help message"
    echo "  --dev              Setup for development (install dependencies)"
    echo "  --prod             Setup for production (skip dev dependencies)"
    echo "  --no-start         Don't start services after setup"
    echo "  --reset            Reset all containers and volumes"
    echo ""
}

# Reset containers and volumes
reset_setup() {
    print_status "Resetting containers and volumes..."

    docker-compose down -v
    docker-compose rm -f
    docker system prune -f

    print_success "Reset completed"
}

# Main setup function
main() {
    local DEV_MODE=false
    local START_SERVICES=true
    local RESET=false

    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                show_help
                exit 0
                ;;
            --dev)
                DEV_MODE=true
                shift
                ;;
            --prod)
                DEV_MODE=false
                shift
                ;;
            --no-start)
                START_SERVICES=false
                shift
                ;;
            --reset)
                RESET=true
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done

    print_status "Starting WebApp setup..."
    echo ""

    check_root

    if [ "$RESET" = true ]; then
        reset_setup
        echo ""
    fi

    check_requirements
    setup_env
    setup_docker

    if [ "$DEV_MODE" = true ]; then
        install_dependencies
    fi

    if [ "$START_SERVICES" = true ]; then
        start_services
        show_status
        health_check

        echo ""
        print_success "🎉 Setup completed successfully!"
        echo ""
        print_status "Next steps:"
        echo "1. Visit http://localhost:3000 to see your application"
        echo "2. Check service logs: docker-compose logs -f"
        echo "3. For development: cd webapp && npm run dev"
        echo ""
        print_status "Useful commands:"
        echo "• Stop services: docker-compose down"
        echo "• View logs: docker-compose logs -f webapp"
        echo "• Restart services: docker-compose restart"
        echo "• Reset everything: ./setup.sh --reset"
    else
        print_success "Setup completed (services not started)"
        print_status "To start services: docker-compose up -d"
    fi
}

# Run main function with all arguments
main "$@"
