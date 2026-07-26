import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { SOCKET_EVENTS } from './events';
import { Role } from '@prisma/client';

interface JwtPayload {
  id: string;
  email: string;
}

interface SocketData {
  user: {
    id: string;
    name: string;
    email: string;
  };
  currentDocumentId?: string;
  role?: Role;
}

export const initSocket = (httpServer: HttpServer) => {
  const io = new SocketIOServer<any, any, any, SocketData>(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    },
  });

  // JWT Authentication Middleware for Socket.IO
  io.use(async (socket: Socket<any, any, any, SocketData>, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        (socket.handshake.headers?.authorization &&
          socket.handshake.headers.authorization.split(' ')[1]);

      if (!token) {
        return next(new Error('Authentication error: Missing token'));
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return next(new Error('Authentication error: Server configuration issue'));
      }

      const decoded = jwt.verify(token, secret) as JwtPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true },
      });

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.data.user = user;
      next();
    } catch (err) {
      console.error('Socket authentication failed:', err);
      return next(new Error('Authentication error: Invalid or expired token'));
    }
  });

  // Helper function to broadcast room users
  const broadcastRoomUsers = async (documentId: string) => {
    const roomName = `document:${documentId}`;
    const socketsInRoom = await io.in(roomName).fetchSockets();

    const activeUsers = socketsInRoom.map((s: any) => ({
      userId: s.data.user?.id,
      name: s.data.user?.name,
      role: s.data.role || Role.VIEWER,
    }));

    // Deduplicate active users list by userId
    const uniqueUsersMap = new Map();
    activeUsers.forEach((u) => {
      if (u.userId && !uniqueUsersMap.has(u.userId)) {
        uniqueUsersMap.set(u.userId, u);
      }
    });

    const roomUserList = Array.from(uniqueUsersMap.values());
    io.to(roomName).emit(SOCKET_EVENTS.ROOM_USERS, roomUserList);
  };

  io.on(SOCKET_EVENTS.CONNECT, (socket: Socket<any, any, any, SocketData>) => {
    console.log(`Socket connected: ${socket.id} (User: ${socket.data.user?.name})`);

    // Event: join-document
    socket.on(SOCKET_EVENTS.JOIN_DOCUMENT, async (data: { documentId: string }) => {
      try {
        const { documentId } = data;
        const userId = socket.data.user?.id;

        if (!documentId || !userId) {
          return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Invalid join-document request' });
        }

        const document = await prisma.document.findUnique({
          where: { id: documentId },
        });

        if (!document) {
          return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Document not found' });
        }

        let userRole: Role | null = null;
        if (document.ownerId === userId) {
          userRole = Role.OWNER;
        } else {
          const access = await prisma.documentAccess.findUnique({
            where: {
              documentId_userId: {
                documentId,
                userId,
              },
            },
          });
          if (access) {
            userRole = access.role;
          }
        }

        if (!userRole) {
          return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Access denied to document room' });
        }

        const roomName = `document:${documentId}`;
        socket.join(roomName);
        socket.data.currentDocumentId = documentId;
        socket.data.role = userRole;

        console.log(`User ${socket.data.user.name} joined room ${roomName} as ${userRole}`);
        await broadcastRoomUsers(documentId);
      } catch (err) {
        console.error('Error joining document room:', err);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to join document room' });
      }
    });

    // Event: document-update
    socket.on(
      SOCKET_EVENTS.DOCUMENT_UPDATE,
      (data: { documentId: string; title?: string; content?: string }) => {
        const { documentId, title, content } = data;
        const currentDocId = socket.data.currentDocumentId;
        const role = socket.data.role;

        if (!documentId || documentId !== currentDocId) {
          return socket.emit(SOCKET_EVENTS.ERROR, { message: 'You are not connected to this document room' });
        }

        if (!role || (role !== Role.OWNER && role !== Role.EDITOR)) {
          return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Viewers cannot edit documents' });
        }

        const roomName = `document:${documentId}`;

        // Broadcast update to everyone in room except originating socket
        socket.to(roomName).emit(SOCKET_EVENTS.DOCUMENT_UPDATE, {
          documentId,
          title,
          content,
          updatedBy: socket.data.user?.name,
        });
      }
    );

    // Event: document-request-sync (late joiner requests latest state)
    socket.on(SOCKET_EVENTS.DOCUMENT_REQUEST_SYNC, (data: { documentId: string }) => {
      const { documentId } = data;
      const roomName = `document:${documentId}`;
      socket.to(roomName).emit(SOCKET_EVENTS.DOCUMENT_REQUEST_SYNC, {
        requesterSocketId: socket.id,
      });
    });

    // Event: document-sync (existing client responds with state)
    socket.on(
      SOCKET_EVENTS.DOCUMENT_SYNC,
      (data: { targetSocketId: string; title: string; content: string }) => {
        const { targetSocketId, title, content } = data;
        if (targetSocketId) {
          io.to(targetSocketId).emit(SOCKET_EVENTS.DOCUMENT_SYNC, { title, content });
        }
      }
    );

    // Event: leave-document
    socket.on(SOCKET_EVENTS.LEAVE_DOCUMENT, async (data: { documentId: string }) => {
      try {
        const { documentId } = data;
        if (documentId) {
          const roomName = `document:${documentId}`;
          socket.leave(roomName);
          socket.data.currentDocumentId = undefined;
          console.log(`User ${socket.data.user?.name} left room ${roomName}`);
          await broadcastRoomUsers(documentId);
        }
      } catch (err) {
        console.error('Error leaving document room:', err);
      }
    });

    // Event: disconnect
    socket.on(SOCKET_EVENTS.DISCONNECT, async (reason) => {
      console.log(`Socket disconnected: ${socket.id} (${reason})`);
      const documentId = socket.data.currentDocumentId;
      if (documentId) {
        await broadcastRoomUsers(documentId);
      }
    });
  });

  return io;
};

export default initSocket;
