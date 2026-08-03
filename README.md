# SyncDocs

A modern, real-time collaborative document editing platform engineered for low-latency synchronization, role-based access control, and robust document management.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Why I Built This](#-why-i-built-this)
- [Key Features](#-key-features)
- [Live Demo](#-live-demo)
- [Technology Stack](#-technology-stack)
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Quick Start & Local Setup](#-quick-start--local-setup)
- [API Reference](#-api-reference)
- [Socket.IO Events](#-socketio-events)
- [Future Roadmap](#-future-roadmap)
- [License](#-license)

---

## 🔍 Overview

SyncDocs is a full-stack real-time collaborative document editor. The platform allows multiple users to edit documents simultaneously while ensuring state consistency, secure authentication, and fine-grained access control. SyncDocs models real-world document collaboration systems like Google Docs, translating reactive user interaction into state updates via WebSockets and REST APIs.

---

## 💡 Why I Built This

I built SyncDocs to solve the engineering challenges of **real-time state synchronization** and **conflict resolution** in distributed web environments. Building SyncDocs required designing a reliable handshake protocol over WebSockets, optimizing REST payload sizes through debounced auto-saves, and implementing a strict Role-Based Access Control (RBAC) model spanning both standard HTTP requests and active WebSocket connections.

---

## ✨ Key Features

### ⚡ Real-Time Collaboration & Active Presence
- **State Synchronization Protocol**: Late-joining client synchronization prevents stale state overrides by coordinating peer-to-peer updates.
- **Keystroke Broadcast**: Keystroke states propagate to room participants with loop prevention and Conflict-free-replicated-like resolution.
- **Active User Presence**: Rooms list active users and their access roles dynamically.

### 🔐 Security & Access Management
- **Role-Based Access Control (RBAC)**: Enforces access tiers:
  - `OWNER`: Full document lifecycle control (read, write, delete, sharing, collaborator role management).
  - `EDITOR`: Permitted to modify document content and titles.
  - `VIEWER`: Read-only access; textareas are locked, and API updates return `403 Forbidden`.
- **Handshake Verification**: Socket connections require authentication tokens during the initialization handshake.

### 💾 Performance & Data Integrity
- **Debounced Auto-Save**: Auto-save triggers after 800ms of user inactivity to reduce server database writes.
- **Unmount State Flush**: Pending changes flush to PostgreSQL during navigation actions or page closes.
- **Immutable Revision Auditing**: Document saves create history logs displaying change timelines and preview snapshots.

---

## 🌐 Live Demo

- **Frontend Deployment**: [<ADD_VERCEL_URL>](https://vercel.com) *(Placeholder)*
- **API Server Endpoint**: [<ADD_BACKEND_URL>](https://render.com) *(Placeholder)*

---

## 🛠️ Technology Stack

| Layer | Tools |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, React Router v6, Axios, Socket.IO Client, Tailwind CSS |
| **Backend** | Node.js, Express.js, TypeScript, Socket.IO Server, Zod Validation, JWT, bcryptjs |
| **Database & ORM** | PostgreSQL, Prisma ORM |
| **Tooling** | Node.js Test Harness, tsx, tsc, ESLint |

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

<details>
<summary><b>View Directory Tree</b></summary>

```
SyncDocs/
├── backend/                  # Express API & Socket.IO Server
│   ├── prisma/
│   │   └── schema.prisma     # Prisma Data Model (User, Document, DocumentAccess, EditEvent)
│   ├── src/
│   │   ├── controllers/      # Route Controllers
│   │   ├── middleware/       # Authentication & Security Middleware
│   │   ├── routes/           # Express Route Definitions
│   │   ├── schemas/          # Zod Validation Schemas
│   │   ├── socket/           # WebSocket Handler
│   │   ├── lib/              # Client Initializers
│   │   ├── app.ts
│   │   └── index.ts
│   └── .env.example
├── frontend/                 # React SPA Frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/       # Global Layout & Modals
│   │   ├── context/          # React Context Providers
│   │   ├── hooks/            # Custom Hooks
│   │   ├── pages/            # Application Routing Views
│   │   ├── services/         # API Endpoint Connectors
│   │   └── types/            # TypeScript System Typings
│   └── .env.example
└── README.md
```
</details>

---

## 🖼️ Screenshots

### Landing Page
![Landing Page Placeholder](https://via.placeholder.com/1200x600/131314/ffffff?text=Landing+Page+Overview)

### Dashboard
![Dashboard Placeholder](https://via.placeholder.com/1200x600/131314/ffffff?text=User+Workspace+Dashboard)

### Collaborative Editor
![Collaborative Editor Placeholder](https://via.placeholder.com/1200x600/131314/ffffff?text=Real-time+Collaborative+Editor)

### Sharing Settings
![Sharing Dialog Placeholder](https://via.placeholder.com/1200x600/131314/ffffff?text=Collaborators+Permission+Manager)

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** instance running locally

### 1. Set Up the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   Provide your values:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/syncdocs?schema=public"
   JWT_SECRET="your_secure_jwt_secret_key"
   NODE_ENV="development"
   ```
4. Push the schema to your database:
   ```bash
   npx prisma db push
   ```
5. Compile and start the server:
   ```bash
   npm run dev
   ```

### 2. Set Up the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   Provide the API endpoint url:
   ```env
   VITE_API_URL="http://localhost:5000/api"
   ```
4. Start the application:
   ```bash
   npm run dev
   ```
   The UI will be running on `http://localhost:5173`.

---

## 📡 API Reference

<details>
<summary><b>View Endpoint Documentation</b></summary>

### Health Status
* `GET /api/health` — Check api status.

### Authentication
* `POST /api/auth/register` — Register user.
* `POST /api/auth/login` — Login user, returning token.
* `GET /api/profile` — Fetch authenticated user details.

### Documents REST
* `GET /api/documents` — List user's documents.
* `POST /api/documents` — Create a new document.
* `GET /api/documents/:id` — Fetch document details.
* `PATCH /api/documents/:id` — Update title or content (Updates audit logs).
* `DELETE /api/documents/:id` — Delete document (Enforced OWNER only).

### Sharing Permissions
* `GET /api/documents/shared` — Get shared documents.
* `GET /api/documents/:id/access` — List document access rules.
* `POST /api/documents/:id/share` — Add team collaborator.
* `PATCH /api/documents/:id/access/:accessId` — Modify collaborator access role.
* `DELETE /api/documents/:id/access/:accessId` — Revoke collaborator access.

### Document Audit Log
* `GET /api/documents/:id/history` — Fetch paginated revision history.
</details>

---

## ⚡ Socket.IO Events

| Event Name | Direction | Description |
| :--- | :--- | :--- |
| `connection` | Client -> Server | Verifies JWT credentials. |
| `join-document` | Client -> Server | Enters designated document room after validation. |
| `leave-document` | Client -> Server | Leaves document room. |
| `room-users` | Server -> Room | Broadcasts current active member presences. |
| `document-update` | Client -> Server -> Room | Emits keystroke changes to active room editors. |
| `document-request-sync` | Client -> Server -> Room | Queries state from active members for late-joiner. |
| `document-sync` | Client -> Server -> Client | Delivers current editor state to late-joining user. |
| `error` | Server -> Client | Emitted when connection or room validations fail. |

---

## 🔮 Future Roadmap

- **Operational Transformations (OT)**: Add character-level conflict resolution.
- **Live Collaborative Cursors**: Render caret positions of other users editing the document in real time.
- **Rich Text Support**: Connect content to rich editor plugins like Tiptap.
- **Rollback System**: Add options to restore previous states from the audit history timeline.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
