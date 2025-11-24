import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/user
 * Get current user profile
 */
router.get('/', authenticate, (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    user: {
      id: req.user!.id,
      email: req.user!.email,
      role: req.user!.role,
      permissions: req.user!.permissions,
    },
  });
});

/**
 * GET /api/user/profile
 * Get detailed user profile with progress
 */
router.get('/profile', authenticate, (req: AuthRequest, res: Response) => {
  // TODO: Fetch from database
  const mockProfile = {
    id: req.user!.id,
    name: 'Admin User',
    email: req.user!.email,
    role: req.user!.role,
    permissions: req.user!.permissions,
    enrolledCourses: [],
    completedModules: [],
    certifications: [],
    preferences: {
      notifications: true,
      emailDigest: false,
      playbackSpeed: 1.0,
      subtitles: true,
    },
  };

  res.json({
    success: true,
    profile: mockProfile,
  });
});

export default router;
