import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuditLogData {
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, any>;
}

/**
 * Middleware to log actions for audit purposes
 */
export const auditLog = (action: string, entityType?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);

    res.json = function (body: any) {
      // Log after response is sent (non-blocking)
      setImmediate(async () => {
        try {
          const userId = req.user?.id;
          const entityId = req.params.id || body?.id;

          await prisma.$executeRaw`
            INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, metadata)
            VALUES (
              ${userId || null}::uuid,
              ${action},
              ${entityType || null},
              ${entityId || null}::uuid,
              ${req.ip || 'unknown'},
              ${req.get('user-agent') || 'unknown'},
              ${JSON.stringify({
                method: req.method,
                path: req.path,
                statusCode: res.statusCode,
                body: sanitizeBody(req.body),
              })}::jsonb
            )
          `;
        } catch (error) {
          console.error('Audit log error:', error);
        }
      });

      return originalJson(body);
    };

    next();
  };
};

/**
 * Sanitize request body to remove sensitive data
 */
function sanitizeBody(body: any): any {
  if (!body) return {};

  const sanitized = { ...body };
  const sensitiveFields = ['password', 'passwordHash', 'token', 'secret', 'pin'];

  sensitiveFields.forEach((field) => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });

  return sanitized;
}

/**
 * Get audit logs for a user
 */
export const getUserAuditLogs = async (
  userId: string,
  limit: number = 50,
  offset: number = 0
) => {
  const logs = await prisma.$queryRaw`
    SELECT id, action, entity_type, entity_id, ip_address, created_at, metadata
    FROM audit_logs
    WHERE user_id = ${userId}::uuid
    ORDER BY created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return logs;
};

/**
 * Get all audit logs (admin only)
 */
export const getAllAuditLogs = async (
  limit: number = 100,
  offset: number = 0,
  filters?: {
    userId?: string;
    action?: string;
    entityType?: string;
    startDate?: Date;
    endDate?: Date;
  }
) => {
  let query = 'SELECT * FROM audit_logs WHERE 1=1';
  const params: any[] = [];

  if (filters?.userId) {
    params.push(filters.userId);
    query += ` AND user_id = $${params.length}::uuid`;
  }

  if (filters?.action) {
    params.push(filters.action);
    query += ` AND action = $${params.length}`;
  }

  if (filters?.entityType) {
    params.push(filters.entityType);
    query += ` AND entity_type = $${params.length}`;
  }

  if (filters?.startDate) {
    params.push(filters.startDate);
    query += ` AND created_at >= $${params.length}`;
  }

  if (filters?.endDate) {
    params.push(filters.endDate);
    query += ` AND created_at <= $${params.length}`;
  }

  params.push(limit);
  params.push(offset);
  query += ` ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

  return await prisma.$queryRawUnsafe(query, ...params);
};
