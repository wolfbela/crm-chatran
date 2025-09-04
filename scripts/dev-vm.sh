#!/bin/bash

# VM Development Workflow Script
# This script automates the development workflow with VM database

set -e  # Exit on any error

echo "🚀 VM Development Workflow"
echo "========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if VM is running
check_vm_status() {
    print_status "Checking VM status..."
    if vagrant status | grep -q "running"; then
        print_success "VM is running"
        return 0
    else
        print_warning "VM is not running"
        return 1
    fi
}

# Start VM and services
start_vm() {
    print_status "Starting Vagrant VM..."
    vagrant up

    # Wait for services to be ready
    print_status "Waiting for services to start..."
    sleep 15

    # Check if database is accessible
    local retries=5
    while [ $retries -gt 0 ]; do
        if nc -z 192.168.56.10 5432 2>/dev/null; then
            print_success "Database is accessible"
            return 0
        fi
        print_status "Waiting for database... ($retries retries left)"
        sleep 5
        ((retries--))
    done

    print_error "Database is not accessible after multiple retries"
    return 1
}

# Setup local environment
setup_local_env() {
    print_status "Setting up local environment..."

    # Install dependencies if needed
    if [ ! -d "webapp/node_modules" ]; then
        print_status "Installing Node.js dependencies..."
        cd webapp
        npm install
        cd ..
    fi

    # Setup environment file for VM
    if [ ! -f "webapp/.env" ]; then
        print_status "Creating environment file for VM..."
        cp webapp/.env.example webapp/.env
    else
        # Ensure POSTGRES_HOST points to VM
        sed -i 's/POSTGRES_HOST=.*/POSTGRES_HOST=192.168.56.10/' webapp/.env
    fi

    print_success "Local environment setup complete"
}

# Test database connection
test_db_connection() {
    print_status "Testing database connection..."

    if nc -z 192.168.56.10 5432; then
        print_success "Database port is accessible"
    else
        print_error "Cannot connect to database on VM"
        return 1
    fi

    # Try to connect with psql if available
    if command -v psql &> /dev/null; then
        if PGPASSWORD=JaimeLesChevaux psql -h 192.168.56.10 -U lama -d webapp -c "SELECT 1;" &> /dev/null; then
            print_success "Database connection test successful"
        else
            print_warning "Database port accessible but connection test failed"
        fi
    else
        print_warning "psql not available for connection test"
    fi
}

# Show service status
show_status() {
    echo ""
    print_status "=== SERVICE STATUS ==="

    # VM status
    echo "VM Status:"
    vagrant status

    echo ""
    echo "Services on VM:"
    vagrant ssh -c "cd /opt/webapp && docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'" 2>/dev/null || echo "Cannot get VM service status"

    echo ""
    echo "🌐 Access URLs:"
    echo "  • Database: 192.168.56.10:5432"
    echo "  • Traefik Dashboard: http://192.168.56.10:8081"
    echo "  • Development Server: http://localhost:3000 (when running)"

    echo ""
    print_status "Ready to start development!"
    echo "Run: make dev (or cd webapp && npm run dev)"
}

# Start development server
start_dev_server() {
    print_status "Starting development server..."
    print_warning "Press Ctrl+C to stop the development server"
    echo ""

    cd webapp
    npm run dev
}

# Main workflow
main() {
    local START_DEV=false
    local FORCE_RESTART=false

    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dev|-d)
                START_DEV=true
                shift
                ;;
            --restart|-r)
                FORCE_RESTART=true
                shift
                ;;
            --help|-h)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --dev, -d       Start development server after setup"
                echo "  --restart, -r   Force restart VM services"
                echo "  --help, -h      Show this help message"
                echo ""
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done

    echo ""

    # Check if VM is running or start it
    if ! check_vm_status || [ "$FORCE_RESTART" = true ]; then
        if [ "$FORCE_RESTART" = true ]; then
            print_status "Force restarting VM services..."
            vagrant ssh -c "cd /opt/webapp && docker-compose -f docker-compose.vm.yml down" 2>/dev/null || true
        fi

        if ! start_vm; then
            print_error "Failed to start VM or services"
            exit 1
        fi
    fi

    # Setup local environment
    setup_local_env

    # Test database connection
    if ! test_db_connection; then
        print_error "Database connection failed"
        print_status "Try: make vm-restart or make vm-logs"
        exit 1
    fi

    # Show status
    show_status

    # Start development server if requested
    if [ "$START_DEV" = true ]; then
        echo ""
        print_status "Starting development workflow..."
        sleep 2
        start_dev_server
    else
        echo ""
        print_success "🎉 VM development environment is ready!"
        echo ""
        print_status "Next steps:"
        echo "1. Run: make dev"
        echo "2. Or: cd webapp && npm run dev"
        echo "3. Visit: http://localhost:3000"
        echo ""
        print_status "Useful commands:"
        echo "• VM status: make vm-status"
        echo "• VM logs: make vm-logs"
        echo "• Restart services: make vm-restart"
    fi
}

# Handle Ctrl+C gracefully
trap 'echo -e "\n\n${YELLOW}[INFO]${NC} Development workflow interrupted"; exit 0' INT

# Run main function with all arguments
main "$@"
