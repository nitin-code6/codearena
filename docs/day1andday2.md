
## Day 1 – Authentication Controllers
Today the focus was on implementing the **authentication system in the controller layer**.
Five main APIs were implemented inside the authentication controller.
### Implemented APIs
 **Register**
* **Login**
* **Logout**
* **Admin Register**
* **Get Profile**

## Register Flow
User registration follows these steps:
1. **Input Validation**
   * Request body is validated using a custom validator.
2. **Password Hashing**
   * Password is hashed using bcrypt before storing it.
req.body.password = await bcrypt.hash(password, 10);
3. **Store User in Database**
   * User data is saved in MongoDB using the User model.
4. **JWT Token Generation**
   * After successful registration, a JWT token is created.
jwt.sign({ id: user._id, emailId }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });

5. **Cookie Storage**
   * The generated token is stored in a cookie.
res.cookie("token", token);
## Login Flow
The login API verifies user credentials and issues a token.
Steps:
1. Extract **emailId** and **password** from the request body.
2. Check if the email exists in the database.
3. Compare the entered password with the hashed password using bcrypt.
bcrypt.compare(password, user.password);
4. If the credentials match, generate a **JWT token**.
5. Store the token in a cookie for authentication.

## Logout Flow (Redis Blacklist)
JWT tokens cannot normally be destroyed before they expire.
To solve this problem, **Redis is used as a token blacklist**.
Logout steps:
1. Extract the token from cookies.
2. Decode the token payload.
3. Store the token in the **Redis blacklist**.
await redis_client.set(`token:${token}`, "Blocked")
4. Set expiration time in Redis equal to the JWT expiration.
await redis_client.expireAt(`token:${token}`, payload.exp);
5. Clear the cookie from the browser.
res.clearCookie("token");
This ensures that a logged-out token **cannot be reused**.
## Middleware Implementation

Two middleware layers were implemented.

### User Middleware

Used to protect normal user routes.

Steps performed:

1. Check if token exists in cookies.
2. Verify JWT token.
3. Check if the token exists in Redis blacklist.
4. Fetch user data from MongoDB.
5. Attach user information to `req.result`.

Flow:

```
Request
   ↓
Token Check
   ↓
JWT Verify
   ↓
Redis Blacklist Check
   ↓
Fetch User
   ↓
Access Granted
```

---

### Admin Middleware

Admin middleware works similar to user middleware but includes an additional role check.

Steps:

1. Verify JWT token.
2. Check if token is blacklisted.
3. Verify the user role is **admin**.
4. Allow access to admin routes.

---

## Get Profile API

Returns authenticated user details.

The middleware already attaches user data to the request object.

Example response:

```json
{
  "firstname": "...",
  "lastname": "...",
  "emailId": "...",
  "problemSolved": "..."
}
```

Password is not returned for security reasons.

---

# Current Backend Architecture

```
Node.js + Express
        │
        ├── MongoDB Atlas (User data storage)
        │
        ├── Redis Cloud (JWT blacklist for logout)
        │
        └── JWT Authentication (secure API access)
```

---

# Status After Day 1,2

The backend authentication system is now functional with:

* User registration
* Secure login system
* JWT-based authentication
* Cookie-based token storage
* Redis-powered logout system
* Protected user routes
* Admin authorization middleware
* Profile retrieval API
