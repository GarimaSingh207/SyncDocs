# Prisma ORM Production Guide for SyncDocs

This document provides definitive guidance for configuring, migrating, and optimizing **Prisma ORM** in a production environment on AWS (EC2 & RDS PostgreSQL).

---

## 1. Schema Migration Strategy: `db push` vs `migrate deploy`

| Environment | Command | Purpose & Behavior |
| :--- | :--- | :--- |
| **Development** | `npx prisma db push` | Directly syncs `schema.prisma` structure with target database without creating migration history files. Suitable for rapid local prototyping. |
| **Production** | `npx prisma migrate deploy` | **MANDATORY FOR PRODUCTION.** Applies all pending SQL migration files stored in `prisma/migrations` in strict sequential order. Safe for existing user data. |

### Development vs Production Migration Workflow
1. When making schema changes in development:
   ```bash
   npx prisma migrate dev --name <migration_description>
   ```
   This generates a new migration directory in `prisma/migrations/` containing standard SQL.
2. Commit the `prisma/migrations` directory to Git repository.
3. On the production server during deployment:
   ```bash
   npx prisma migrate deploy
   ```

---

## 2. Production Connection String Setup

The `DATABASE_URL` environment variable must be supplied in `backend/.env`.

### RDS PostgreSQL / Managed PostgreSQL Connection String
```env
DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@<RDS_ENDPOINT>:5432/<DB_NAME>?schema=public&connection_limit=10&sslmode=prefer"
```

### Key Query Parameters for Production:
- `connection_limit=10`: Restricts Prisma Client pool size per process. Crucial for AWS RDS Free Tier (`db.t3.micro` / `db.t4g.micro`), which has hardware RAM limits (~1GB RAM) and limited max connection limits.
- `schema=public`: Explicitly targets the default PostgreSQL public schema.
- `sslmode=prefer` or `sslmode=require`: Enforces SSL encryption for network transit between EC2 backend and RDS database.

---

## 3. Build & Runtime Steps for Backend

In production deployment, the Prisma Client code generator must be executed prior to compiling TypeScript into JavaScript.

### Required Deployment Commands Sequence:

```bash
cd backend

# 1. Install production & dev dependencies
npm ci

# 2. Generate Prisma Client TypeScript definitions
npx prisma generate

# 3. Apply standard migrations to database
npx prisma migrate deploy

# 4. Compile TypeScript source code to JS (dist/ directory)
npm run build
```

---

## 4. Connection Pooling & AWS Free Tier Optimization

On AWS Free Tier (`db.t3.micro` RDS or EC2 PostgreSQL):
1. **Singleton Client**: SyncDocs uses a singleton pattern in `src/lib/prisma.ts` to instantiate a single `PrismaClient` instance per Node process, preventing connection leakage.
2. **PM2 Scaling Notice**: Since PM2 runs 1 instance in Free Tier (`instances: 1`), standard connection pooling with `connection_limit=10` is optimal. If scaling to multiple instances, use AWS RDS Proxy or PgBouncer to manage connection spikes.

---

## 5. Troubleshooting & Health Verification

- **Verify Database Connectivity**:
  ```bash
  npx prisma status
  ```
- **Inspect Applied Migrations**:
  Check applied migrations directly against your production database using Prisma Studio (bound to localhost):
  ```bash
  npx prisma studio --port 5555
  ```
- **Error P1001 (Cannot reach database server)**:
  Ensure AWS RDS Security Group inbound rule allows TCP traffic on port `5432` from the EC2 Security Group ID.
