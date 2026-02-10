import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../config/database';
import { encrypt, decrypt, generatePassword } from '../services/encryptionService';

export const getPasswords = async (req: AuthRequest, res: Response) => {
  try {
    const { category, search } = req.query;

    const where: any = { userId: req.userId };

    if (category) {
      where.category = category as string;
    }

    if (search) {
      where.OR = [
        { serviceName: { contains: search as string, mode: 'insensitive' } },
        { username: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const passwords = await prisma.password.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        serviceName: true,
        username: true,
        email: true,
        url: true,
        category: true,
        createdAt: true,
        updatedAt: true,
        // Do not return encrypted password in list
      },
    });

    res.json(passwords);
  } catch (error: any) {
    console.error('Get passwords error:', error);
    res.status(500).json({ error: 'Failed to get passwords' });
  }
};

export const getPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const password = await prisma.password.findFirst({
      where: { id, userId: req.userId },
    });

    if (!password) {
      return res.status(404).json({ error: 'Password not found' });
    }

    // Decrypt password before sending
    const decryptedPassword = decrypt(password.passwordEncrypted);

    res.json({
      ...password,
      password: decryptedPassword,
      passwordEncrypted: undefined,
    });
  } catch (error: any) {
    console.error('Get password error:', error);
    res.status(500).json({ error: 'Failed to get password' });
  }
};

export const createPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { serviceName, username, email, password, url, notes, category } = req.body;

    if (!serviceName || !password) {
      return res.status(400).json({ error: 'Service name and password are required' });
    }

    // Encrypt password
    const passwordEncrypted = encrypt(password);

    const passwordRecord = await prisma.password.create({
      data: {
        userId: req.userId!,
        serviceName,
        username,
        email,
        passwordEncrypted,
        url,
        notes,
        category,
      },
      select: {
        id: true,
        serviceName: true,
        username: true,
        email: true,
        url: true,
        category: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json(passwordRecord);
  } catch (error: any) {
    console.error('Create password error:', error);
    res.status(500).json({ error: 'Failed to create password' });
  }
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { serviceName, username, email, password, url, notes, category } = req.body;

    const existingPassword = await prisma.password.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingPassword) {
      return res.status(404).json({ error: 'Password not found' });
    }

    const updateData: any = {};

    if (serviceName !== undefined) updateData.serviceName = serviceName;
    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;
    if (url !== undefined) updateData.url = url;
    if (notes !== undefined) updateData.notes = notes;
    if (category !== undefined) updateData.category = category;

    // Encrypt new password if provided
    if (password) {
      updateData.passwordEncrypted = encrypt(password);
    }

    const updatedPassword = await prisma.password.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        serviceName: true,
        username: true,
        email: true,
        url: true,
        category: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(updatedPassword);
  } catch (error: any) {
    console.error('Update password error:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
};

export const deletePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const password = await prisma.password.findFirst({
      where: { id, userId: req.userId },
    });

    if (!password) {
      return res.status(404).json({ error: 'Password not found' });
    }

    await prisma.password.delete({ where: { id } });

    res.json({ message: 'Password deleted successfully' });
  } catch (error: any) {
    console.error('Delete password error:', error);
    res.status(500).json({ error: 'Failed to delete password' });
  }
};

export const generateNewPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { length } = req.query;
    const passwordLength = length ? parseInt(length as string) : 16;

    const password = generatePassword(passwordLength);

    res.json({ password });
  } catch (error: any) {
    console.error('Generate password error:', error);
    res.status(500).json({ error: 'Failed to generate password' });
  }
};
