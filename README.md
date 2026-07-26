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
│   │   │   ├── document.controller.ts
│   │   │   └── health.controller.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── document.routes.ts
│   │   │   └── health.routes.ts
│   │   ├── schemas/
│   │   │   ├── auth.schema.ts
│   │   │   └── document.schema.ts
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
│   │   │   ├── DocumentEditorPage.tsx
│   │   │   ├── DocumentsPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── documents.ts
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

### Documents (Owner Access Enforced)
- `GET /api/documents` — Get documents owned by authenticated user (ordered by `updatedAt` desc)
- `POST /api/documents` — Create a new document (`title`)
- `GET /api/documents/:id` — Get document details by ID (owner only)
- `PATCH /api/documents/:id` — Update document title/content (owner only)
- `DELETE /api/documents/:id` — Delete document by ID (owner only)

## Frontend Routes

- `/` — Redirects to `/dashboard` if logged in, else `/login`
- `/login` — Login Page with validation & error handling
- `/register` — Registration Page with validation & error handling
- `/dashboard` — Protected Dashboard with total document statistics and top 5 recent documents
- `/documents` — Protected Documents List Page with creation, open, and deletion modal confirmation
- `/documents/:id` — Protected Document Editor Page with editable title, textarea content, manual saving, and back navigation

## Features

- **Authentication**: User Registration & Login with JWT & bcrypt (persisted via `localStorage` with `AuthContext` and `ProtectedRoute` wrappers)
- **Document Management**: Create, Rename, Delete, List owned documents with owner authorization
- **Document Sharing**: Invite users by email with roles (OWNER, EDITOR, VIEWER)
- **Access Control**: Enforced permissions on REST APIs and Socket.IO events
- **Realtime Editing**: Collaborative editing using Socket.IO room broadcast
- **Persistence & History**: Debounced PostgreSQL saves and edit event logging
