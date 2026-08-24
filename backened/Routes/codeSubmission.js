const express = require('express');
const submitRouter = express.Router();
const userMiddleware = require('../MiddleWare/UserMiddleware');
const { SubmitCode, RunCode, checkSubmissionStatus, streamSubmissionStatus } = require('../controllers/userSubmission');

submitRouter.post('/submit/:id', userMiddleware, SubmitCode);
submitRouter.post('/run/:id', userMiddleware, RunCode);
submitRouter.get('/status/:idempotencyKey', checkSubmissionStatus);
submitRouter.get('/stream/:idempotencyKey', streamSubmissionStatus);

module.exports = submitRouter;