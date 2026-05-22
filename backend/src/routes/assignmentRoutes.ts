import { Router } from 'express';
import { getAllAssignments } from '../controllers/assignmentController';

const router = Router();

// GET /api/assignments
router.get('/', getAllAssignments);

export default router;
