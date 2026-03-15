# Authentication-Based Navigation Logic
This section explains how **navigation is controlled using authentication state** in the application.
The routing system ensures that:
* authenticated users access protected pages
* unauthenticated users are redirected to login/signup pages
* logged-in users cannot access login/signup again
The navigation behavior depends on the value of:

```
isAuthenticated
```
This value comes from the **Redux authentication state (`authSlice`)**.
---
# How the Navigation Logic Works
The application defines routes using **React Router**.
Each route checks the authentication state and decides whether to:
* render a page
* redirect the user to another page
This is achieved using a **conditional rendering pattern**.

---
# Homepage Route (`/`)

Navigation rule:
If the user **is authenticated**
→ show the Homepage
If the user **is not authenticated**
→ redirect to the Signup page

### Purpose
This protects the homepage so that **only logged-in users can access it**.
---

# Login Route (`/login`)
Navigation rule:
If the user **is authenticated**
→ redirect to the Homepage
If the user **is not authenticated**
→ show the Login page

### Purpose
Prevents logged-in users from accessing the login page again.
---
# Signup Route (`/signup`)
Navigation rule:
If the user **is authenticated**
→ redirect to the Homepage
If the user **is not authenticated**
→ show the Signup page
### Purpose
Ensures users cannot create another account while already logged in.

---
# Overall Navigation Flow
Application loads
↓
Authentication state is read from Redux
↓

If `isAuthenticated = true`
→ user can access protected routes

If `isAuthenticated = false`
→ user is redirected to authentication pages

---
# Resulting Behavior
Unauthenticated User:

```
/  → redirected to /signup
/login → login page
/signup → signup page
```
Authenticated User:

```
/ → homepage
/login → redirected to homepage
/signup → redirected to homepage
```
---
# Design Principle

The navigation system uses **authentication state as the single source of truth**.
By controlling routes using `isAuthenticated`, the application ensures:
* protected pages remain secure
* correct user redirection
* consistent authentication experience
* simplified route management
