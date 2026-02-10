import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../config/database';

export const getClients = async (req: AuthRequest, res: Response) => {
  try {
    const { status, search } = req.query;

    const where: any = { userId: req.userId };

    if (status) {
      where.status = status as string;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { phone: { contains: search as string, mode: 'insensitive' } },
        { company: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const clients = await prisma.client.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(clients);
  } catch (error: any) {
    console.error('Get clients error:', error);
    res.status(500).json({ error: 'Failed to get clients' });
  }
};

export const getClient = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findFirst({
      where: { id, userId: req.userId },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(client);
  } catch (error: any) {
    console.error('Get client error:', error);
    res.status(500).json({ error: 'Failed to get client' });
  }
};

export const createClient = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, company, address, notes, status } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const client = await prisma.client.create({
      data: {
        userId: req.userId!,
        name,
        email,
        phone,
        company,
        address,
        notes,
        status: status || 'active',
      },
    });

    res.status(201).json(client);
  } catch (error: any) {
    console.error('Create client error:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
};

export const updateClient = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, address, notes, status } = req.body;

    const client = await prisma.client.findFirst({
      where: { id, userId: req.userId },
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(company !== undefined && { company }),
        ...(address !== undefined && { address }),
        ...(notes !== undefined && { notes }),
        ...(status !== undefined && { status }),
      },
    });

    res.json(updatedClient);
  } catch (error: any) {
    console.error('Update client error:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
};

export const deleteClient = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findFirst({
      where: { id, userId: req.userId },
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    await prisma.client.delete({ where: { id } });

    res.json({ message: 'Client deleted successfully' });
  } catch (error: any) {
    console.error('Delete client error:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
};
