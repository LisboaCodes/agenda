import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../config/database';

export const getServices = async (req: AuthRequest, res: Response) => {
  try {
    const { status, search } = req.query;

    const where: any = { userId: req.userId };

    if (status) {
      where.status = status as string;
    }

    if (search) {
      where.OR = [
        { serviceName: { contains: search as string, mode: 'insensitive' } },
        { provider: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(services);
  } catch (error: any) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to get services' });
  }
};

export const getService = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findFirst({
      where: { id, userId: req.userId },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (error: any) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Failed to get service' });
  }
};

export const createService = async (req: AuthRequest, res: Response) => {
  try {
    const {
      serviceName,
      description,
      provider,
      contractStart,
      contractEnd,
      monthlyCost,
      status,
      notes,
    } = req.body;

    if (!serviceName) {
      return res.status(400).json({ error: 'Service name is required' });
    }

    const service = await prisma.service.create({
      data: {
        userId: req.userId!,
        serviceName,
        description,
        provider,
        contractStart: contractStart ? new Date(contractStart) : null,
        contractEnd: contractEnd ? new Date(contractEnd) : null,
        monthlyCost,
        status: status || 'active',
        notes,
      },
    });

    res.status(201).json(service);
  } catch (error: any) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
};

export const updateService = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      serviceName,
      description,
      provider,
      contractStart,
      contractEnd,
      monthlyCost,
      status,
      notes,
    } = req.body;

    const service = await prisma.service.findFirst({
      where: { id, userId: req.userId },
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        ...(serviceName !== undefined && { serviceName }),
        ...(description !== undefined && { description }),
        ...(provider !== undefined && { provider }),
        ...(contractStart !== undefined && { contractStart: new Date(contractStart) }),
        ...(contractEnd !== undefined && { contractEnd: new Date(contractEnd) }),
        ...(monthlyCost !== undefined && { monthlyCost }),
        ...(status !== undefined && { status }),
        ...(notes !== undefined && { notes }),
      },
    });

    res.json(updatedService);
  } catch (error: any) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
};

export const deleteService = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findFirst({
      where: { id, userId: req.userId },
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    await prisma.service.delete({ where: { id } });

    res.json({ message: 'Service deleted successfully' });
  } catch (error: any) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
};
