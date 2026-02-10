import { uploadToS3, deleteFromS3 } from '../config/s3';
import prisma from '../config/database';

export interface FileUploadData {
  userId: string;
  referenceType?: string;
  referenceId?: string;
  file: Express.Multer.File;
}

export const uploadFile = async (data: FileUploadData) => {
  const { userId, referenceType, referenceId, file } = data;

  // Upload to S3
  const fileUrl = await uploadToS3(file, referenceType || 'general');

  // Save to database
  const fileRecord = await prisma.file.create({
    data: {
      userId,
      referenceType,
      referenceId,
      fileName: file.originalname,
      fileType: getFileType(file.mimetype),
      fileUrl,
      fileSize: BigInt(file.size),
      mimeType: file.mimetype,
    },
  });

  return fileRecord;
};

export const deleteFile = async (fileId: string, userId: string) => {
  const file = await prisma.file.findFirst({
    where: { id: fileId, userId },
  });

  if (!file) {
    throw new Error('File not found');
  }

  // Delete from S3
  await deleteFromS3(file.fileUrl);

  // Delete from database
  await prisma.file.delete({
    where: { id: fileId },
  });

  return true;
};

export const getFilesByReference = async (
  userId: string,
  referenceType: string,
  referenceId: string
) => {
  return await prisma.file.findMany({
    where: {
      userId,
      referenceType,
      referenceId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const getFileType = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf')) return 'document';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'document';
  return 'other';
};
