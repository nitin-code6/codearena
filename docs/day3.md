Day 3 focused on designing the Problem Schema, which defines how coding problems are stored in the platform.
This schema is important because features like problem creation, submissions, and judge validation depend on it.

Problem Structure

Each problem contains:

Title
Description
Difficulty
Tags
Visible Testcases
Hidden Testcases
Starter Code
Reference Solution
Problem Creator
 
This structure is similar to the architecture used by platforms like LeetCode and HackerRank.

Visible Testcases
Visible testcases help users understand how the problem works.

Example:
Input
4
2 7 11 15
9

Output
0 1

They allow users to test their code before submission.

Hidden Testcases

Hidden testcases are not shown to users.
They are used internally by the judge system to verify solution correctness and prevent hardcoded answers.

Execution flow:

User Code
↓
Run Visible Testcases
↓
Run Hidden Testcases
↓
Final Verdict

Starter Code

Starter code templates are provided for different programming languages to help users begin solving the problem quickly.

Reference Solution

Reference solutions are used to validate testcases before storing the problem.
The reference code is executed against all testcases to ensure the outputs are correct.

Status After Day 3
After Day 3, the backend now supports:
Problem schema design
Visible testcase storage
Hidden testcase storage
Starter code templates
Reference solution storage

This schema forms the foundation of the coding platform and will be used for implementing the problem creation and judge system.