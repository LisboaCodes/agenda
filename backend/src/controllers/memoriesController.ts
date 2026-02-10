import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../config/database';

export const getMemories = async (req: AuthRequest, res: Response) => {
  try {
    const { year, month, search } = req.query;

    const where: any = { userId: req.userId };

    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
      where.memoryDate = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (month && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(Number(year), Number(month), 0);
      where.memoryDate = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { location: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const memories = await prisma.memory.findMany({
      where,
      orderBy: { memoryDate: 'desc' },
    });

    res.json(memories);
  } catch (error: any) {
    console.error('Get memories error:', error);
    res.status(500).json({ error: 'Failed to get memories' });
  }
};

export const getMemory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const memory = await prisma.memory.findFirst({
      where: { id, userId: req.userId },
    });

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    // Get associated files
    const files = await prisma.file.findMany({
      where: {
        userId: req.userId,
        referenceType: 'memory',
        referenceId: id,
      },
    });

    res.json({ ...memory, files });
  } catch (error: any) {
    console.error('Get memory error:', error);
    res.status(500).json({ error: 'Failed to get memory' });
  }
};

export const createMemory = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, memoryDate, location } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const memory = await prisma.memory.create({
      data: {
        userId: req.userId!,
        title,
        description,
        memoryDate: memoryDate ? new Date(memoryDate) : null,
        location,
      },
    });

    res.status(201).json(memory);
  } catch (error: any) {
    console.error('Create memory error:', error);
    res.status(500).json({ error: 'Failed to create memory' });
  }
};

export const updateMemory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, memoryDate, location } = req.body;

    const memory = await prisma.memory.findFirst({
      where: { id, userId: req.userId },
    });

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    const updatedMemory = await prisma.memory.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(memoryDate !== undefined && { memoryDate: new Date(memoryDate) }),
        ...(location !== undefined && { location }),
      },
    });

    res.json(updatedMemory);
  } catch (error: any) {
    console.error('Update memory error:', error);
    res.status(500).json({ error: 'Failed to update memory' });
  }
};

export const deleteMemory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const memory = await prisma.memory.findFirst({
      where: { id, userId: req.userId },
    });

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    // Delete associated files
    await prisma.file.deleteMany({
      where: {
        userId: req.userId,
        referenceType: 'memory',
        referenceId: id,
      },
    });

    await prisma.memory.delete({ where: { id } });

    res.json({ message: 'Memory deleted successfully' });
  } catch (error: any) {
    console.error('Delete memory error:', error);
    res.status(500).json({ error: 'Failed to delete memory' });
  }
};
