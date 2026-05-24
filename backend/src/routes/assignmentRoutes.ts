import { Router } from 'express';
import multer from 'multer';
import { getAllAssignments, createAssignment, getAssignmentResult, deleteAssignment } from '../controllers/assignmentController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// GET /api/assignments
router.get('/', getAllAssignments);

// GET /api/assignments/:id/result
router.get('/:id/result', getAssignmentResult);

// POST /api/assignments
router.post('/', upload.single('file'), createAssignment);

// DELETE /api/assignments/:id
router.delete('/:id', deleteAssignment);

export default router;
