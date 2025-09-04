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

  # VM resources
  config.vm.provider "virtualbox" do |vb|
    vb.name = "webapp-development"
    vb.memory = "4096"
    vb.cpus = 2
    vb.gui = false
  end

  # Shared folders
  config.vm.synced_folder ".", "/opt/webapp", type: "virtualbox"

  # Provisioning script
  config.vm.provision "shell", inline: <<-SHELL
    # Update system
    apt-get update
    apt-get upgrade -y

    # Install essential packages
    apt-get install -y curl wget git vim htop tree unzip

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

    # Set timezone
    timedatectl set-timezone UTC

    echo "==================================="
    echo "Development environment ready!"
    echo "Access the VM with: vagrant ssh"
    echo "Navigate to project: cd /opt/webapp"
    echo "Start services: docker-compose up -d"
    echo "==================================="
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

    Connect with: vagrant ssh
    Project location: /opt/webapp
  MESSAGE
end
