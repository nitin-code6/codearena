const {getLanguageByiD,submitBatch,submitToken} = require("../utils/Problemutility")
const Problem = require("../Model/Problem")
const User=require("../Model/user");
const createProblem = async (req,res)=>{

    const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        ReferenceSolution, problemCreator
    } = req.body;


    try{
    //    console.log("referenceSolution:", ReferenceSolution);
    //    console.log("type:", typeof ReferenceSolution);
      for(const {language,completeCode} of ReferenceSolution){
         

        // source_code:
        // language_id:
        // stdin: 
        // expectedOutput:

        const languageId = getLanguageByiD(language);
          
        // I am creating Batch submission
        // console.log(visibleTestCases);
        const submissions = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));
// console.log("submissions:", submissions);

        const submitResult = await submitBatch(submissions);
        // console.log('submitresult', typeof submitResult);
        
        const resultToken = submitResult.map((value)=> value.token);

    
       const testResult = await submitToken(resultToken);

    //    console.log('test result',testResult);

       for(const test of testResult){
        if(test.status_id!=3){
         return res.status(400).send("Error Occured");
        }
       }

      }


      // We can store it in our DB
//       console.log('Problem',Problem);
// console.log(typeof Problem);

    const userProblem =  await Problem.create({
        ...req.body,
        problemCreator: req.result._id
      });

      res.status(201).send("Problem Saved Successfully");
    }
    catch(err){
        res.status(500).send("Error: "+err);
    }
}

const updateProblem=async(req,res)=>{
    const {id}=req.params;
 
    const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        ReferenceSolution, problemCreator
    } = req.body;

    try{
     
      if(!id) res.status(404).send('Invalid Id');
       const dsa_prblm=await Problem.findById(id);
      if(!dsa_prblm) res.status(404).send('ID is not there on server');
         for(const {language,completeCode} of ReferenceSolution){
               const languageId = getLanguageByiD(language);
          
        const submissions = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));
        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult.map((value)=> value.token);

       const testResult = await submitToken(resultToken);
       for(const test of testResult){
        if(test.status_id!=3){
         return res.status(400).send("Error Occured");
        }
       }

      }
      const Updated_problem=await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});
      res.status(200).send(Updated_problem);
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}
const deleteProblem=async(req,res)=>{
    const {id}=req.params;
   

    try{
         if(!id) res.status(404).send('Invalid Id');
      const dsa_prblm=await Problem.findById(id);
    
      if(!dsa_prblm) res.status(404).send('ID is not there on server');
    
      const Deleted_problem=await Problem.findByIdAndDelete(id);
      if(!Deleted_problem) res.status(400).send('Problem is not there in DB');
      res.status(200).send("Deleted Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}
const getProblemById=async(req,res)=>{
    const {id}=req.params;
 
   

    try{
        if(!id) res.status(404).send('Invalid Id');
      
        
      const get_problem=await Problem.findById(id).select("-problemCreator -ReferenceSolution -HiddenTestCases");
      if(!get_problem) res.status(400).send('Problem is not there');
      res.status(200).send(get_problem);
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}
const getAllProblem=async(req,res)=>{
    
     const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;
   

    try{
      
      const Allproblem=await Problem.find({}) .skip(skip)
            .limit(limit).select("-problemCreator -ReferenceSolution -HiddenTestCases");
      if(Allproblem.length === 0) res.status(400).send('Empty DB');
      res.status(200).send(Allproblem);
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}
const solvedAllProblemByUser=async(req,res)=>{
    
     

    try{
        const userId=req.result._id;
      
      const user1=await User.findById(userId).populate({
        path:"problemSolved",
        select:"_id title difficulty tags"
      });
  
      res.status(200).send(user1);
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblemByUser};
