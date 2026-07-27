#!/usr/bin/env bash
# ==============================================================================
# Script: setup-ec2.sh
# Description: Master EC2 Bootstrap script for AWS Free Tier (Ubuntu 22.04 / 24.04)
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "======================================================================"
echo "          SyncDocs AWS EC2 Master Environment Setup Script            "
echo "======================================================================"

# 1. System Updates
echo "==> Step 1: Performing system packages update & upgrade..."
sudo apt-get update -y
sudo apt-get upgrade -y

# 2. Swap Memory Creation (CRITICAL FOR AWS FREE TIER 1GB RAM EC2)
echo "==> Step 2: Checking swap memory..."
if [ "$(swapon --show | wc -l)" -le 1 ]; then
    echo "Creating 2GB swap space to prevent Out-Of-Memory during builds..."
    sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "✓ 2GB Swap created successfully!"
else
    echo "✓ Swap space already exists."
fi

# 3. Make component scripts executable
chmod +x "${SCRIPT_DIR}/install-node.sh"
chmod +x "${SCRIPT_DIR}/install-nginx.sh"
chmod +x "${SCRIPT_DIR}/install-pm2.sh"

# 4. Execute component scripts
echo "==> Step 3: Running Node.js installer..."
"${SCRIPT_DIR}/install-node.sh"

echo "==> Step 4: Running Nginx installer..."
"${SCRIPT_DIR}/install-nginx.sh"

echo "==> Step 5: Running PM2 installer..."
"${SCRIPT_DIR}/install-pm2.sh"

# 5. Create logging and application deployment workspace directory structure
echo "==> Step 6: Setting up logging directories..."
mkdir -p "$HOME/logs"

echo "======================================================================"
echo " ✓ Master EC2 Environment Setup Completed Successfully!               "
echo "======================================================================"
echo "Next Steps:"
echo " 1. Clone repository to EC2 instance"
echo " 2. Configure backend/.env and frontend/.env build settings"
echo " 3. Run Prisma migrations ('npx prisma migrate deploy')"
echo " 4. Build application & launch PM2 process ('pm2 start deployment/pm2-ecosystem.config.js')"
echo " 5. Deploy Nginx config ('sudo cp deployment/nginx-syncdocs.conf /etc/nginx/sites-available/')"
echo "======================================================================"
