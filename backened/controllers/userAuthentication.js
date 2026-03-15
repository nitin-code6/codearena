const redis_client = require('../config/redis');
const User=require('../Model/user');
const submission=require('../Model/Submission');
const validate=require('../utils/validator');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');

const register=async (req,res)=>{
    
    try{
        validate(req.body);
        const {firstName,emailId,password}=req.body;
        // password Hashing
        req.body.password= await bcrypt.hash(password,10);
        req.body.role="user";
        const user=await User.create(req.body);
        const token = jwt.sign({ id:user._id,emailId:emailId }, process.env.JWT_SECRET,{expiresIn:60*60});
        const reply = {
        firstName: user.firstName,
        emailId: user.emailId,
        _id: user._id
    }
        res.cookie('token',token,{maxAge:60*60*1000});
         res.status(201).json({
        user:reply,
        message:"Registered Successfully"
    })
    }
    catch(err){
     res.status(400).send("Error "+err);
    }
   
}

const login=async (req,res)=>{
    try{ 
    const {emailId,password}=req.body;
    if(!emailId) throw new Error("Invalid Credentials");
    if(!password) throw new Error("Invalid Credentials");
    const user = await User.findOne({ emailId });
    if (!user) {
 throw new Error("Invalid Credentials");
   }
  

     const match=await bcrypt.compare(password,user.password );

       if (!match) {
  throw new Error("Invalid Credentials");
   }
   const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id
        }

     const token = jwt.sign({ id:user.id,emailId:emailId }, process.env.JWT_SECRET,{expiresIn:60*60});
        res.cookie('token',token,{maxAge:60*60*1000});
         res.status(201).json({
            user:reply,
            message:"Loggin Successfully"
        })
}
catch(err){
    res.status(200).send("Error"+err);
}

}

const logout=async(req,res)=>{
    try{
        const {token}=req.cookies;
        const payload=jwt.decode(token);
        await redis_client.set(`token:${token}`,"Blocked");
        await redis_client.expireAt(`token:${token}`,payload.exp);
        res.cookie("token",null,{expires: new Date(Date.now())});
        res.send("logged out Successfully");
    }
    catch(err){
           res.status(503).send('logoutError: '+err);
    }
}


const adminRegister=async (req,res)=>{
 
    try{
        validate(req.body);
        const {firstName,emailId,password}=req.body;
        // password Hashing
        req.body.password= await bcrypt.hash(password,10);
        req.body.role="admin";
        
        const user=await User.create(req.body);
        const token = jwt.sign({ id:user._id,emailId:emailId,role:'admin' }, process.env.JWT_SECRET,{expiresIn:60*60});
        res.cookie('token',token,{maxAge:60*60*1000});
        res.status(201).send("User registered Succesfully");
    }
    catch(err){
     res.status(400).send("Error "+err);
    }
   
}

const getProfile = async (req, res) => {
  try {
    const user = req.result;   // already authenticated user

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    res.status(200).send({
      firstname: user.firstname,
      lastname: user.lastname,
      emailId: user.emailId,
      problemSolved: user.problemSolved
    });

  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
};
const deleteProfile = async (req, res) => {
  try {
    const userId=req.result._id;
    // User Schema Delete
    await User.findByIdAndDelete(userId);
    // Submission se bhi delete
    await Submission.deleteMany({userId});
    res.status(200).send("Deleted Successfully");
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
};


module.exports={register,login,logout,adminRegister,getProfile,deleteProfile};