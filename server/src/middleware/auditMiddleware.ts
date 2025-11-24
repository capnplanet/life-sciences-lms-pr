import { Request, Response, NextFunction } from 'express';
import { auditLogger } from '../utils/logger.js';

/**
 * Audit middleware for GxP compliance (21 CFR Part 11, GAMP 5)
 * Logs all requests to immutable audit trail
 */
export const auditMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Only audit API endpoints, skip health checks and static files
  if (!req.path.startsWith('/api/') || req.path === '/api/health') {
    return next();
  }

  const auditEntry = {
    timestamp: new Date().toISOString(),
    action: `${req.method} ${req.path}`,
    userId: (req as any).user?.id || 'anonymous',
    userName: (req as any).user?.name || 'anonymous',
    ip: req.ip,
    userAgent: req.get('user-agent'),
    sessionId: (req as any).sessionId,
    // Redact sensitive data
    body: sanitizeBody(req.body),
    query: req.query,
  };

  // Log audit entry
  auditLogger.info('API Request', auditEntry);

  // Capture response status
  res.on('finish', () => {
    auditLogger.info('API Response', {
      ...auditEntry,
      statusCode: res.statusCode,
      timestamp: new Date().toISOString(),
    });
  });

  next();
};

/**
 * Sanitize request body to remove sensitive information from audit logs
 */
function sanitizeBody(body: any): any {
  if (!body) return body;

  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'privateKey'];

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}
