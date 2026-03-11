# APIs – Delete Profile & Submitted Problems (Concept Notes)
This section summarizes the **core concepts** used in the APIs implemented.
---
# 1. Delete Profile API
**Purpose:**
Deletes a user's account and all submissions associated with that user.
Endpoint:
```text
DELETE /profile
```
### Core Idea
When a user is deleted, related data (like submissions) should also be removed to avoid **orphan records**.
Database relation:
```text
User
 └── Submissions
```
Operation concept:
```text
1. Delete user from User collection
2. Delete all submissions where userId = deleted user
```
This maintains **data consistency** in the database.
---
# 2. Mongoose Middleware (Pre & Post Hooks)
Mongoose allows running logic **before or after database operations**.
### Pre Hook
Runs **before an operation**.
Example use cases:
* password hashing
* validation
* modifying data before saving
Concept example:
```text
pre("save")
pre("deleteOne")
```
---
### Post Hook
Runs **after an operation is completed**.
Example use cases:
* delete related records
* logging
* triggering background tasks
Example concept:
```text
post("findOneAndDelete")
```
In a production system, the deletion of submissions could be handled automatically using a **post delete hook** in the User schema.
---
# 3. Submitted Problems API
**Purpose:**
Fetch submissions of a specific problem by a specific user.
Endpoint:
```text
GET /submission/:pid
```
Query logic:
```text
Find submissions where
userId = current user
problemId = requested problem
```
Returned data typically includes:
* status (accepted / wrong / error)
* runtime
* memory
* test cases passed
---
# 4. Compound Indexing
Since queries frequently use both **userId and problemId**, a compound index is created.
Concept:
```text
Index (userId, problemId)
```
This improves query performance for:
```text
Find submissions by userId and problemId
```
Without index:
```text
Full collection scan
```
With compound index:
```text
Direct indexed search
```
---
# Left Prefix Rule
For compound index:
```text
(userId, problemId)
```
Optimized queries:
```text
userId
userId + problemId
```
Not optimized:
```text
problemId only
```
---
# Key Revision Points
```text
Delete Profile → remove user + related submissions
Submitted Problems → filter using userId and problemId
Compound Index → speeds up multi-field queries
Mongoose Hooks → pre (before operation), post (after operation)
Left Prefix Rule → compound index works left to right
```
