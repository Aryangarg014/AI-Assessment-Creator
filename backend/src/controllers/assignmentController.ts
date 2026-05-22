import { Request, Response } from 'express';
import AssignmentModel from '../models/Assignment';

/**
 * GET /api/assignments
 * Returns all assignments sorted by newest first.
 */
export const getAllAssignments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const assignments = await AssignmentModel.find().sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (err) {
    console.error('[assignmentController] getAllAssignments error:', (err as Error).message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignments',
    });
  }
};
