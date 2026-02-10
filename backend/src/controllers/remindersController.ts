import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../config/database';

export const getReminders = async (req: AuthRequest, res: Response) => {
  try {
    const { priority, isCompleted, startDate, endDate } = req.query;

    const where: any = { userId: req.userId };

    if (priority) {
      where.priority = priority as string;
    }

    if (isCompleted !== undefined) {
      where.isCompleted = isCompleted === 'true';
    }

    if (startDate || endDate) {
      where.reminderDate = {};
      if (startDate) where.reminderDate.gte = new Date(startDate as string);
      if (endDate) where.reminderDate.lte = new Date(endDate as string);
    }

    const reminders = await prisma.reminder.findMany({
      where,
      orderBy: [
        { isCompleted: 'asc' },
        { reminderDate: 'asc' },
      ],
    });

    res.json(reminders);
  } catch (error: any) {
    console.error('Get reminders error:', error);
    res.status(500).json({ error: 'Failed to get reminders' });
  }
};

export const getReminder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const reminder = await prisma.reminder.findFirst({
      where: { id, userId: req.userId },
    });

    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    res.json(reminder);
  } catch (error: any) {
    console.error('Get reminder error:', error);
    res.status(500).json({ error: 'Failed to get reminder' });
  }
};

export const createReminder = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      reminderDate,
      isRecurring,
      recurrencePattern,
      priority,
    } = req.body;

    if (!title || !reminderDate) {
      return res.status(400).json({ error: 'Title and reminder date are required' });
    }

    const reminder = await prisma.reminder.create({
      data: {
        userId: req.userId!,
        title,
        description,
        reminderDate: new Date(reminderDate),
        isRecurring: isRecurring || false,
        recurrencePattern,
        priority: priority || 'medium',
      },
    });

    res.status(201).json(reminder);
  } catch (error: any) {
    console.error('Create reminder error:', error);
    res.status(500).json({ error: 'Failed to create reminder' });
  }
};

export const updateReminder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      reminderDate,
      isRecurring,
      recurrencePattern,
      priority,
    } = req.body;

    const reminder = await prisma.reminder.findFirst({
      where: { id, userId: req.userId },
    });

    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    const updatedReminder = await prisma.reminder.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(reminderDate !== undefined && { reminderDate: new Date(reminderDate) }),
        ...(isRecurring !== undefined && { isRecurring }),
        ...(recurrencePattern !== undefined && { recurrencePattern }),
        ...(priority !== undefined && { priority }),
      },
    });

    res.json(updatedReminder);
  } catch (error: any) {
    console.error('Update reminder error:', error);
    res.status(500).json({ error: 'Failed to update reminder' });
  }
};

export const completeReminder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const reminder = await prisma.reminder.findFirst({
      where: { id, userId: req.userId },
    });

    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    const updatedReminder = await prisma.reminder.update({
      where: { id },
      data: { isCompleted: !reminder.isCompleted },
    });

    res.json(updatedReminder);
  } catch (error: any) {
    console.error('Complete reminder error:', error);
    res.status(500).json({ error: 'Failed to complete reminder' });
  }
};

export const deleteReminder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const reminder = await prisma.reminder.findFirst({
      where: { id, userId: req.userId },
    });

    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    await prisma.reminder.delete({ where: { id } });

    res.json({ message: 'Reminder deleted successfully' });
  } catch (error: any) {
    console.error('Delete reminder error:', error);
    res.status(500).json({ error: 'Failed to delete reminder' });
  }
};

export const getUpcoming = async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const reminders = await prisma.reminder.findMany({
      where: {
        userId: req.userId,
        isCompleted: false,
        reminderDate: {
          gte: now,
          lte: endOfDay,
        },
      },
      orderBy: { reminderDate: 'asc' },
    });

    res.json(reminders);
  } catch (error: any) {
    console.error('Get upcoming reminders error:', error);
    res.status(500).json({ error: 'Failed to get upcoming reminders' });
  }
};
