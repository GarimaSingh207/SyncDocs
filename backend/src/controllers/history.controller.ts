import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { Role } from '@prisma/client';

export const getDocumentHistory = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { id } = req.params;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Authorization check: OWNER, EDITOR, or VIEWER
    let hasAccess = false;

    if (document.ownerId === req.user.id) {
      hasAccess = true;
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
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied. You do not have permission to view this document history.' });
    }

    const [total, editEvents] = await Promise.all([
      prisma.editEvent.count({ where: { documentId: id } }),
      prisma.editEvent.findMany({
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
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
    ]);

    const formattedEvents = editEvents.map((event) => {
      let title = document.title;
      let content = '';
      try {
        const parsed = JSON.parse(event.changeSummary);
        if (parsed.title) title = parsed.title;
        if (parsed.content) content = parsed.content;
      } catch (e) {
        content = event.changeSummary;
      }

      return {
        id: event.id,
        documentId: event.documentId,
        userId: event.userId,
        userName: event.user.name,
        userEmail: event.user.email,
        title,
        content,
        createdAt: event.createdAt,
      };
    });

    return res.status(200).json({
      events: formattedEvents,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching document history:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
