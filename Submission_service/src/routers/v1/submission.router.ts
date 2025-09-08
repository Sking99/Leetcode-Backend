import express from 'express';
import {  validateQueryParams, validateRequestBody } from '../../validators';
import { createSubmissionValidator, submissionQuerySchema, updateSubmissionStatusSchema } from '../../validators/submission.validator';
import { SubmissionFactory } from '../../factories/submission.factories';

const submissionRouter = express.Router();

// Get submission controller instance from factory
const submissionController = SubmissionFactory.getSubmissionController();

submissionRouter.post('/', validateRequestBody(createSubmissionValidator), submissionController.createSubmission);


// GET /submissions/:id - Get submission by ID
submissionRouter.get(
    '/:id', 
    submissionController.getSubmissionById
);

// GET /submissions/problem/:problemId - Get all submissions for a problem
submissionRouter.get(
    '/problem/:problemId', 
    validateQueryParams(submissionQuerySchema),
    submissionController.getSubmissionsByProblemId
);

// DELETE /submissions/:id - Delete a submission
submissionRouter.delete(
    '/:id', 
    submissionController.deleteSubmissionById
);

// PATCH /submissions/:id/status - Update submission status
submissionRouter.patch(
    '/:id/status', 
    validateRequestBody(updateSubmissionStatusSchema),
    submissionController.updateSubmissionStatus
);


export default submissionRouter;