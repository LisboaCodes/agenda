import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../config/database';
import { Prisma } from '@prisma/client';

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const { transactionType, category, startDate, endDate, search } = req.query;

    const where: any = { userId: req.userId };

    if (transactionType) {
      where.transactionType = transactionType as string;
    }

    if (category) {
      where.category = category as string;
    }

    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) where.transactionDate.gte = new Date(startDate as string);
      if (endDate) where.transactionDate.lte = new Date(endDate as string);
    }

    if (search) {
      where.OR = [
        { description: { contains: search as string, mode: 'insensitive' } },
        { category: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { transactionDate: 'desc' },
    });

    res.json(transactions);
  } catch (error: any) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
};

export const getTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId: req.userId },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error: any) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Failed to get transaction' });
  }
};

export const getSummary = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const where: any = { userId: req.userId };

    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) where.transactionDate.gte = new Date(startDate as string);
      if (endDate) where.transactionDate.lte = new Date(endDate as string);
    }

    // Get income total
    const income = await prisma.transaction.aggregate({
      where: {
        ...where,
        transactionType: 'income',
      },
      _sum: {
        amount: true,
      },
    });

    // Get expense total
    const expense = await prisma.transaction.aggregate({
      where: {
        ...where,
        transactionType: 'expense',
      },
      _sum: {
        amount: true,
      },
    });

    // Get category breakdown
    const byCategory = await prisma.transaction.groupBy({
      by: ['category', 'transactionType'],
      where,
      _sum: {
        amount: true,
      },
      _count: true,
    });

    const totalIncome = income._sum.amount || new Prisma.Decimal(0);
    const totalExpense = expense._sum.amount || new Prisma.Decimal(0);
    const balance = totalIncome.minus(totalExpense);

    res.json({
      income: totalIncome,
      expense: totalExpense,
      balance,
      byCategory,
    });
  } catch (error: any) {
    console.error('Get summary error:', error);
    res.status(500).json({ error: 'Failed to get summary' });
  }
};

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const {
      description,
      amount,
      transactionType,
      category,
      transactionDate,
      paymentMethod,
      notes,
    } = req.body;

    if (!description || !amount || !transactionType || !transactionDate) {
      return res.status(400).json({
        error: 'Description, amount, transaction type, and date are required',
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: req.userId!,
        description,
        amount,
        transactionType,
        category,
        transactionDate: new Date(transactionDate),
        paymentMethod,
        notes,
      },
    });

    res.status(201).json(transaction);
  } catch (error: any) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      description,
      amount,
      transactionType,
      category,
      transactionDate,
      paymentMethod,
      notes,
    } = req.body;

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId: req.userId },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...(description !== undefined && { description }),
        ...(amount !== undefined && { amount }),
        ...(transactionType !== undefined && { transactionType }),
        ...(category !== undefined && { category }),
        ...(transactionDate !== undefined && { transactionDate: new Date(transactionDate) }),
        ...(paymentMethod !== undefined && { paymentMethod }),
        ...(notes !== undefined && { notes }),
      },
    });

    res.json(updatedTransaction);
  } catch (error: any) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId: req.userId },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await prisma.transaction.delete({ where: { id } });

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error: any) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};
