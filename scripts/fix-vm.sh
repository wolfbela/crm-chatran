#!/bin/bash

# VM Troubleshooting and Fix Script
# This script helps diagnose and fix common VM issues

set -e

echo "🔧 VM Troubleshooting Script"
echo "============================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Check VM status
check_vm_status() {
    print_status "Checking VM status..."

    if vagrant status | grep -q "running"; then
        print_success "VM is running"
        return 0
    else
        print_error "VM is not running"
        return 1
    fi
}

# Check Docker status in VM
check_docker_status() {
    print_status "Checking Docker status in VM..."

    if vagrant ssh -c "sudo systemctl is-active docker" | grep -q "active"; then
        print_success "Docker is running in VM"
        return 0
    else
        print_error "Docker is not running in VM"
        return 1
    fi
}

# Check if services are running
check_services() {
    print_status "Checking services status..."

    vagrant ssh -c "cd /opt/webapp && docker ps --format 'table {{.Names}}\t{{.Status}}'"
}

# Fix Docker permission issues
fix_docker_permissions() {
    print_status "Fixing Docker permissions..."

    vagrant ssh -c "sudo usermod -aG docker vagrant"
    vagrant ssh -c "sudo systemctl restart docker"

    print_success "Docker permissions fixed"
}

# Start services
start_services() {
    print_status "Starting services..."

    vagrant ssh -c "cd /opt/webapp && docker-compose -f docker-compose.vm.yml down" || true
    sleep 2
    vagrant ssh -c "cd /opt/webapp && docker-compose -f docker-compose.vm.yml up -d"

    print_success "Services started"
}

# Test database connection
test_database() {
    print_status "Testing database connection..."

    sleep 5

    if nc -z 192.168.56.10 5432; then
        print_success "Database port is accessible"

        # Test actual connection if psql is available
        if command -v psql &> /dev/null; then
            if PGPASSWORD=JaimeLesChevaux psql -h 192.168.56.10 -U lama -d webapp -c "SELECT 1;" &> /dev/null; then
                print_success "Database connection successful"
            else
                print_warning "Database port open but connection failed"
            fi
        fi
    else
        print_error "Cannot connect to database"
        return 1
    fi
}

# Full diagnostic
run_diagnostics() {
    echo ""
    print_status "=== RUNNING FULL DIAGNOSTICS ==="
    echo ""

    # Check VM
    if ! check_vm_status; then
        print_error "VM is not running. Start with: vagrant up"
        return 1
    fi

    # Check Docker
    if ! check_docker_status; then
        print_warning "Docker issue detected, attempting fix..."
        fix_docker_permissions
    fi

    # Check services
    echo ""
    print_status "Current services:"
    check_services
    echo ""

    # Test network connectivity
    print_status "Testing network connectivity..."
    if ping -c 1 192.168.56.10 &> /dev/null; then
        print_success "VM network is accessible"
    else
        print_error "Cannot reach VM network"
    fi

    # Test database
    if ! test_database; then
        print_warning "Database connection failed"
        return 1
    fi

    print_success "All diagnostics passed!"
}

# Auto-fix common issues
auto_fix() {
    echo ""
    print_status "=== ATTEMPTING AUTO-FIX ==="
    echo ""

    # Ensure VM is running
    if ! check_vm_status; then
        print_status "Starting VM..."
        vagrant up
        sleep 10
    fi

    # Fix Docker permissions
    fix_docker_permissions

    # Restart services
    start_services

    # Test everything
    echo ""
    if run_diagnostics; then
        print_success "🎉 Auto-fix completed successfully!"
    else
        print_error "Auto-fix failed. Manual intervention may be required."
        return 1
    fi
}

# Show help
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  diagnose    Run full diagnostics"
    echo "  fix         Attempt auto-fix of common issues"
    echo "  restart     Restart all services"
    echo "  status      Show current status"
    echo "  help        Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 diagnose    # Check all systems"
    echo "  $0 fix         # Auto-fix issues"
    echo "  $0 restart     # Restart services"
}

# Main function
main() {
    local command=${1:-diagnose}

    case $command in
        diagnose)
            run_diagnostics
            ;;
        fix)
            auto_fix
            ;;
        restart)
            start_services
            sleep 5
            test_database
            ;;
        status)
            check_vm_status
            check_docker_status
            check_services
            test_database
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

# Handle Ctrl+C
trap 'echo -e "\n${YELLOW}[INFO]${NC} Script interrupted"; exit 0' INT

# Run main function
main "$@"
