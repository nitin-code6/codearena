const {getLanguageByiD,submitBatch,submitToken} = require("../utils/Problemutility")
const Problem = require("../Model/Problem")

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
        // console.log('submitresult',submitResult);
        
        const resultToken = submitResult.map((value)=> value.token);

        // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
        
       const testResult = await submitToken(resultToken);

    //    console.log('test result',testResult);

       for(const test of testResult){
        if(test.status_id!=3){
         return res.status(400).send("Error Occured");
        }
       }

      }


      // We can store it in our DB
      console.log(Problem);
console.log(typeof Problem);

    const userProblem =  await Problem.create({
        ...req.body,
        problemCreator: req.result._id
      });

      res.status(201).send("Problem Saved Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}


module.exports = createProblem;
