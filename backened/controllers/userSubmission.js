const Submission=require('../Model/Submission');
const Problem=require('../Model/Problem');
const mongoose = require("mongoose");
const {submitBatch,submitToken, getLanguageByiD } = require('../utils/Problemutility');

const SubmitCode=async (req,res)=>{
    try {
    
    const userId=req.result._id;
    const {id}=req.params;
   
    const problemId=id;
    const {code,language}=req.body;
    if(!userId||!problemId||!code||!language) 
       return res.status(400).send("Some field Missing");
    // fetch the problem from data 
    console.log("problemId",problemId);
    console.log("problemId",typeof problemId);
    if(!mongoose.Types.ObjectId.isValid(problemId))
   return res.status(400).send("Invalid Problem ID");

    const problem=await Problem.findById(problemId);
    // HIDDEN TEST CASES
     
    const submittedResult=await Submission.create(
        {
            userId,problemId, code,language,status:'pending',testCasesPassed:0
        }
    )
        const languageId = getLanguageByiD(language);
    const submissions = problem.HiddenTestCases.map((testcase)=>({
            source_code:code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));
        
        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((value)=> value.token);
         const testResult = await submitToken(resultToken);

        
  
         let testCasesPassed=0;
         let runtime=0;
         let memory=0;
         let status=null;
        let errorMessage=null;
         for(const test of testResult) {
        if(test.status_id==3){ 
                testCasesPassed++;
            runtime=runtime+parseFloat(test.time);
            memory=Math.max(memory,test.memory);
         }
         else { 
            if(test.status_id==4)
            {
                status='error';
                errorMessage=test.stderr;

            }
            else {status='wrong';
              errorMessage=test.stderr;
            }
         }
}        
          submittedResult.status=status;
          submittedResult.testCasesPassed=testCasesPassed;
          submittedResult.errorMessage=errorMessage;
          submittedResult.runtime=runtime;
          submittedResult.memory=memory;
          await submittedResult.save();
        //   ProblemId ko insert krenge userSchema ke problemSolved mein if it is not present there
              console.log("problemId",problemID)
            console.log("problemsolved",req.result.problemSolved)
        if(!req.result.problemSolved.includes(problemID)){
            req.result.problemSolved.push(problemID)
            await req.result.save();

        }
          res.status(201).send(submittedResult);
}
    catch(err){
         res.status(500).send('Internal Server Error'+err)
}
}
const RunCode=async (req,res)=>{
    try {
    
    const userId=req.result._id;
    const {id}=req.params;
    const problemId=id;
    const {code,language}=req.body;
    if(!userId||!problemId||!code||!language) 
       return res.status(400).send("Some field Missing");
    // fetch the problem from data 
    if(!mongoose.Types.ObjectId.isValid(problemId))
   return res.status(400).send("Invalid Problem ID");

    const problem=await Problem.findById(problemId);
    
     
    const submittedResult=await Submission.create(
        {
            userId,problemId, code,language,status:'pending',testCasesPassed:0
        }
    )
        const languageId = getLanguageByiD(language);
    const submissions = problem.visibleTestCases.map((testcase)=>({
            source_code:code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));
        
        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((value)=> value.token);
         const testResult = await submitToken(resultToken);
  
         let testCasesPassed=0;
         let runtime=0;
         let memory=0;
         let status=null;
        let errorMessage=null;
         for(const test of testResult) {
        if(test.status_id==3){ 
                testCasesPassed++;
            runtime=runtime+parseFloat(test.time);
            memory=Math.max(memory,test.memory);
         }
         else { 
            if(test.status_id==4)
            {
                status='error';
                errorMessage=test.stderr;

            }
            else {status='wrong';
              errorMessage=test.stderr;
            }
         }
}        
          submittedResult.status=status;
          submittedResult.testCasesPassed=testCasesPassed;
          submittedResult.errorMessage=errorMessage;
          submittedResult.runtime=runtime;
          submittedResult.memory=memory;
         
       
     
          res.status(201).send(submittedResult);
}
    catch(err){
         res.status(500).send('Internal Server Error'+err)
}
}

// console.log('in user submisssion page', typeof SubmitCode);
module.exports={SubmitCode,RunCode};
