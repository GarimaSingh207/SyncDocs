import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { shareDocumentSchema, updateAccessRoleSchema } from '../schemas/sharing.schema';

export const getSharedDocuments = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const sharedAccessList = await prisma.documentAccess.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        document: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        document: {
          updatedAt: 'desc',
        },
      },
    });

    const sharedDocuments = sharedAccessList.map((access) => ({
      ...access.document,
      role: access.role,
    }));

    return res.status(200).json(sharedDocuments);
  } catch (error) {
    console.error('Error fetching shared documents:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDocumentAccess = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { id } = req.params;

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Only the document owner can view sharing access' });
    }

    const accessEntries = await prisma.documentAccess.findMany({
      where: { documentId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        role: 'asc',
      },
    });

    const formattedList = accessEntries.map((entry) => ({
      accessId: entry.id,
      userId: entry.user.id,
      name: entry.user.name,
      email: entry.user.email,
      role: entry.role,
    }));

    return res.status(200).json(formattedList);
  } catch (error) {
    console.error('Error fetching document access:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const shareDocument = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { id } = req.params;

    const validationResult = shareDocumentSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      });
    }

    const { email, role } = validationResult.data;

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Only the document owner can share this document' });
    }

    const targetUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!targetUser) {
      return res.status(404).json({ message: 'User with this email not found' });
    }

    if (targetUser.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot share document with yourself' });
    }

    const existingAccess = await prisma.documentAccess.findUnique({
      where: {
        documentId_userId: {
          documentId: id,
          userId: targetUser.id,
        },
      },
    });

    if (existingAccess) {
      return res.status(400).json({ message: 'User already has access to this document' });
    }

    await prisma.documentAccess.create({
      data: {
        documentId: id,
        userId: targetUser.id,
        role,
      },
    });

    return getDocumentAccess(req, res);
  } catch (error) {
    console.error('Error sharing document:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateAccessRole = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { id, accessId } = req.params;

    const validationResult = updateAccessRoleSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      });
    }

    const { role } = validationResult.data;

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Only the document owner can modify sharing roles' });
    }

    const accessEntry = await prisma.documentAccess.findUnique({
      where: { id: accessId },
    });

    if (!accessEntry || accessEntry.documentId !== id) {
      return res.status(404).json({ message: 'Access entry not found for this document' });
    }

    await prisma.documentAccess.update({
      where: { id: accessId },
      data: { role },
    });

    return getDocumentAccess(req, res);
  } catch (error) {
    console.error('Error updating access role:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const removeAccess = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { id, accessId } = req.params;

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Only the document owner can remove access' });
    }

    const accessEntry = await prisma.documentAccess.findUnique({
      where: { id: accessId },
    });

    if (!accessEntry || accessEntry.documentId !== id) {
      return res.status(404).json({ message: 'Access entry not found for this document' });
    }

    await prisma.documentAccess.delete({
      where: { id: accessId },
    });

    return res.status(200).json({ message: 'Access removed successfully' });
  } catch (error) {
    console.error('Error removing document access:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
