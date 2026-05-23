import mongoose, { Schema, Document } from 'mongoose';
import { Assignment, AssignmentStatus } from '../types';

export interface AssignmentDocument extends Omit<Assignment, '_id'>, Document {}

const AssignmentSchema = new Schema<AssignmentDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: String,
      required: [true, 'Due date is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'published', 'closed', 'grading'] satisfies AssignmentStatus[],
      default: 'pending',
    },
    totalMarks: {
      type: Number,
      min: 0,
    },
    subject: {
      type: String,
      trim: true,
    },
    grade: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
    },
    createdBy: {
      type: String, // will become ObjectId ref to User in a later stage
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for common query patterns
AssignmentSchema.index({ status: 1 });
AssignmentSchema.index({ createdAt: -1 });

export default mongoose.model<AssignmentDocument>('Assignment', AssignmentSchema);
