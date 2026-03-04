const jwt = require('jsonwebtoken');
const User = require('../model/user');
const redis_client=require('../config/redis');
const adminMiddleware=async (req,res,next)=>{

    try{
       const {token}=req.cookies;
       if(!token) throw new Error("Token is not present");
       const  payload=jwt.verify(token, process.env.JWT_SECRET);
       
       const {emailId}=payload;
       console.log(emailId);
       if(!emailId) throw new Error('Invalid token');
       const result=await User.findOne({emailId});
       if(!result) throw new Error("User Doesn't Exists");
       if(!payload.role=='admin') throw new Error('Invalid Token');
       const IsBlocked=await  redis_client.exists(`token:${token}`);
        if(IsBlocked) throw new Error('Invalid token');
        req.result=result;
        next();
    }
    catch(err){
        res.status(401).send('Error: '+err.message);
    }

};


module.exports=adminMiddleware;