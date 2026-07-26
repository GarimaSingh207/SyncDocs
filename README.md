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
│   │   │   ├── health.controller.ts
│   │   │   └── sharing.controller.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── document.routes.ts
│   │   │   ├── health.routes.ts
│   │   │   └── sharing.routes.ts
│   │   ├── schemas/
│   │   │   ├── auth.schema.ts
│   │   │   ├── document.schema.ts
│   │   │   └── sharing.schema.ts
│   │   ├── socket/
│   │   │   ├── events.ts
│   │   │   └── index.ts
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
│   │   │   ├── AuthContext.tsx
│   │   │   └── SocketContext.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useSocket.ts
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── DocumentEditorPage.tsx
│   │   │   ├── DocumentsPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── documents.ts
│   │   │   ├── sharing.ts
│   │   │   └── socket.ts
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

### Documents & Authorization
- `GET /api/documents` — Get documents owned by authenticated user (ordered by `updatedAt` desc)
- `POST /api/documents` — Create a new document (`title`)
- `GET /api/documents/:id` — Get document details by ID (Accessible by `OWNER`, `EDITOR`, `VIEWER`)
- `PATCH /api/documents/:id` — Update document title/content (Accessible by `OWNER` & `EDITOR`, `403` for `VIEWER`)
- `DELETE /api/documents/:id` — Delete document by ID (`OWNER` only)

### Sharing & Collaborator Management (Owner Only)
- `GET /api/documents/shared` — Get documents shared with authenticated user
- `GET /api/documents/:id/access` — Get list of collaborators with access (`OWNER` only)
- `POST /api/documents/:id/share` — Share document with user by email & role (`EDITOR` / `VIEWER`)
- `PATCH /api/documents/:id/access/:accessId` — Update collaborator role (`EDITOR` / `VIEWER`)
- `DELETE /api/documents/:id/access/:accessId` — Revoke collaborator access

## Socket.IO Events & Realtime Architecture

### Socket Authentication
Every incoming socket connection must present a valid JWT token via `socket.handshake.auth.token`. Missing or invalid tokens result in connection rejection (`connect_error`).

### Realtime Events
- `join-document` — Sent by client with `{ documentId }`. Verifies document access (OWNER, EDITOR, VIEWER) before joining room `document:<documentId>`.
- `leave-document` — Sent by client with `{ documentId }`. Leaves room `document:<documentId>`.
- `room-users` — Broadcast by server to room `document:<documentId>` whenever active presence changes. Transmits active users list `[{ userId, name, role }]`.
- `document-update` — Emitted by `OWNER` or `EDITOR` with `{ documentId, title, content }`. Server broadcasts payload to all other room occupants (`socket.to(room).emit(...)`). Viewers attempting to emit receive an `error` event.
- `document-request-sync` — Emitted by newly joined clients to request current state.
- `document-sync` — Emitted by existing connected editors responding to a state sync request.
- `error` — Emitted to client when an unauthorized action or room join attempt is made.

## Auto-Save & Persistence Architecture
- **Debounced Save (800ms)**: Automatically persists changes to PostgreSQL after 800ms of user inactivity. Keystrokes reset the timer to prevent unnecessary REST requests.
- **Save Status Lifecycle**:
  - `saved`: `✓ Saved`
  - `saving`: `● Saving...`
  - `unsaved`: `● Unsaved`
  - `error`: `⚠ Save failed`
- **Remote Edit Isolation**: Incoming socket updates update in-memory state and baseline refs without scheduling REST auto-save calls.
- **Unmount Flush**: Pending unsaved edits are flushed immediately to the backend when navigating away or unmounting.

## Frontend Routes

- `/` — Redirects to `/dashboard` if logged in, else `/login`
- `/login` — Login Page with validation & error handling
- `/register` — Registration Page with validation & error handling
- `/dashboard` — Protected Dashboard with total document statistics and top 5 recent documents
- `/documents` — Protected Documents List Page featuring "My Documents" and "Shared With Me" sections
- `/documents/:id` — Protected Document Editor Page featuring debounced auto-save, save status lifecycle indicators, realtime collaborative synchronization, Last Write Wins (LWW) conflict handling, live connection indicator (`● Live`), and presence bar

## Features

- **Authentication**: User Registration & Login with JWT & bcrypt (persisted via `localStorage` with `AuthContext` and `ProtectedRoute` wrappers)
- **Document Management**: Create, Rename, Delete, List owned documents with owner authorization
- **Document Sharing**: Invite users by email with roles (`OWNER`, `EDITOR`, `VIEWER`), update roles, or revoke access
- **Access Control**: Enforced permissions on REST APIs (Owner = Full, Editor = Read/Edit, Viewer = Read Only)
- **Socket.IO Foundation**: Authenticated websockets, room isolation (`document:<id>`), and active user presence tracking
- **Realtime Editing**: Collaborative editing using Socket.IO room broadcast with Last Write Wins (LWW) resolution and infinite loop prevention
- **Debounced Auto-Save**: Seamless 800ms background persistence to PostgreSQL with unmount flushing and status indicators
