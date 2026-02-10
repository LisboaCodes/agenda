import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../config/database';

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const { category, tag, search, isPinned } = req.query;

    const where: any = { userId: req.userId };

    if (category) {
      where.category = category as string;
    }

    if (tag) {
      where.tags = { has: tag as string };
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (isPinned !== undefined) {
      where.isPinned = isPinned === 'true';
    }

    const notes = await prisma.note.findMany({
      where,
      orderBy: [
        { isPinned: 'desc' },
        { updatedAt: 'desc' },
      ],
    });

    res.json(notes);
  } catch (error: any) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Failed to get notes' });
  }
};

export const getNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findFirst({
      where: { id, userId: req.userId },
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error: any) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Failed to get note' });
  }
};

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, category, tags, color } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const note = await prisma.note.create({
      data: {
        userId: req.userId!,
        title,
        content,
        category,
        tags: tags || [],
        color,
      },
    });

    res.status(201).json(note);
  } catch (error: any) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, category, tags, color } = req.body;

    const note = await prisma.note.findFirst({
      where: { id, userId: req.userId },
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(category !== undefined && { category }),
        ...(tags !== undefined && { tags }),
        ...(color !== undefined && { color }),
      },
    });

    res.json(updatedNote);
  } catch (error: any) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findFirst({
      where: { id, userId: req.userId },
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await prisma.note.delete({ where: { id } });

    res.json({ message: 'Note deleted successfully' });
  } catch (error: any) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

export const togglePinNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findFirst({
      where: { id, userId: req.userId },
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: { isPinned: !note.isPinned },
    });

    res.json(updatedNote);
  } catch (error: any) {
    console.error('Toggle pin note error:', error);
    res.status(500).json({ error: 'Failed to toggle pin note' });
  }
};
