export type Role = 'OWNER' | 'EDITOR' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  userRole?: Role;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface SharedDocument extends Document {
  role: Role;
}

export interface Collaborator {
  accessId: string;
  userId: string;
  name: string;
  email: string;
  role: Role;
}

export interface CreateDocumentPayload {
  title: string;
}

export interface UpdateDocumentPayload {
  title?: string;
  content?: string;
}

export interface ShareDocumentPayload {
  email: string;
  role: Role;
}

export interface UpdateAccessRolePayload {
  role: Role;
}
