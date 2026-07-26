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
│   │   ├── routes/
│   │   ├── lib/
│   │   │   └── prisma.ts
│   │   ├── app.ts
│   │   └── index.ts
│   └── .env.example
├── frontend/         # React SPA frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── assets/
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

## Frontend Routes

- `/` — Redirects to `/login`
- `/login` — Login Page placeholder
- `/register` — Register Page placeholder
- `/dashboard` — Dashboard Page placeholder
- `/documents` — Documents List Page placeholder
- `/documents/:id` — Document Editor Page placeholder

## Features

- **Authentication**: User Registration & Login with JWT & bcrypt
- **Document Management**: Create, Rename, Delete, List owned and shared documents
- **Document Sharing**: Invite users by email with roles (OWNER, EDITOR, VIEWER)
- **Access Control**: Enforced permissions on REST APIs and Socket.IO events
- **Realtime Editing**: Collaborative editing using Socket.IO room broadcast
- **Persistence & History**: Debounced PostgreSQL saves and edit event logging
