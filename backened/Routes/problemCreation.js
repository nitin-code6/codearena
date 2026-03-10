const express=require('express');
const adminMiddleware=require('../MiddleWare/adminMiddleware');
// console.log('I am in problemcreation');
const problemRouter=express.Router();
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblemByUser}=require('../controllers/userproblem');
const userMiddleware = require('../MiddleWare/UserMiddleware');

problemRouter.post('/create',adminMiddleware,createProblem);
problemRouter.put('/update/:id',adminMiddleware,updateProblem);
problemRouter.delete('/delete/:id',adminMiddleware,deleteProblem);

problemRouter.get('/GetProblem/:id',userMiddleware,getProblemById);
problemRouter.get('/getAllproblems',userMiddleware,getAllProblem);
console.log('solved all prblm by user',typeof solvedAllProblemByUser);
problemRouter.get('/user',userMiddleware,solvedAllProblemByUser);

module.exports=problemRouter;