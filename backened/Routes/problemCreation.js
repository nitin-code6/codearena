const express=require('express');
const adminMiddleware=require('../MiddleWare/adminMiddleware')

const problemRouter=express.Router();
const createProblem=require('../controllers/userproblem');
console.trace(createProblem);
problemRouter.post('/create',adminMiddleware,createProblem);
// problemRouter.patch('/:id',updateProblem);
// problemRouter.delete('/:id',deleteProblem);

// problemRouter.get('/:id',getProblemById);
// problemRouter.get('/',getAllProblem);
// problemRouter.get('/user',solvedAllProblemByUser);


module.exports=problemRouter;