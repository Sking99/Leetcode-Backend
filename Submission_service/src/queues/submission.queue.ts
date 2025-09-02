import { Queue } from "bullmq";
import { createNewRedisConnection } from "../config/redis.config";
import logger from "../config/logger.config";

export const SUBMISSION_QUEUE_NAME = 'submission-queue';

export const submissionQueue = new Queue(SUBMISSION_QUEUE_NAME, {
    connection: createNewRedisConnection(),
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 2000
        }
    }
});

submissionQueue.on("error", (error) => {
    logger.error(`Submission queue error: ${error}`);
});

submissionQueue.on("waiting", (job) => {
    logger.info(`Submission job waiting: ${job.id}`);
});