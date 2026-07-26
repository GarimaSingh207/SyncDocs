# SyncDocs — Real-Time Collaborative Document Editing Platform

SyncDocs is a production-ready, full-stack real-time collaborative document editing platform designed to showcase core backend architecture, state synchronization, role-based security, and reactive frontend engineering.

Built with **TypeScript**, **Node.js**, **Express**, **PostgreSQL**, **Prisma ORM**, **Socket.IO**, and **React (Vite)**.

---

## 🌟 Key Features

### 🔐 Authentication & Authorization
- **JWT & bcrypt Security**: Password hashing with 10 salt rounds and 24-hour signed JWT tokens.
- **Protected Routing**: React Router context wrappers ensuring unauthorized visitors are directed to login.
- **Fine-Grained Role-Based Access Control (RBAC)**:
  - **OWNER**: Full CRUD, sharing management, collaborator role modification, document deletion.
  - **EDITOR**: Read and edit document title and content; cannot manage collaborators or delete documents.
  - **VIEWER**: Read-only access; UI inputs disabled, REST persistence blocked (`403 Forbidden`), socket update events rejected.

### 📄 Document Management & Sharing
- **Document CRUD**: Create, rename, delete, and list owned documents.
- **Collaborator Management**: Invite team members by email with specific roles (`EDITOR` / `VIEWER`), change roles dynamically, or revoke access.
- **Filtered Workspaces**: Dedicated "My Documents" and "Shared With Me" dashboard sections.

### ⚡ Real-Time Collaboration & Presence
- **Socket.IO Integration**: Shared HTTP server running on port 5000 with Express.
- **Socket JWT Authentication**: Websockets validate token payloads on handshake (`connection_error` for invalid/missing tokens).
- **Document Room Isolation**: Isolated rooms (`document:<id>`) enforcing access validation before allowing room subscription.
- **Live Active Presence**: Realtime tracking broadcasting active users and their roles (`room-users`).
- **Low-Latency Collaborative Sync**: Keystrokes broadcast live to peers with Last Write Wins (LWW) resolution and infinite update loop prevention.
- **Late-Joiner Synchronization**: State sync protocol (`document-request-sync` and `document-sync`) ensuring newly connected peers acquire the current in-memory editor state.

### 💾 Debounced Auto-Save & Audit Logging
- **Debounced Persistence**: Background auto-save to PostgreSQL triggering after 800ms of user inactivity, preventing excessive REST calls.
- **Save Status Lifecycle**: Visual indicators tracking status: `✓ Saved`, `● Saving...`, `● Unsaved`, `⚠ Save failed`.
- **Unmount Flushing**: Flushes pending unsaved edits to PostgreSQL before component unmount or route navigation.
- **Immutable Audit Logging**: Every successful persistence creates an `EditEvent` entry storing editor identity, timestamp, and revision snapshots.
- **Lazy-Loaded History Drawer**: Paginated edit history timeline displaying relative timestamps (*"Just now"*, *"5 minutes ago"*) and content previews.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, React Router v6, Axios, Socket.IO Client, CSS3 |
| **Backend** | Node.js, Express.js, TypeScript, Socket.IO Server, Zod Validation, jsonwebtoken, bcryptjs |
| **Database & ORM** | PostgreSQL, Prisma ORM |
| **Testing & Tooling** | Node.js Test Harness, tsx, tsc |

---

## 🏗️ Architecture Overview

```
                            ┌──────────────────────────────────────┐
                            │          React Frontend (Vite)       │
                            │  (AuthContext, SocketContext, UI)   │
                            └──────────────────┬───────────────────┘
                                               │
                                      HTTP / WebSockets
                                               │
                                               ▼
                            ┌──────────────────────────────────────┐
                            │    Node.js HTTP Server (Port 5000)   │
                            ├──────────────────┬───────────────────┤
                            │   Express REST   │   Socket.IO Server│
                            │ (Auth, Docs,     │ (Rooms, Presence, │
                            │  Sharing, Audit) │  Realtime Edits)  │
                            └────────┬─────────┴─────────┬─────────┘
                                     │                   │
                                     ▼                   ▼
                            ┌──────────────────────────────────────┐
                            │             Prisma ORM               │
                            └──────────────────┬───────────────────┘
                                               │
                                               ▼
                            ┌──────────────────────────────────────┐
                            │        PostgreSQL Database           │
                            │  (User, Document, Access, EditEvent) │
                            └──────────────────────────────────────┘
```

---

## 📁 Project Structure

```
SyncDocs/
├── backend/                  # Express API & Socket.IO Server
│   ├── prisma/
│   │   └── schema.prisma     # Prisma Data Model (User, Document, DocumentAccess, EditEvent)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── document.controller.ts
│   │   │   ├── health.controller.ts
│   │   │   ├── history.controller.ts
│   │   │   └── sharing.controller.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── document.routes.ts
│   │   │   ├── health.routes.ts
│   │   │   ├── history.routes.ts
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
├── frontend/                 # React SPA Frontend (Vite + TypeScript)
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
│   │   │   ├── history.ts
│   │   │   ├── sharing.ts
│   │   │   └── socket.ts
│   │   └── types/
│   │       └── index.ts
│   └── .env.example
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/syncdocs?schema=public"
JWT_SECRET="your_secure_jwt_secret_key_here"
NODE_ENV="development"
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL="http://localhost:5000/api"
```

---

## 🚀 Local Installation & Setup Guide

### Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** running locally or via Docker

### 1. Clone & Setup Backend
```bash
cd backend
npm install
npx prisma db push
npm run build
```

### 2. Setup Frontend
```bash
cd ../frontend
npm install
npm run build
```

### 3. Run Development Servers
- **Backend**: `npm run dev` in `backend/` (Runs on `http://localhost:5000`)
- **Frontend**: `npm run dev` in `frontend/` (Runs on `http://localhost:5173`)

---

## 📡 REST API Reference

### Health Check
- `GET /api/health` — Backend server health status.

### Authentication
- `POST /api/auth/register` — Register user (`name`, `email`, `password`).
- `POST /api/auth/login` — Login user (`email`, `password`) -> Returns JWT token.
- `GET /api/profile` — Get authenticated user details.

### Documents & RBAC
- `GET /api/documents` — List owned documents (newest updated first).
- `POST /api/documents` — Create a new document (`title`).
- `GET /api/documents/:id` — Get document details (`OWNER`, `EDITOR`, `VIEWER`).
- `PATCH /api/documents/:id` — Update document title/content (`OWNER` & `EDITOR` only; logs `EditEvent`).
- `DELETE /api/documents/:id` — Delete document by ID (`OWNER` only).

### Sharing & Collaborators
- `GET /api/documents/shared` — Get documents shared with user.
- `GET /api/documents/:id/access` — Get access list for document (`OWNER` only).
- `POST /api/documents/:id/share` — Invite user by email & role (`OWNER` only).
- `PATCH /api/documents/:id/access/:accessId` — Update collaborator role (`OWNER` only).
- `DELETE /api/documents/:id/access/:accessId` — Revoke collaborator access (`OWNER` only).

### Edit History & Audit Logging
- `GET /api/documents/:id/history` — Get paginated edit audit logs (`page`, `limit`).

---

## ⚡ Socket.IO Event Reference

| Event Name | Direction | Description |
| :--- | :--- | :--- |
| `connection` | Client -> Server | Handshake carrying JWT token payload. |
| `join-document` | Client -> Server | Joins room `document:<id>` after permission check. |
| `leave-document` | Client -> Server | Leaves room `document:<id>`. |
| `room-users` | Server -> Room | Broadcasts active room users and roles `[{ userId, name, role }]`. |
| `document-update` | Client -> Server -> Room | Broadcasts live title/content keystrokes to room peers. |
| `document-request-sync` | Client -> Server -> Room | Requests current state from existing room occupants. |
| `document-sync` | Client -> Server -> Client | Sends state back directly to late-joining peer. |
| `error` | Server -> Client | Sent when unauthorized action or room join is attempted. |

---

## 🖼️ Screenshots Section (Placeholder)

> *Dashboard Overview, Collaborative Document Editor, Share Collaborators Panel, and Edit History Timeline.*

---

## 🔮 Future Improvements
- Operational Transformation (OT) or CRDT integration for concurrent character cursor offsets.
- Live cursor position indicators showing collaborator caret locations.
- Rich-text WYSIWYG editor support (Quill or Tiptap).
- Version rollback restoring document content from historical `EditEvent` snapshots.
