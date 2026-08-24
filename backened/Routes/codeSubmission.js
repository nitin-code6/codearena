const express = require('express');
const submitRouter = express.Router();
const userMiddleware = require('../MiddleWare/UserMiddleware');
const submissionRateLimiter = require('../MiddleWare/submissionRateLimiter');
const { SubmitCode, RunCode, checkSubmissionStatus, streamSubmissionStatus } = require('../controllers/userSubmission');

submitRouter.post('/submit/:id', userMiddleware, submissionRateLimiter, SubmitCode);
submitRouter.post('/run/:id', userMiddleware, submissionRateLimiter, RunCode);
submitRouter.get('/status/:idempotencyKey', checkSubmissionStatus);
submitRouter.get('/stream/:idempotencyKey', streamSubmissionStatus);

module.exports = submitRouter;