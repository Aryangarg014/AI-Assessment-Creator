import { Request, Response } from 'express';
import AssignmentModel from '../models/Assignment';
import QuestionPaperModel from '../models/QuestionPaper';

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

/**
 * POST /api/assignments
 * Creates a new assignment with 'pending' status and queues a job.
 */
import { addAssessmentJob } from '../queues/assessmentQueue';
import cloudinary from '../config/cloudinary';

const uploadToCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

export const createAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, dueDate, additionalInfo, uploadedFileName } = req.body;
    let { questionTypes } = req.body;

    // questionTypes comes as a JSON string because of FormData
    if (typeof questionTypes === 'string') {
      try {
        questionTypes = JSON.parse(questionTypes);
      } catch (e) {
        questionTypes = [];
      }
    }

    // Upload file if it exists
    let fileUrl: string | undefined;
    if (req.file) {
      fileUrl = await uploadToCloudinary(req.file.buffer);
    }

    // Calculate total marks from questionTypes
    let totalMarks = 0;
    if (Array.isArray(questionTypes)) {
      totalMarks = questionTypes.reduce((sum, q) => sum + (q.count * q.marks), 0);
    }

    // 1. Create Assignment in DB
    const newAssignment = await AssignmentModel.create({
      title: title || uploadedFileName || 'Untitled Assignment',
      dueDate,
      description: additionalInfo,
      status: 'pending',
      totalMarks,
      fileUrl,
      // For now, hardcode a subject/grade or leave empty since UI doesn't collect it yet
    });

    // 2. Queue the BullMQ job
    await addAssessmentJob(newAssignment._id.toString(), {
      ...req.body,
      questionTypes,
      fileUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Assignment created and job queued successfully',
      assignmentId: newAssignment._id,
    });
  } catch (err) {
    console.error('[assignmentController] createAssignment error:', (err as Error).message);
    res.status(500).json({
      success: false,
      message: 'Failed to create assignment',
    });
  }
};

/**
 * GET /api/assignments/:id/result
 * Fetches the assignment and its generated QuestionPaper
 */
export const getAssignmentResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const assignment = await AssignmentModel.findById(id).lean();
    if (!assignment) {
      res.status(404).json({ success: false, message: 'Assignment not found' });
      return;
    }

    const questionPaper = await QuestionPaperModel.findOne({ assignmentId: id }).lean();

    res.status(200).json({
      success: true,
      data: {
        assignment,
        questionPaper,
      },
    });
  } catch (err) {
    console.error('[assignmentController] getAssignmentResult error:', (err as Error).message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignment result',
    });
  }
};

/**
 * DELETE /api/assignments/:id
 * Deletes the assignment and its associated question paper.
 */
export const deleteAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedAssignment = await AssignmentModel.findByIdAndDelete(id);
    if (!deletedAssignment) {
      res.status(404).json({ success: false, message: 'Assignment not found' });
      return;
    }

    // Also delete the associated question paper
    await QuestionPaperModel.findOneAndDelete({ assignmentId: id });

    res.status(200).json({
      success: true,
      message: 'Assignment and associated question paper deleted successfully',
    });
  } catch (err) {
    console.error('[assignmentController] deleteAssignment error:', (err as Error).message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete assignment',
    });
  }
};

