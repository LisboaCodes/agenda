import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../config/database';

export const getPayments = async (req: AuthRequest, res: Response) => {
  try {
    const { status, paymentType, clientId, serviceId, startDate, endDate } = req.query;

    const where: any = { userId: req.userId };

    if (status) {
      where.status = status as string;
    }

    if (paymentType) {
      where.paymentType = paymentType as string;
    }

    if (clientId) {
      where.clientId = clientId as string;
    }

    if (serviceId) {
      where.serviceId = serviceId as string;
    }

    if (startDate || endDate) {
      where.dueDate = {};
      if (startDate) where.dueDate.gte = new Date(startDate as string);
      if (endDate) where.dueDate.lte = new Date(endDate as string);
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        client: {
          select: { id: true, name: true, email: true },
        },
        service: {
          select: { id: true, serviceName: true },
        },
      },
      orderBy: { dueDate: 'desc' },
    });

    res.json(payments);
  } catch (error: any) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Failed to get payments' });
  }
};

export const getPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findFirst({
      where: { id, userId: req.userId },
      include: {
        client: true,
        service: true,
      },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error: any) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to get payment' });
  }
};

export const createPayment = async (req: AuthRequest, res: Response) => {
  try {
    const {
      clientId,
      serviceId,
      description,
      amount,
      paymentType,
      paymentMethod,
      dueDate,
      paidDate,
      status,
      notes,
    } = req.body;

    if (!description || !amount || !paymentType) {
      return res.status(400).json({
        error: 'Description, amount, and payment type are required',
      });
    }

    const payment = await prisma.payment.create({
      data: {
        userId: req.userId!,
        clientId,
        serviceId,
        description,
        amount,
        paymentType,
        paymentMethod,
        dueDate: dueDate ? new Date(dueDate) : null,
        paidDate: paidDate ? new Date(paidDate) : null,
        status: status || 'pending',
        notes,
      },
      include: {
        client: {
          select: { id: true, name: true },
        },
        service: {
          select: { id: true, serviceName: true },
        },
      },
    });

    res.status(201).json(payment);
  } catch (error: any) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

export const updatePayment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      clientId,
      serviceId,
      description,
      amount,
      paymentType,
      paymentMethod,
      dueDate,
      paidDate,
      status,
      notes,
    } = req.body;

    const payment = await prisma.payment.findFirst({
      where: { id, userId: req.userId },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        ...(clientId !== undefined && { clientId }),
        ...(serviceId !== undefined && { serviceId }),
        ...(description !== undefined && { description }),
        ...(amount !== undefined && { amount }),
        ...(paymentType !== undefined && { paymentType }),
        ...(paymentMethod !== undefined && { paymentMethod }),
        ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
        ...(paidDate !== undefined && { paidDate: paidDate ? new Date(paidDate) : null }),
        ...(status !== undefined && { status }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        client: {
          select: { id: true, name: true },
        },
        service: {
          select: { id: true, serviceName: true },
        },
      },
    });

    res.json(updatedPayment);
  } catch (error: any) {
    console.error('Update payment error:', error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
};

export const markAsPaid = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findFirst({
      where: { id, userId: req.userId },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        status: 'paid',
        paidDate: new Date(),
      },
    });

    res.json(updatedPayment);
  } catch (error: any) {
    console.error('Mark as paid error:', error);
    res.status(500).json({ error: 'Failed to mark payment as paid' });
  }
};

export const deletePayment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findFirst({
      where: { id, userId: req.userId },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    await prisma.payment.delete({ where: { id } });

    res.json({ message: 'Payment deleted successfully' });
  } catch (error: any) {
    console.error('Delete payment error:', error);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
};
