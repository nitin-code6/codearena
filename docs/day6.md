**Problem APIs, Pagination & Submission Model**
Overview

focused on implementing the core backend operations for problems in a coding platform. The goal was to manage problems, validate updates against test cases, and introduce pagination for efficient data retrieval. A submission data model was also designed to store results of user code execution.

Flow:

Client Request
→ Express Route
→ Controller
→ Database Query
→ Response Sent Back

Problem Management APIs
1. Fetch All Problems

This endpoint returns a list of problems stored in the database. Pagination is applied to prevent returning large datasets at once.

Purpose:
Improve API performance
Reduce memory usage
Provide structured data for frontend display

2. Fetch Problem by ID
This endpoint retrieves a specific problem using its unique identifier.
Process:
Validate the provided ID.
Search the database for the problem.
Return the problem details if found.
Return an error if the problem does not exist.

3. Update Problem

Updating a problem includes validating its reference solution against the defined test cases.
Process:
Validate the problem ID.
Retrieve the problem from the database.
Execute the reference solution against visible test cases.
Verify that the outputs match the expected results.
If validation passes, update the problem data in the database.
This ensures that every problem stored in the system has a correct reference solution.

4. Delete Problem

This endpoint removes a problem from the database.
Process:
Validate the problem ID.
Check if the problem exists.
Remove the problem from the database.
Return a confirmation response.


## Pagination Concept

Pagination is used when retrieving multiple records from the database.
Instead of returning all problems at once, results are divided into smaller pages.

Key ideas:

Page: which section of data is requested

Limit: number of records returned per page
Skip: number of records ignored before retrieving results

Example concept:

Page 1 → first set of problems
Page 2 → next set of problems
Page 3 → next set after that

Benefits of pagination:

Faster response time
Reduced database load
Better user experience for large datasets

## Submission Data Model
A submission represents a user's attempt to solve a problem.
The submission model stores information about:
User who submitted the solution
Problem being solved
Source code submitted
Programming language used
Execution status
Runtime and memory usage
Number of test cases passed
Total test cases
The model also tracks creation and update times for each submission.
Submission Flow
User submits code
→ Submission record created
→ Code executed against test cases
→ Execution result generated
→ Submission updated with status and performance metrics

This structure allows the system to track every attempt made by users.

*Key Concepts Learned*
Designing RESTful APIs for problem management
Validating data before database operations
Using pagination to optimize API responses
Structuring a submission model for code execution results
Designing backend flow for a coding platform