const express=require('express');
const adminMiddleware=require('../MiddleWare/adminMiddleware')

const problemRouter=express.Router();
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem}=require('../controllers/userproblem');

problemRouter.post('/create',adminMiddleware,createProblem);
problemRouter.put('update/:id',adminMiddleware,updateProblem);
problemRouter.delete('/:id',adminMiddleware,deleteProblem);

problemRouter.get('/GetProblem/:id',getProblemById);
problemRouter.get('/getAllproblems',getAllProblem);
// problemRouter.get('/user',solvedAllProblemByUser);


module.exports=problemRouter;