# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "debian/bookworm64"
  config.vm.hostname = "webapp-dev"

  # Network configuration
  config.vm.network "private_network", ip: "192.168.56.10"
  config.vm.network "forwarded_port", guest: 80, host: 8080
  config.vm.network "forwarded_port", guest: 443, host: 8443
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 5432, host: 5432
  config.vm.network "forwarded_port", guest: 8081, host: 8081

  # Shared folders
  config.vm.synced_folder ".", "/opt/webapp", type: "rsync"

  # Initial provisioning script
  config.vm.provision "shell", inline: <<-SHELL
    # Update system
    apt-get update
    apt-get upgrade -y

    # Install essential packages
    apt-get install -y curl wget git vim htop tree unzip make netcat-openbsd

    # Install Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker vagrant

    # Install Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose

    # Install Node.js (for local development)
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs

    # Create webapp directory and set permissions
    mkdir -p /opt/webapp
    chown -R vagrant:vagrant /opt/webapp

    # Add useful aliases
    echo 'alias ll="ls -la"' >> /home/vagrant/.bashrc
    echo 'alias dc="docker-compose"' >> /home/vagrant/.bashrc
    echo 'alias dps="docker ps"' >> /home/vagrant/.bashrc
    echo 'alias webapp="cd /opt/webapp"' >> /home/vagrant/.bashrc

    # Set timezone
    timedatectl set-timezone UTC

    echo "==================================="
    echo "Base system setup completed!"
    echo "VM IP: 192.168.56.10"
    echo "==================================="
  SHELL

  # Setup environment and Docker permissions
  config.vm.provision "shell", inline: <<-SHELL
    # Wait for shared folder to be properly mounted
    sleep 5

    cd /opt/webapp

    # Setup environment files
    if [ -f webapp/.env.example ] && [ ! -f webapp/.env ]; then
      cp webapp/.env.example webapp/.env
      # Update POSTGRES_HOST to VM IP
      sed -i 's/POSTGRES_HOST=localhost/POSTGRES_HOST=192.168.56.10/' webapp/.env
      chown vagrant:vagrant webapp/.env
    fi

    # Setup Docker permissions
    mkdir -p docker
    touch docker/acme.json
    chmod 600 docker/acme.json
    chown vagrant:vagrant docker/acme.json

    echo "Environment setup completed!"
  SHELL

  # Start services after everything is ready
  config.vm.provision "shell", run: "always", inline: <<-SHELL
    # Ensure vagrant user is in docker group
    usermod -aG docker vagrant

    # Wait for Docker to be fully ready
    sleep 10

    cd /opt/webapp

    # Check if docker-compose.vm.yml exists
    if [ -f docker-compose.vm.yml ]; then
      echo "Starting webapp services..."

      # Make sure any existing containers are stopped
      sudo -u vagrant docker-compose -f docker-compose.vm.yml down 2>/dev/null || true

      # Start services as vagrant user
      sudo -u vagrant docker-compose -f docker-compose.vm.yml up -d

      # Wait for services to be ready
      sleep 15

      # Show status
      echo "==================================="
      echo "Services Status:"
      sudo -u vagrant docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
      echo "==================================="
      echo "✅ Services started successfully!"
    else
      echo "⚠️ docker-compose.vm.yml not found, services not started"
    fi

    # Test database connection
    if nc -z localhost 5432; then
      echo "✅ PostgreSQL is accessible"
    else
      echo "❌ PostgreSQL connection failed"
    fi
  SHELL

  # Create startup script for manual service management
  config.vm.provision "shell", inline: <<-SHELL
    cat > /home/vagrant/start-services.sh << 'EOF'
#!/bin/bash
cd /opt/webapp
echo "🚀 Starting webapp services..."
docker-compose -f docker-compose.vm.yml up -d
echo "✅ Services started!"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
EOF

    cat > /home/vagrant/stop-services.sh << 'EOF'
#!/bin/bash
cd /opt/webapp
echo "🛑 Stopping webapp services..."
docker-compose -f docker-compose.vm.yml down
echo "✅ Services stopped!"
EOF

    cat > /home/vagrant/status-services.sh << 'EOF'
#!/bin/bash
cd /opt/webapp
echo "📊 Services Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "🌐 Access URLs:"
echo "  • Database: 192.168.56.10:5432"
echo "  • Traefik Dashboard: http://192.168.56.10:8081"
EOF

    chmod +x /home/vagrant/*.sh
    chown vagrant:vagrant /home/vagrant/*.sh

    echo "Service management scripts created in /home/vagrant/"
  SHELL

  # Message after provisioning
  config.vm.post_up_message = <<-MESSAGE
    WebApp Development Environment Ready!

    VM IP: 192.168.56.10

    Port forwards:
    - HTTP: localhost:8080 -> VM:80
    - HTTPS: localhost:8443 -> VM:443
    - Next.js dev: localhost:3000 -> VM:3000
    - PostgreSQL: localhost:5432 -> VM:5432
    - Traefik dashboard: localhost:8081 -> VM:8081

    Connect with: vagrant ssh

    Service management:
    - Start: ~/start-services.sh
    - Stop: ~/stop-services.sh
    - Status: ~/status-services.sh

    Or use Make commands from host:
    - make vm-status
    - make vm-logs
    - make vm-restart
  MESSAGE
end
