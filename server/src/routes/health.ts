import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Health check endpoint
 * Used by load balancers and monitoring systems
 */
router.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

/**
 * Detailed health check with dependencies
 */
router.get('/detailed', async (_req: Request, res: Response) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      database: 'healthy', // TODO: Add actual DB health check
      redis: 'healthy', // TODO: Add actual Redis health check
      ai: process.env.AI_PROVIDER || 'none',
    },
  };

  res.json(health);
});

export default router;
