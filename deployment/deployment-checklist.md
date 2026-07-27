# AWS Free Tier Production Deployment Checklist for SyncDocs

This checklist guides AWS DevOps engineers through deploying **SyncDocs** on **AWS Free Tier** infrastructure (EC2 `t2.micro` / `t3.micro` + RDS PostgreSQL `db.t3.micro` or EC2 local PostgreSQL).

---

## 1. Environment & Variable Documentation

### Backend Environment Variables (`backend/.env`)

| Variable Name | Required | Default / Example | Purpose |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Yes | `production` | Sets Node execution mode; disables test hooks & enables production optimizations. |
| `PORT` | Yes | `5000` | Port on which Express & Socket.IO HTTP server listens locally. |
| `DATABASE_URL` | Yes | `postgresql://user:pass@rds-endpoint:5432/syncdocs?schema=public&connection_limit=10&sslmode=prefer` | PostgreSQL connection string used by Prisma ORM. |
| `JWT_SECRET` | Yes | `64-char-random-hex-string` | Secret key used to sign and verify JWT authentication tokens. |

### Frontend Environment Variables (`frontend/.env`)

| Variable Name | Required | Default / Example | Purpose |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Yes | `http://<EC2_PUBLIC_IP_OR_DOMAIN>/api` | Base URL used by Axios API client and Socket.IO connection client. |

---

## 2. Infrastructure Prerequisites Checklist

- [ ] **AWS EC2 Instance Launched**:
  - AMI: Ubuntu 22.04 LTS or 24.04 LTS (64-bit x86).
  - Instance Type: `t2.micro` or `t3.micro` (AWS Free Tier eligible).
  - Storage: 8 GB or 20 GB gp3 EBS Volume.
- [ ] **AWS EC2 Security Group Configured**:
  - Inbound Rule 1: SSH (Port `22`) -> `My IP` or restricted admin range.
  - Inbound Rule 2: HTTP (Port `80`) -> `0.0.0.0/0`.
  - Inbound Rule 3: HTTPS (Port `443`) -> `0.0.0.0/0`.
- [ ] **AWS RDS PostgreSQL (Optional if using RDS)**:
  - DB Engine: PostgreSQL 15 or 16.
  - Instance Class: `db.t3.micro` (Free Tier).
  - Security Group: Allow Inbound TCP Port `5432` from EC2 Security Group ID (`sg-xxxxxx`).

---

## 3. Server Initialization (SSH into EC2)

```bash
# 1. SSH into EC2 instance
ssh -i /path/to/your-key.pem ubuntu@<EC2_PUBLIC_IP>

# 2. Clone repository into /var/www/syncdocs
sudo mkdir -p /var/www/syncdocs
sudo chown -R ubuntu:ubuntu /var/www/syncdocs
cd /var/www
git clone https://github.com/your-username/SyncDocs.git syncdocs
cd /var/www/syncdocs

# 3. Make deployment scripts executable and run master EC2 bootstrap
chmod +x deployment/*.sh
./deployment/setup-ec2.sh
```

---

## 4. Backend Deployment Sequence

- [ ] **Configure Backend Environment File**:
  ```bash
  cd /var/www/syncdocs/backend
  cp .env.production.example .env
  nano .env
  # Update DATABASE_URL and JWT_SECRET
  ```

- [ ] **Install Dependencies & Generate Prisma Client**:
  ```bash
  npm ci
  npx prisma generate
  ```

- [ ] **Execute Database Migrations**:
  ```bash
  npx prisma migrate deploy
  ```

- [ ] **Compile Backend TypeScript**:
  ```bash
  npm run build
  ```

- [ ] **Launch Backend with PM2 Process Manager**:
  ```bash
  cd /var/www/syncdocs
  pm2 start deployment/pm2-ecosystem.config.js --env production
  pm2 save
  ```

---

## 5. Frontend Deployment Sequence

- [ ] **Configure Frontend Environment File**:
  ```bash
  cd /var/www/syncdocs/frontend
  cp .env.production.example .env
  nano .env
  # Set VITE_API_URL=http://<YOUR_EC2_PUBLIC_IP_OR_DOMAIN>/api
  ```

- [ ] **Install Frontend Dependencies & Build Static Assets**:
  ```bash
  npm ci
  npm run build
  # Generates static assets in /var/www/syncdocs/frontend/dist
  ```

---

## 6. Nginx & Reverse Proxy Deployment

- [ ] **Deploy Nginx Configuration**:
  ```bash
  sudo cp /var/www/syncdocs/deployment/nginx-syncdocs.conf /etc/nginx/sites-available/syncdocs.conf
  sudo ln -sf /etc/nginx/sites-available/syncdocs.conf /etc/nginx/sites-enabled/default
  ```

- [ ] **Test Nginx Syntax & Reload Service**:
  ```bash
  sudo nginx -t
  sudo systemctl reload nginx
  ```

---

## 7. SSL Certificate Setup (Let's Encrypt - Optional for Domain)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d syncdocs.yourdomain.com
```

---

## 8. Post-Deployment Verification Checklist

- [ ] **REST Health Check**:
  - Navigate to `http://<EC2_PUBLIC_IP>/api/health` -> Expect HTTP 200 `{"status":"ok"}`.
- [ ] **Authentication & User Registration**:
  - Test Register & Login flows on frontend UI (`http://<EC2_PUBLIC_IP>`).
  - Verify JWT token stored in `localStorage`.
- [ ] **Document Creation & CRUD**:
  - Create a new document, rename title, update body content.
  - Verify debounced auto-save triggers (`✓ Saved`).
- [ ] **Socket.IO Real-Time WebSockets Verification**:
  - Open document in two separate browser windows (or incognito).
  - Verify active room user presence indicator (`room-users` event).
  - Verify live keystrokes broadcast between peers.
- [ ] **Audit History Drawer Verification**:
  - Inspect document history timeline drawer to ensure `EditEvent` entries are written to PostgreSQL.
- [ ] **PM2 Monitoring & Logs Check**:
  ```bash
  pm2 status
  pm2 logs syncdocs-backend --lines 50
  ```
