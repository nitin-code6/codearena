# Coding Platform Backend – Submission Module

This module implements the core backend functionality of a coding platform where users can **run code, submit solutions, and track solved problems**.
# Features Implemented

1. **Run Code API**
   * Executes user code against **visible test cases**
   * Used for testing code before final submission
2. **Submit Code API**
   * Executes code against **hidden test cases**
   * Saves submission results
   * Updates user's solved problem list
3. **Solved Problems API**
   * Fetches all problems solved by a specific user
   * Uses MongoDB `populate()` to fetch problem details
---
# Database Relationships
This project uses **MongoDB with Mongoose**.
The relationship between collections:
```
User  ------>  Submission  ------> Problem
  |                             
  └-------- problemSolved -------┘
```
### Collections
**User**
* Stores user information
* Contains `problemSolved` array referencing solved problems
**Problem**
* Stores problem details and test cases
**Submission**
* Stores each code submission by users
---
# Important Mongoose Concepts
## 1. ObjectId
MongoDB documents are identified by **ObjectId**.
Example:
69ad424465940c3acacdae05
```
Before querying we validate the ID:

```javascript
if (!mongoose.Types.ObjectId.isValid(problemId)) {
    return res.status(400).send("Invalid Problem ID");
}
```
---
# 2. ref (Reference)
Used to create **relationships between collections**.
Example from `UserSchema`:
```javascript
problemSolved: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem"
  }
]
``
Meaning:
```
User.problemSolved → stores Problem._id
```
This works like a **foreign key in SQL**.
---
# 3. populate()
MongoDB normally stores only IDs.
Example user document:
```
{
  "_id": "U1",
  "problemSolved": ["P1", "P3"]
}
```
Using populate:
```javascript
User.findById(userId).populate({
  path: "problemSolved",
  select: "_id title difficulty tags"
});
```
Result:
```
{
  "_id": "U1",
  "problemSolved": [
    {
      "_id": "P1",
      "title": "Two Sum",
      "difficulty": "Easy"
    }
  ]
}
```
`populate()` works similar to a **SQL JOIN**.
---
# APIs Implemented
## 1. Run Code API
Runs code on **visible test cases**.
Endpoint:
```
POST /run/:id
```
Flow:
```
1. Validate problemId
2. Fetch problem
3. Execute code against visible test cases
4. Return runtime, memory and result
``
Important snippet:
```javascript
const submissions = problem.visibleTestCases.map((testcase) => ({
    source_code: code,
    language_id: languageId,
    stdin: testcase.input,
    expected_output: testcase.output
}));
```
---
# 2. Submit Code API
Runs code against **hidden test cases**.
Endpoint:
```
POST /submit/:id
```
Flow:
```
1. Validate problemId
2. Create submission with status "pending"
3. Run code against hidden test cases
4. Evaluate result
5. Update submission
6. Add problem to user's solved list
```
Important logic:
```javascript
if(!req.result.problemSolved.includes(problemID)){
    req.result.problemSolved.push(problemID)
    await req.result.save();
}
```
This ensures the problem is added **only once**.
---
# Submission Result Processing
Each test case returns a status.
```
status_id = 3 → Accepted
status_id = 4 → Compilation Error
others → Wrong Answer
```
Example evaluation logic:
```javascript
if(test.status_id == 3){
    testCasesPassed++;
}
```
Runtime and memory are also calculated.
---

# 3. Solved Problems by User

Fetches all problems solved by the logged-in user.
Endpoint:
```
GET /problem/user
```
Implementation:
```javascript
const user = await User.findById(userId).populate({
  path: "problemSolved",
  select: "_id title difficulty tags"
});
```
This returns the solved problems with selected fields.
---
# Important Backend Concepts Used
* REST API design
* MongoDB relationships using `ref`
* Document population using `populate`
* ObjectId validation
* Code execution with test cases
* Asynchronous processing with `async/await`
---
# Future Improvements
* Prevent duplicate solved problems using `$addToSet`
* Pagination for solved problems
* Submission history API
* Leaderboard and ranking system
* Code execution queue using Redis
---
# Learning Takeaways
This module demonstrates:
* Building real backend APIs
* Managing relationships in MongoDB
* Handling code execution results
* Updating user progress dynamically
These are core backend patterns used in **coding platforms like LeetCode and HackerRank**.
---
