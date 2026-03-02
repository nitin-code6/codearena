1. Repository
A repository is  project folder with memory.
It tracks:
What changed
When it changed
Why it changed

Types:
Local → on your laptop
Remote → on GitHub
Purpose: version control, collaboration, rollback.

2. Remote & Origin
Remote = online version of your repo.
Origin = default name for that remote.
Example:
git remote add origin <repo-url>
git push origin main
3. npm
npm = Node Package Manager.
Used to install backend libraries.
Initialize project:
npm init -y
Installs create:
package.json
node_modules/

4. package.json
The brain of a Node project.
Stores:
Dependencies
Scripts
Project info

5. node_modules

Auto-generated folder containing installed packages.
Never push to GitHub.
Can be rebuilt using:
npm install
6. Dependencies vs DevDependencies
Dependencies → needed in production
Example: express, mongoose
DevDependencies → needed only during development
Example: nodemon

7. nodemon
Development tool that auto-restarts the server when files change.
Not used in production.

8. localhost
localhost = this computer (127.0.0.1).
Accessible only on your machine.
To make public → deploy.

9. Backend Structure
backend/
  config/
  routes/
  models/
  controllers/
  middleware/
  server.js
10. Folder Responsibilities
config → setup (DB connection)
routes → define API paths
models → database structure
controllers → logic
middleware → runs before controller (auth, validation)
 
11. Request Flow
Route → Middleware → Controller → Model → Database
12. API & Endpoint
API = communication between frontend and backend.
Endpoint = method + URL.

Examples:

GET  /api/problems
POST /api/auth/login
13. Development vs Production
Development
localhost
nodemon
testing phase

Production
deployed server
public URL
real users