import { Queue } from 'bullmq';
import { getRedisClient } from '../config/redis';

// Create a new BullMQ Queue
export const assessmentQueue = new Queue('assessment-queue', {
  connection: getRedisClient(),
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const addAssessmentJob = async (assignmentId: string, payload: any) => {
  return assessmentQueue.add('generate-assessment', {
    assignmentId,
    payload,
  });
};
