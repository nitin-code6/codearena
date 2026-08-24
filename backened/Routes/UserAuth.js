const express=require('express');
const authRouter=express.Router();
const userMiddleware=require('../MiddleWare/UserMiddleware');
const adminMiddleware=require('../MiddleWare/adminMiddleware')
const {register,login,logout,adminRegister,getProfile,deleteProfile}=require('../controllers/userAuthentication')

// console.log('Iam in user auth');

const rateLimiter = require('../MiddleWare/rateLimiter');

// Register (Rate limited to 10 requests per hour per IP)
authRouter.post('/register', rateLimiter('auth:register', 10, 3600), register);

// Login (Rate limited to 5 requests per minute per IP/Email)
authRouter.post('/login', rateLimiter('auth:login', 5, 60), login);
// // Logout
authRouter.post('/logout',userMiddleware,logout);
// // admin Register
authRouter.post('/admin/register',adminMiddleware,adminRegister);
// // GetProfile
authRouter.get('/getProfile',userMiddleware,getProfile);
// delete profile
authRouter.delete('/delete',userMiddleware,deleteProfile);
authRouter.get('/check',userMiddleware,(req,res)=>{
console.log("Inside check",req.result);
    const reply = {
        firstName: req.result.firstName,
        emailId: req.result.emailId,
        _id:req.result._id
    }

    res.status(200).json({
        user:reply,
        message:"Valid User"
    });
})
module.exports =authRouter;

