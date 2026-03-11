 **Problem Creation & Judge0 Validation**
 focused on implementing the Problem Creation API and integrating Judge0 to validate problems before storing them in the database.
The main goal is to ensure that every problem added to the platform has correct testcases and a valid reference solution.
Without this validation, incorrect problems could be published and users would not be able to solve them correctly.

## Problem Creation Flow

When an admin creates a problem, the backend performs validation before saving it.

Flow:

Admin Creates Problem
↓
Extract Reference Solutions
↓
Generate Testcase Submissions
↓
Send Batch to Judge0
↓
Receive Execution Tokens
↓
Fetch Execution Results
↓
Validate Outputs
↓
Store Problem in MongoDB

If the reference solution fails any testcase, the problem is not stored.

Judge0 Execution Flow

The system uses the Judge0 Batch API to validate problems.

This approach allows multiple testcases to be executed in a single request.

# Step 1 – Language Mapping

Programming languages must be mapped to Judge0 language IDs.

Example mapping used in the system:

C++ → 54
Java → 62
JavaScript → 63

This mapping allows the backend to tell Judge0 which compiler or runtime should be used.

# Step 2 – Generate Submissions

For each testcase, a submission object is created containing:
source_code
language_id
stdin
expected_output

Example structure:

{
 source_code: referenceSolution,
 language_id: 54,
 stdin: testcase.input,
 expected_output: testcase.output
}

Why this step is needed:
Judge0 requires code, input, and expected output to verify if the program works correctly.

# Step 3 – Submit Batch to Judge0

All testcase submissions are sent together using the batch submission endpoint.
Function used in the implementation:
submitBatch(submissions)
Judge0 returns execution tokens for each testcase.
Example:
[token1, token2, token3]

**Why tokens are used:**
Judge0 processes submissions asynchronously, so tokens allow us to retrieve results later.

## Step 4 – Fetch Execution Results
The tokens are then used to fetch execution results.

Function used:
submitToken(tokens)
The system repeatedly checks Judge0 until execution is completed.
This is done using a loop that waits until all submissions finish executing.

Why this step is needed:
Judge0 does not return results immediately because code execution takes time.

Step 5 – Validate Results
Each testcase result is checked.

Validation logic:
If status_id is not equal to 3, the problem creation fails.
Status code 3 means Accepted, which indicates that the reference solution produced the correct output.

Why validation is important:
It guarantees that the problem’s testcases and expected outputs are correct before the problem is saved.

Judge0 Status Codes

Common status codes returned by Judge0 include:

3 → Accepted
4 → Wrong Answer
5 → Time Limit Exceeded
6 → Compilation Error
7 → Runtime Error

Only problems whose reference solutions return Accepted for all testcases are stored.

Comparison with LeetCode

Coding platforms like LeetCode follow a similar validation process when new problems are added.

Typical workflow:

Problem Creation
↓
Reference Solution Execution
↓
Testcase Verification
↓
Publish Problem

This ensures that all published problems are valid and solvable.

Status After Day 4,5
After completing Day 4, the backend now supports:
Authentication system
Problem schema design
Problem creation API
Judge0 integration
Batch testcase execution
Reference solution validation
Problem storage in MongoDB
The platform can now store verified coding problems, which will later be used for user submissions and automated judging.