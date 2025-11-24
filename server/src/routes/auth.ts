import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { ValidationError } from '../middleware/errorHandler.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['learner', 'instructor', 'admin']).optional(),
});

// Role-based permissions mapping (from frontend RBAC)
const ROLE_PERMISSIONS: Record<string, string[]> = {
  learner: ['modules.read', 'assessments.read'],
  instructor: ['modules.read', 'assessments.read', 'assessments.write', 'analytics.read', 'content.approve'],
  admin: ['modules.read', 'modules.write', 'assessments.read', 'assessments.write', 'analytics.read', 'content.approve', 'admin.manage'],
};

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', authRateLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const { email, password } = loginSchema.parse(req.body);

    // TODO: Query database for user
    // For now, using mock authentication
    const mockUser = {
      id: 'user-001',
      email,
      name: 'Admin User',
      role: 'admin',
      passwordHash: await bcrypt.hash('password123', 12), // Mock password
    };

    // Verify password
    const isValidPassword = await bcrypt.compare(password, mockUser.passwordHash);
    if (!isValidPassword) {
      throw new ValidationError('Invalid email or password');
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const permissions = ROLE_PERMISSIONS[mockUser.role] || [];
    
    const token = jwt.sign(
      {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        permissions,
      },
      secret,
      {
        expiresIn: process.env.JWT_EXPIRY || '24h',
      } as jwt.SignOptions
    );

    res.json({
      success: true,
      token,
      user: {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        permissions,
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
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const { name, email, password, role = 'learner' } = registerSchema.parse(req.body);

    // Hash password
    const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || '12'));

    // TODO: Store user in database
    const mockUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      role,
      passwordHash,
    };

    // Generate JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const permissions = ROLE_PERMISSIONS[role] || [];
    
    const token = jwt.sign(
      {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        permissions,
      },
      secret,
      {
        expiresIn: process.env.JWT_EXPIRY || '24h',
      } as jwt.SignOptions
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        permissions,
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
 * POST /api/auth/logout
 * Logout user (client should delete token)
 */
router.post('/logout', authenticate, (_req: Request, res: Response) => {
  // In a stateless JWT system, logout is handled client-side
  // For session-based auth, we would destroy the session here
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    user: req.user,
  });
});

/**
 * SSO endpoints (placeholders for OIDC/SAML integration)
 */
router.get('/login/:provider', (req: Request, res: Response) => {
  const { provider } = req.params;
  
  // TODO: Implement OIDC/SAML redirect
  res.status(501).json({
    success: false,
    message: `SSO with ${provider} not yet implemented`,
  });
});

router.get('/callback', (_req: Request, res: Response) => {
  // TODO: Handle OIDC/SAML callback
  res.status(501).json({
    success: false,
    message: 'SSO callback not yet implemented',
  });
});

export default router;
