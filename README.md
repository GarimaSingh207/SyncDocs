# SyncDocs

A real-time collaborative document editing platform built with Node.js, Express, PostgreSQL, Prisma, Socket.IO, and React.

## Project Structure

```
SyncDocs/
├── backend/          # Express API & Socket.IO server
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── app.ts
│   │   └── index.ts
│   └── .env.example
├── frontend/         # React SPA frontend
└── README.md
```

## API Endpoints

### Health Check
- `GET /api/health` — Returns status of backend server

## Features

- **Authentication**: User Registration & Login with JWT & bcrypt
- **Document Management**: Create, Rename, Delete, List owned and shared documents
- **Document Sharing**: Invite users by email with roles (OWNER, EDITOR, VIEWER)
- **Access Control**: Enforced permissions on REST APIs and Socket.IO events
- **Realtime Editing**: Collaborative editing using Socket.IO room broadcast
- **Persistence & History**: Debounced PostgreSQL saves and edit event logging
