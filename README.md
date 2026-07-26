# SyncDocs

A real-time collaborative document editing platform built with Node.js, Express, PostgreSQL, Prisma, Socket.IO, and React.

## Project Structure

```
SyncDocs/
├── backend/          # Express API & Socket.IO server
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   └── health.controller.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   └── health.routes.ts
│   │   ├── schemas/
│   │   │   └── auth.schema.ts
│   │   ├── lib/
│   │   │   └── prisma.ts
│   │   ├── app.ts
│   │   └── index.ts
│   └── .env.example
├── frontend/         # React SPA frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── auth.ts
│   │   └── types/
│   │       └── index.ts
│   └── .env.example
└── README.md
```

## Database Schema (PostgreSQL + Prisma)

- **User**: `id`, `name`, `email` (unique), `password`, `createdAt`
- **Document**: `id`, `ownerId`, `title`, `content`, `createdAt`, `updatedAt`
- **DocumentAccess**: `id`, `documentId`, `userId`, `role` (`OWNER`, `EDITOR`, `VIEWER`)
- **EditEvent**: `id`, `documentId`, `userId`, `changeSummary`, `createdAt`

## API Endpoints

### Health Check
- `GET /api/health` — Returns status of backend server

### Authentication
- `POST /api/auth/register` — Register a new user (`name`, `email`, `password`)
- `POST /api/auth/login` — Authenticate user and receive JWT token (`email`, `password`)
- `GET /api/profile` — Get authenticated user profile (`Authorization: Bearer <token>`)

## Frontend Routes

- `/` — Redirects to `/dashboard` if logged in, else `/login`
- `/login` — Login Page with validation & error handling
- `/register` — Registration Page with validation & error handling
- `/dashboard` — Protected Dashboard showing authenticated user profile details
- `/documents` — Protected Documents List Page placeholder
- `/documents/:id` — Protected Document Editor Page placeholder

## Features

- **Authentication**: User Registration & Login with JWT & bcrypt (persisted via `localStorage` with `AuthContext` and `ProtectedRoute` wrappers)
- **Document Management**: Create, Rename, Delete, List owned and shared documents
- **Document Sharing**: Invite users by email with roles (OWNER, EDITOR, VIEWER)
- **Access Control**: Enforced permissions on REST APIs and Socket.IO events
- **Realtime Editing**: Collaborative editing using Socket.IO room broadcast
- **Persistence & History**: Debounced PostgreSQL saves and edit event logging
