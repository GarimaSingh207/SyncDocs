import { z } from 'zod';
import { Role } from '@prisma/client';

export const shareDocumentSchema = z.object({
  email: z.string().trim().lowercase().email('Invalid email address'),
  role: z.enum([Role.EDITOR, Role.VIEWER]),
});

export const updateAccessRoleSchema = z.object({
  role: z.enum([Role.EDITOR, Role.VIEWER]),
});

export type ShareDocumentInput = z.infer<typeof shareDocumentSchema>;
export type UpdateAccessRoleInput = z.infer<typeof updateAccessRoleSchema>;
