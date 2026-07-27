#!/usr/bin/env bash
# ==============================================================================
# Script: install-node.sh
# Description: Installs Node.js LTS (v20.x) and essential build tools on Ubuntu
# ==============================================================================

set -euo pipefail

echo "==> Updating package lists..."
sudo apt-get update -y

echo "==> Installing prerequisite tools (curl, ca-certificates, gnupg, build-essential)..."
sudo apt-get install -y curl ca-certificates gnupg build-essential

echo "==> Setting up NodeSource repository for Node.js 20.x LTS..."
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg --yes

NODE_MAJOR=20
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list > /dev/null

echo "==> Installing Node.js & npm..."
sudo apt-get update -y
sudo apt-get install -y nodejs

echo "==> Verifying Node.js and npm installations..."
node_ver=$(node -v)
npm_ver=$(npm -v)

echo "✓ Node.js version: ${node_ver}"
echo "✓ npm version:     ${npm_ver}"

echo "==> Node.js installation complete!"
