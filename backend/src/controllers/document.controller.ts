import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { createDocumentSchema, updateDocumentSchema } from '../schemas/document.schema';
import { Role } from '@prisma/client';

export const getDocuments = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const documents = await prisma.document.findMany({
      where: {
        ownerId: req.user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching user documents:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createDocument = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const validationResult = createDocumentSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      });
    }

    const { title } = validationResult.data;

    const document = await prisma.document.create({
      data: {
        title,
        content: '',
        ownerId: req.user.id,
      },
    });

    return res.status(201).json({
      ...document,
      userRole: Role.OWNER,
    });
  } catch (error) {
    console.error('Error creating document:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDocumentById = async (req: Request, res: Response) => {
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

    let userRole: Role | null = null;

    if (document.ownerId === req.user.id) {
      userRole = Role.OWNER;
    } else {
      const access = await prisma.documentAccess.findUnique({
        where: {
          documentId_userId: {
            documentId: id,
            userId: req.user.id,
          },
        },
      });

      if (access) {
        userRole = access.role;
      }
    }

    if (!userRole) {
      return res.status(403).json({ message: 'Access denied. You do not have permission to view this document.' });
    }

    return res.status(200).json({
      ...document,
      userRole,
    });
  } catch (error) {
    console.error('Error fetching document by ID:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateDocument = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { id } = req.params;

    const validationResult = updateDocumentSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      });
    }

    const existingDocument = await prisma.document.findUnique({
      where: { id },
    });

    if (!existingDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }

    let canEdit = false;

    if (existingDocument.ownerId === req.user.id) {
      canEdit = true;
    } else {
      const access = await prisma.documentAccess.findUnique({
        where: {
          documentId_userId: {
            documentId: id,
            userId: req.user.id,
          },
        },
      });

      if (access && access.role === Role.EDITOR) {
        canEdit = true;
      }
    }

    if (!canEdit) {
      return res.status(403).json({ message: 'Access denied. Viewers cannot edit documents.' });
    }

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: validationResult.data,
    });

    return res.status(200).json(updatedDocument);
  } catch (error) {
    console.error('Error updating document:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { id } = req.params;

    const existingDocument = await prisma.document.findUnique({
      where: { id },
    });

    if (!existingDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (existingDocument.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. Only the document owner can delete this document.' });
    }

    await prisma.document.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
