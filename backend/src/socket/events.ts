export const SOCKET_EVENTS = {
  CONNECT: 'connection',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  JOIN_DOCUMENT: 'join-document',
  LEAVE_DOCUMENT: 'leave-document',
  ROOM_USERS: 'room-users',
  DOCUMENT_UPDATE: 'document-update',
  DOCUMENT_REQUEST_SYNC: 'document-request-sync',
  DOCUMENT_SYNC: 'document-sync',
  ERROR: 'error',
} as const;
