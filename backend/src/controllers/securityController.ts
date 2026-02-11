import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as twoFactorService from '../services/twoFactorService';
import { getUserAuditLogs } from '../middleware/auditLogMiddleware';

const prisma = new PrismaClient();

/**
 * Enable 2FA for user
 */
export const enable2FA = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    // Generate secret and backup codes
    const secret = twoFactorService.generateSecret();
    const backupCodes = twoFactorService.generateBackupCodes();

    // Get user email for QR code
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate QR code data
    const qrCodeData = twoFactorService.generateQRCodeData(secret, user.email);

    // Store secret (not enabled yet, user must verify first)
    await prisma.$executeRaw`
      UPDATE users
      SET two_factor_secret = ${secret}
      WHERE id = ${userId}::uuid
    `;

    res.json({
      success: true,
      data: {
        secret,
        qrCodeData,
        backupCodes,
      },
    });
  } catch (error) {
    console.error('Enable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Error enabling 2FA',
    });
  }
};

/**
 * Verify and activate 2FA
 */
export const verify2FA = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { token, backupCodes } = req.body;

    const user: any = await prisma.$queryRaw`
      SELECT two_factor_secret
      FROM users
      WHERE id = ${userId}::uuid
    `;

    if (!user || !user[0]?.two_factor_secret) {
      return res.status(400).json({
        success: false,
        message: '2FA not initialized',
      });
    }

    // Verify token
    const isValid = twoFactorService.verifyToken(token, user[0].two_factor_secret);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
      });
    }

    // Activate 2FA
    await prisma.$executeRaw`
      UPDATE users
      SET two_factor_enabled = true,
          backup_codes = ${backupCodes}::text[]
      WHERE id = ${userId}::uuid
    `;

    res.json({
      success: true,
      message: '2FA enabled successfully',
    });
  } catch (error) {
    console.error('Verify 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying 2FA',
    });
  }
};

/**
 * Disable 2FA
 */
export const disable2FA = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { password } = req.body;

    // Verify password before disabling
    // (Password verification should be added here)

    await prisma.$executeRaw`
      UPDATE users
      SET two_factor_enabled = false,
          two_factor_secret = NULL,
          backup_codes = NULL
      WHERE id = ${userId}::uuid
    `;

    res.json({
      success: true,
      message: '2FA disabled successfully',
    });
  } catch (error) {
    console.error('Disable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Error disabling 2FA',
    });
  }
};

/**
 * Get user's audit logs
 */
export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const logs = await getUserAuditLogs(userId, limit, offset);

    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching audit logs',
    });
  }
};

/**
 * Get security summary for user
 */
export const getSecuritySummary = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const user: any = await prisma.$queryRaw`
      SELECT two_factor_enabled, created_at
      FROM users
      WHERE id = ${userId}::uuid
    `;

    const recentLogs: any = await prisma.$queryRaw`
      SELECT COUNT(*) as count, MAX(created_at) as last_activity
      FROM audit_logs
      WHERE user_id = ${userId}::uuid
      AND created_at >= NOW() - INTERVAL '7 days'
    `;

    res.json({
      success: true,
      data: {
        twoFactorEnabled: user[0]?.two_factor_enabled || false,
        accountCreated: user[0]?.created_at,
        recentActivityCount: parseInt(recentLogs[0]?.count || '0'),
        lastActivity: recentLogs[0]?.last_activity,
      },
    });
  } catch (error) {
    console.error('Get security summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching security summary',
    });
  }
};
