#!/usr/bin/env bash
# ==============================================================================
# Script: install-nginx.sh
# Description: Installs and configures Nginx Web Server & UFW firewall on Ubuntu
# ==============================================================================

set -euo pipefail

echo "==> Updating package lists..."
sudo apt-get update -y

echo "==> Installing Nginx web server..."
sudo apt-get install -y nginx ufw

echo "==> Configuring firewall (UFW) to allow SSH, HTTP, and HTTPS..."
# Allow SSH first to avoid locking out remote administrators
sudo ufw allow 22/tcp comment 'SSH Access'
sudo ufw allow 80/tcp comment 'HTTP Web Port'
sudo ufw allow 443/tcp comment 'HTTPS Secure Web Port'

# Enable firewall in non-interactive mode
echo "y" | sudo ufw enable || true

echo "==> Enabling and starting Nginx systemd service..."
sudo systemctl enable nginx
sudo systemctl restart nginx

echo "==> Verifying Nginx status..."
if systemctl is-active --quiet nginx; then
    echo "✓ Nginx is active and running!"
else
    echo "❌ Nginx failed to start. Please check systemctl status nginx."
    exit 1
fi

echo "==> Nginx installation complete!"
