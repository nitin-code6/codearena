# Frontend Authentication Flow
This document explains the **frontend authentication architecture** and the **role of `authSlice` in Redux Toolkit**.
Authentication features implemented:
* User Registration
* User Login
* Session Verification
* Logout

Redux Toolkit is used to manage **global authentication state**.
---
# 1. Why Authentication Is Needed
Authentication allows the application to:

* identify users
* protect restricted routes
* personalize the user experience

Without authentication, the system cannot determine **who is accessing the application**.

---
# 2. Why Authentication State Is Global

Multiple components require authentication information, such as:

* navigation bar
* protected pages
* dashboards
* logout controls

Passing user data through many components causes **prop drilling**.

### Solution
Store authentication state globally using **Redux** so any component can access it instantly.
---
# 3. Role of `authSlice`
`authSlice` is the **central place where authentication state and logic are managed**.
It is responsible for:

* storing the authenticated user
* tracking login status
* managing loading states
* handling authentication errors

### Authentication State
The slice maintains:

* **user** → current authenticated user
* **isAuthenticated** → login status
* **loading** → API request state
* **error** → authentication errors

This state allows the UI to **react automatically when authentication changes**.

---

# 4. Why `createAsyncThunk` Is Used
Authentication requires communication with the backend, such as:

* registering a user
* verifying credentials
* checking existing sessions
* logging out

These are **asynchronous API operations**.

`createAsyncThunk` simplifies handling them by automatically managing three request states:

* **pending** → request started
* **fulfilled** → request successful
* **rejected** → request failed

This keeps Redux logic **clean and predictable**.
---
# 5. Authentication Actions in `authSlice`

The slice handles four main authentication actions:
### Register User
Creates a new account and stores the authenticated user in global state.
### Login User
Verifies credentials and updates the authentication state.
### Check Authentication
Runs when the application loads to verify whether a session already exists.
### Logout User
Clears authentication state and ends the user session.
---

# 6. Authentication Flow
The frontend authentication flow follows this lifecycle:
User Interaction
↓
Form Validation
↓
Redux dispatches authentication action
↓
`createAsyncThunk` sends API request
↓
Backend processes authentication
↓
Redux `authSlice` updates global state
↓
UI updates based on authentication status

---
# 7. Resulting Architecture

This authentication system ensures:

* centralized authentication logic
* predictable state updates
* consistent user session management
* automatic UI updates based on login status

The **authSlice acts as the single source of truth for authentication state in the frontend**.
User fills signup form
      ↓
dispatch(registerUser(userData))
      ↓
createAsyncThunk starts
      ↓
auth/register/pending
      ↓
API request sent to backend
      ↓
Backend creates user
      ↓
Success → auth/register/fulfilled
or
Failure → auth/register/rejected
      ↓
Redux authSlice updates state
      ↓
UI reacts to new authentication state