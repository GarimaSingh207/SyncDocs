#!/usr/bin/env bash
# ==============================================================================
# Script: install-pm2.sh
# Description: Installs PM2 process manager, sets up systemd startup & log rotation
# ==============================================================================

set -euo pipefail

echo "==> Installing PM2 process manager globally..."
sudo npm install -g pm2

echo "==> Configuring PM2 startup hooks for systemd..."
# Generate systemd startup command and run it automatically
sudo pm2 startup systemd -u "$USER" --hp "$HOME" || pm2 startup systemd || true

echo "==> Installing PM2 logrotate module to prevent disk space exhaustion..."
pm2 install pm2-logrotate || true

echo "==> Configuring logrotate settings..."
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true

echo "==> Verifying PM2 installation..."
pm2_ver=$(pm2 -v)
echo "✓ PM2 version: ${pm2_ver}"

echo "==> PM2 installation complete!"
