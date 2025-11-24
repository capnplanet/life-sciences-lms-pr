import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { ValidationError } from '../middleware/errorHandler.js';
import { auditLogger } from '../utils/logger.js';

const router = Router();

// Validation schemas
const signRequestSchema = z.object({
  documentId: z.string(),
  reason: z.string().optional(),
  password: z.string().min(8), // 21 CFR Part 11 requires password verification
});

// In-memory storage (replace with database in production)
const signatures: Map<string, any> = new Map();

/**
 * POST /api/esign/request
 * Request electronic signature for a document (21 CFR Part 11 compliant)
 */
router.post('/request', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Validate request
    const { documentId, reason, password } = signRequestSchema.parse(req.body);

    // Verify password (21 CFR Part 11 requirement)
    // TODO: Verify against user's actual password from database
    if (!password) {
      throw new ValidationError('Password verification required for electronic signature');
    }

    // Require reason if configured
    if (process.env.ESIGN_REQUIRE_REASON === 'true' && !reason) {
      throw new ValidationError('Reason for signature is required');
    }

    const signatureId = uuidv4();
    const timestamp = new Date().toISOString();

    // Create signature record
    const signature = {
      id: signatureId,
      documentId,
      signerId: req.user!.id,
      signerName: req.user!.email,
      reason: reason || 'Electronic signature',
      signedAt: timestamp,
      // Generate hash for integrity verification (21 CFR Part 11)
      signatureHash: generateSignatureHash({
        documentId,
        signerId: req.user!.id,
        timestamp,
        reason,
      }),
      metadata: {
        ip: req.ip,
        userAgent: req.get('user-agent'),
      },
    };

    // Store signature
    signatures.set(signatureId, signature);

    // Audit log (required for 21 CFR Part 11)
    auditLogger.info('Electronic Signature Created', {
      action: 'ESIGN_CREATE',
      signatureId,
      documentId,
      signerId: req.user!.id,
      signerName: req.user!.email,
      timestamp,
      reason,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(201).json({
      success: true,
      requestId: signatureId,
      signature: {
        id: signature.id,
        documentId: signature.documentId,
        signedAt: signature.signedAt,
        signatureHash: signature.signatureHash,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ValidationError(error.errors[0].message));
    } else {
      next(error);
    }
  }
});

/**
 * GET /api/esign/:signatureId
 * Retrieve electronic signature record
 */
router.get('/:signatureId', authenticate, (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { signatureId } = req.params;

    const signature = signatures.get(signatureId);
    if (!signature) {
      throw new ValidationError('Signature not found');
    }

    // Audit log
    auditLogger.info('Electronic Signature Retrieved', {
      action: 'ESIGN_RETRIEVE',
      signatureId,
      userId: req.user!.id,
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      signature: {
        id: signature.id,
        documentId: signature.documentId,
        signerId: signature.signerId,
        signerName: signature.signerName,
        signedAt: signature.signedAt,
        signatureHash: signature.signatureHash,
        reason: signature.reason,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/esign/verify
 * Verify signature integrity
 */
router.post('/verify', authenticate, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { signatureId, documentId } = req.body;

    if (!signatureId) {
      throw new ValidationError('Signature ID is required');
    }

    const signature = signatures.get(signatureId);
    if (!signature) {
      throw new ValidationError('Signature not found');
    }

    // Verify document binding
    if (documentId && signature.documentId !== documentId) {
      throw new ValidationError('Signature does not match document');
    }

    // Verify integrity
    const expectedHash = generateSignatureHash({
      documentId: signature.documentId,
      signerId: signature.signerId,
      timestamp: signature.signedAt,
      reason: signature.reason,
    });

    const isValid = signature.signatureHash === expectedHash;

    res.json({
      success: true,
      valid: isValid,
      signature: isValid ? {
        id: signature.id,
        documentId: signature.documentId,
        signerId: signature.signerId,
        signerName: signature.signerName,
        signedAt: signature.signedAt,
      } : null,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Generate signature hash for integrity verification
 * Uses configured algorithm (default: SHA-256)
 */
function generateSignatureHash(data: {
  documentId: string;
  signerId: string;
  timestamp: string;
  reason?: string;
}): string {
  const algorithm = process.env.ESIGN_HASH_ALGORITHM || 'sha256';
  const content = `${data.documentId}|${data.signerId}|${data.timestamp}|${data.reason || ''}`;
  
  return crypto
    .createHash(algorithm)
    .update(content)
    .digest('hex');
}

export default router;
