import { Request, Response } from 'express';

/**
 * GET /api/health
 * Returns a JSON success message confirming the API is running.
 */
export const healthCheck = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: 'API is healthy and running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
};
