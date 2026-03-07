const express=require('express');
const authRouter=express.Router();
const userMiddleware=require('../MiddleWare/UserMiddleware');
const adminMiddleware=require('../MiddleWare/adminMiddleware')
const {register,login,logout,adminRegister,getProfile}=require('../controllers/userAuthentication')



// Register
authRouter.post('/register',register);

// Login
authRouter.post('/login',login);
// // Logout
authRouter.post('/logout',userMiddleware,logout);
// // admin Register
authRouter.post('/admin/register',adminMiddleware,adminRegister);
// // GetProfile
authRouter.get('/getProfile',userMiddleware,getProfile);

module.exports =authRouter;

