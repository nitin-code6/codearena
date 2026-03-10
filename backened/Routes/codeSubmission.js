const express=require('express');


const submitRouter=express.Router();

const userMiddleware = require('../MiddleWare/UserMiddleware');
const {SubmitCode,RunCode}=require('../controllers/userSubmission');



submitRouter.post('/submit/:id',userMiddleware,SubmitCode);
submitRouter.post('/run/:id',userMiddleware,RunCode);

module.exports=submitRouter;