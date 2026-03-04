const express=require('express');
const problemRouter=express.Router();

problemRouter.post('/create',createProblem);
problemRouter.patch('/:id',updateProblem);
problemRouter.delete('/:id',deleteProblem);

problemRouter.get('/:id',getProblemById);
problemRouter.get('/',getAllProblem);
problemRouter.get('/user',solvedAllProblemByUser);


module.exports=problemRouter;