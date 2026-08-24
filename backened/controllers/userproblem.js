const { getLanguageByiD, submitBatch, submitToken } = require("../utils/Problemutility");
const Problem = require("../Model/Problem");
const User = require("../Model/user");
const Submission = require("../Model/Submission");
const { redis_client: redisclient } = require("../config/redis");

const invalidateProblemCaches = async (problemId = null) => {
  try {
    let cursor = "0";
    do {
      const reply = await redisclient.scan(cursor, {
        MATCH: "problems:*",
        COUNT: 50,
      });
      cursor = reply.cursor;
      const keys = reply.keys;
      if (keys.length > 0) {
        await redisclient.del(keys);
      }
    } while (cursor !== "0" && cursor !== 0);

    if (problemId) {
      await redisclient.del(`problem:${problemId}`);
    }
  } catch (redisErr) {
    console.error("[Redis] Invalidation Error:", redisErr.message);
  }
};

const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases = [],
    HiddenTestCases = [],
    StartCode = [],
    ReferenceSolution = [],
  } = req.body;

  try {
    if (Array.isArray(ReferenceSolution) && ReferenceSolution.length > 0 && visibleTestCases.length > 0) {
      for (const { language, completeCode } of ReferenceSolution) {
        const languageId = getLanguageByiD(language);
        if (!languageId) {
          return res.status(400).send(`Invalid language in reference solution: ${language}`);
        }

        const submissions = visibleTestCases.map((testcase) => ({
          source_code: completeCode,
          language_id: languageId,
          stdin: testcase.input,
          expected_output: testcase.output,
        }));

        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);

        for (const test of testResult) {
          if (test.status_id != 3) {
            return res.status(400).send(`Reference solution for ${language} failed validation against test cases`);
          }
        }
      }
    }

    const userProblem = await Problem.create({
      ...req.body,
      problemCreator: req.result._id,
    });

    await invalidateProblemCaches();
    res.status(201).send("Problem Saved Successfully");
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

const updateProblem = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases = [],
    HiddenTestCases = [],
    StartCode = [],
    ReferenceSolution = [],
  } = req.body;

  try {
    if (!id) return res.status(404).send('Invalid Id');
    const dsa_prblm = await Problem.findById(id);
    if (!dsa_prblm) return res.status(404).send('ID is not there on server');

    if (Array.isArray(ReferenceSolution) && ReferenceSolution.length > 0 && visibleTestCases.length > 0) {
      for (const { language, completeCode } of ReferenceSolution) {
        const languageId = getLanguageByiD(language);
        if (!languageId) {
          return res.status(400).send(`Invalid language in reference solution: ${language}`);
        }

        const submissions = visibleTestCases.map((testcase) => ({
          source_code: completeCode,
          language_id: languageId,
          stdin: testcase.input,
          expected_output: testcase.output,
        }));

        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);

        for (const test of testResult) {
          if (test.status_id != 3) {
            return res.status(400).send(`Reference solution for ${language} failed validation against test cases`);
          }
        }
      }
    }

    const Updated_problem = await Problem.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true });
    await invalidateProblemCaches(id);
    res.status(200).send(Updated_problem);
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

const deleteProblem = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) return res.status(404).send('Invalid Id');
    const dsa_prblm = await Problem.findById(id);

    if (!dsa_prblm) return res.status(404).send('ID is not there on server');

    const Deleted_problem = await Problem.findByIdAndDelete(id);
    if (!Deleted_problem) return res.status(400).send('Problem is not there in DB');
    
    await invalidateProblemCaches(id);
    res.status(200).send("Deleted Successfully");
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) return res.status(404).send('Invalid Id');
    
    const cacheKey = `problem:${id}`;
    let cachedProblem = null;
    try {
      cachedProblem = await redisclient.get(cacheKey);
    } catch (redisErr) {
      console.error("[Redis] Get Problem Error:", redisErr.message);
    }

    if (cachedProblem) {
      return res.status(200).send(JSON.parse(cachedProblem));
    }

    const get_problem = await Problem.findById(id).select("-problemCreator -ReferenceSolution -HiddenTestCases");
    if (!get_problem) return res.status(400).send('Problem is not there');

    try {
      await redisclient.setEx(cacheKey, 3600, JSON.stringify(get_problem));
    } catch (redisErr) {
      console.error("[Redis] Set Problem Error:", redisErr.message);
    }

    res.status(200).send(get_problem);
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

const getAllProblem = async (req, res) => {
  try {
    const { page, limit, search, difficulty, tag } = req.query;

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const cacheKey = search
      ? `problems:page=${pageNumber}:limit=${limitNumber}:search=${search}`
      : `problems:page=${pageNumber}:limit=${limitNumber}:search=none:diff=${difficulty || "all"}:tag=${tag || "all"}`;

    let cachedData = null;
    try {
      cachedData = await redisclient.get(cacheKey);
    } catch (redisErr) {
      console.error("[Redis] Get Error:", redisErr.message);
    }

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    let query = {};
    if (search) {
      query.title = { $regex: search, $options: "i" };
    } else {
      if (difficulty && difficulty !== "all") {
        query.difficulty = { $regex: new RegExp(`^${difficulty}$`, "i") };
      }
      if (tag && tag !== "all") {
        query.tags = { $regex: tag, $options: "i" };
      }
    }

    const totalProblems = await Problem.countDocuments(query);
    const totalPages = Math.ceil(totalProblems / limitNumber);

    const problems = await Problem.find(query)
      .select("-problemCreator -ReferenceSolution -HiddenTestCases")
      .skip(skip)
      .limit(limitNumber);

    if (problems.length === 0 && totalProblems > 0) {
      return res.status(404).send("Page not found");
    }

    // CodeArena's frontend expects an array directly, but LogicLab expects an object {problems, totalPages, ...}
    // We will return an array directly if we want to be fully backward compatible, 
    // but the LogicLab frontend components expect {problems, totalPages, currentPage, totalProblems}
    // Let's return the structured payload.
    const responsePayload = {
      problems,
      totalPages,
      currentPage: pageNumber,
      totalProblems,
    };

    try {
      if (problems.length > 0 || totalProblems === 0) {
        await redisclient.setEx(cacheKey, 300, JSON.stringify(responsePayload));
      }
    } catch (redisErr) {
      console.error("[Redis] Set Error:", redisErr.message);
    }

    return res.status(200).json(responsePayload);
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

const solvedAllProblemByUser = async (req, res) => {
  try {
    const userId = req.result._id;

    const user1 = await User.findById(userId).populate({
      path: "problemSolved",
      select: "_id title difficulty tags"
    });

    res.status(200).send(user1);
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

const submittedProblem = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.pid;
    
    // Sort by latest first
    const ans = await Submission.find({ userId, problemId }).sort({ createdAt: -1 });
    
    res.status(200).send(ans);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

const getSubmissionById = async (req, res) => {
  try {
    const submissionId = req.params.id;
    const submission = await Submission.findById(submissionId).populate(
      "problemId",
      "title"
    );

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.status(200).json(submission);
  } catch (err) {
    res.status(500).send("Error " + err.message);
  }
};

const getLastSuccessfulSubmission = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.pid;

    const submission = await Submission.findOne({
      userId,
      problemId,
      status: "accepted",
    }).sort({ createdAt: -1 });

    if (!submission) {
      return res.status(200).json(null);
    }

    res.status(200).json(submission);
  } catch (err) {
    res.status(500).send("Error " + err.message);
  }
};

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblem,
  solvedAllProblemByUser,
  submittedProblem,
  getSubmissionById,
  getLastSuccessfulSubmission,
};
