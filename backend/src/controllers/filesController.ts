import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../config/database';
import { uploadFile, deleteFile } from '../services/fileService';

export const getFiles = async (req: AuthRequest, res: Response) => {
  try {
    const { referenceType, referenceId, fileType } = req.query;

    const where: any = { userId: req.userId };

    if (referenceType) {
      where.referenceType = referenceType as string;
    }

    if (referenceId) {
      where.referenceId = referenceId as string;
    }

    if (fileType) {
      where.fileType = fileType as string;
    }

    const files = await prisma.file.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(files);
  } catch (error: any) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Failed to get files' });
  }
};

export const getFile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const file = await prisma.file.findFirst({
      where: { id, userId: req.userId },
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json(file);
  } catch (error: any) {
    console.error('Get file error:', error);
    res.status(500).json({ error: 'Failed to get file' });
  }
};

export const uploadFileHandler = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { referenceType, referenceId } = req.body;

    const file = await uploadFile({
      userId: req.userId!,
      referenceType,
      referenceId,
      file: req.file,
    });

    res.status(201).json(file);
  } catch (error: any) {
    console.error('Upload file error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

export const deleteFileHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await deleteFile(id, req.userId!);

    res.json({ message: 'File deleted successfully' });
  } catch (error: any) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete file' });
  }
};
