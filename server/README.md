# Help Desk Ticketing System - Server Documentation

## 📋 Project Overview

A full-featured help desk ticketing system built with **Node.js, Express, MongoDB, and JWT authentication**. Users can create support tickets, admins can manage and resolve them, with real-time updates and role-based access control.

**Current Status:** Core backend API implemented ✅ | Frontend & Real-time features pending 🔄

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│               Client (Frontend - React)              │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP/WebSocket
                   ▼
┌──────────────────────────────────────────────────────┐
│        Express Server (Node.js)                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ Routes                                         │  │
│  │  ├─ /api/user (Auth endpoints)                │  │
│  │  └─ /api/ticket (Ticket CRUD)                 │  │
│  ├────────────────────────────────────────────────┤  │
│  │ Middleware                                     │  │
│  │  ├─ authMiddleware (JWT verification)         │  │
│  │  └─ allowRoles (Role-based access)            │  │
│  ├────────────────────────────────────────────────┤  │
│  │ Controllers                                    │  │
│  │  ├─ User.Controller (auth logic)              │  │
│  │  └─ Ticket.Controller (ticket logic)          │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────┘
                   │ MongoDB Protocol
                   ▼
┌──────────────────────────────────────────────────────┐
│        MongoDB Database                              │
│  ├─ users collection                                │
│  └─ tickets collection                              │
└──────────────────────────────────────────────────────┘
```

---

## 📦 Tech Stack

| Layer                | Technology         | Version        |
| -------------------- | ------------------ | -------------- |
| **Runtime**          | Node.js            | Latest         |
| **Framework**        | Express.js         | ^5.2.1         |
| **Database**         | MongoDB            | (via Mongoose) |
| **ODM**              | Mongoose           | ^9.9.2         |
| **Authentication**   | JWT (jsonwebtoken) | ^9.0.3         |
| **Password Hashing** | Argon2             | ^0.45.1        |
| **Validation**       | Joi                | ^18.2.3        |
| **CORS**             | cors               | ^2.8.6         |
| **Env Config**       | dotenv             | ^17.4.2        |
| **Cookie Parsing**   | cookie-parser      | ^1.4.7         |

---

## 🗄️ Database Schemas

### 1. User Schema

**Model:** `user`

```javascript
{
  _id: ObjectId,                    // MongoDB auto-generated ID
  name: {
    type: String,
    required: true,
    minLength: 3
  },
  email: {
    type: String,
    unique: true,                   // No duplicate emails
    required: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    hashed: true                    // Uses Argon2
  },
  role: {
    type: String,
    enum: ["user", "admin", "agent"],
    default: "user"
  },
  refreshToken: {
    type: String,
    nullable: true
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Roles:**

- **`user`** - Regular customer who creates tickets
- **`admin`** - Full access to all tickets, can assign/resolve
- **`agent`** - Support staff, can assign to themselves and resolve

---

### 2. Ticket Schema

**Model:** `ticket`

```javascript
{
  _id: ObjectId,
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
    // Examples: "Bug", "Feature Request", "Billing", "General Inquiry"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
    required: true
  },
  status: {
    type: String,
    enum: ["open", "in progress", "resolved", "closed"],
    default: "open",
    required: true
  },
  createdBy: {
    type: ObjectId,
    ref: "user",                     // References User model
    required: true
  },
  assignedTo: {
    type: ObjectId,
    ref: "user",                     // Assigned admin/agent
    default: null,
    nullable: true
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes:**

- `createdBy` - For quick user ticket lookup
- `status` - For filtering by status
- `assignedTo` - For agent workload distribution

---

## 🔐 Authentication & Authorization

### JWT Token Strategy

**Access Token:**

- Expires: **15 minutes**
- Stored: Client (localStorage/sessionStorage)
- Used for: API requests
- Secret: `JWT_ACCESS_SECRET` env variable

**Refresh Token:**

- Expires: **7 days**
- Stored: HttpOnly Cookie (secure)
- Used for: Obtaining new access token
- Secret: `JWT_REFRESH_SECRET` env variable

### Token Payload

```javascript
{
  id: User._id,
  name: User.name,
  email: User.email,
  role: User.role
}
```

---

## 🛣️ API Routes & Endpoints

### Base URL

```
http://localhost:8080/api
```

### Health Check

```
GET /health
Response: { status: "ok", message: "API is healthy" }
```

---

### 👤 User Routes (`/api/user`)

#### 1. Register New User

```
POST /api/user/register

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"                    // Optional, defaults to "user"
}

Validation:
- name: Required, min 3 characters
- email: Required, valid email format
- password: Required, min 6 characters
- role: Optional, must be "user" | "admin" | "agent"

Response (201):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Cookies Set:
- refreshToken (HttpOnly, Secure, 7 days)

Errors:
- 400: User already exists | Validation failed
- 500: Internal server error
```

#### 2. Login

```
POST /api/user/login

Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Validation:
- email: Required, valid email
- password: Required, min 6 characters

Response (200):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}

Cookies Set:
- refreshToken (HttpOnly, Secure, 7 days)

Errors:
- 400: Validation failed
- 404: User not found
- 401: Invalid password
- 500: Internal server error
```

#### 3. Refresh Access Token

```
POST /api/user/refresh

Headers:
(None required - uses Cookie)

Cookies Required:
- refreshToken (from login response)

Response (200):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Cookies Set:
- refreshToken (new token, 7 days)

Errors:
- 401: Refresh token required | Invalid/expired token
- 500: Internal server error
```

#### 4. Test Endpoint

```
GET /api/user/test

Response (200):
"user route is working"
```

---

### 🎫 Ticket Routes (`/api/ticket`)

#### Required Headers for All Protected Routes

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

#### 1. Create Ticket

```
POST /api/ticket

Headers:
Authorization: Bearer <access_token>

Request Body:
{
  "title": "Login button not working",
  "description": "The login button on the homepage is not responding to clicks",
  "category": "Bug",
  "priority": "high",                // Optional, defaults to "medium"
  "assignedTo": null                 // Optional, admin assigns later
}

Validation:
- title: Required, string
- description: Required, string
- category: Required, string
- priority: Optional, enum: "low" | "medium" | "high"
- assignedTo: Optional, valid MongoDB ObjectId or null

Response (201):
{
  "message": "Ticket created successfully",
  "ticket": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Login button not working",
    "description": "...",
    "category": "Bug",
    "priority": "high",
    "status": "open",
    "createdBy": "507f1f77bcf86cd799439012",
    "assignedTo": null,
    "createdAt": "2024-08-18T10:30:00Z",
    "updatedAt": "2024-08-18T10:30:00Z"
  }
}

Errors:
- 400: Validation failed | Invalid ticket ID format
- 401: Access token required/expired
- 500: Internal server error
```

---

#### 2. Get All Tickets (Admin Only)

```
GET /api/ticket/admin?page=1&limit=20&status=open&priority=high

Headers:
Authorization: Bearer <admin_access_token>

Query Parameters:
- page: Optional, default 1
- limit: Optional, default 20
- status: Optional, filter by status (open|in progress|resolved|closed)
- priority: Optional, filter by priority (low|medium|high)

Response (200):
{
  "tickets": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Login button not working",
      "description": "...",
      "category": "Bug",
      "priority": "high",
      "status": "open",
      "createdBy": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "assignedTo": null,
      "createdAt": "2024-08-18T10:30:00Z",
      "updatedAt": "2024-08-18T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalTickets": 45,
    "totalPages": 3
  }
}

Access Control:
- Only users with role "admin" can access
- Returns 403 if user is not admin

Errors:
- 401: Access token required/expired
- 403: Access denied (not admin)
- 500: Internal server error
```

---

#### 3. Get My Tickets

```
GET /api/ticket/my-ticket

Headers:
Authorization: Bearer <access_token>

Response (200):
{
  "tickets": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Login button not working",
      "description": "...",
      "category": "Bug",
      "priority": "high",
      "status": "open",
      "createdBy": "507f1f77bcf86cd799439012",
      "assignedTo": {
        "_id": "507f1f77bcf86cd799439013",
        "name": "Support Agent",
        "email": "agent@support.com"
      },
      "createdAt": "2024-08-18T10:30:00Z",
      "updatedAt": "2024-08-18T10:30:00Z"
    }
  ]
}

Access Control:
- Any authenticated user
- Returns only tickets created by the logged-in user

Errors:
- 401: Access token required/expired
- 500: Internal server error
```

---

#### 4. Get Single Ticket Detail

```
GET /api/ticket/:id

Headers:
Authorization: Bearer <access_token>

URL Parameters:
- id: MongoDB ObjectId (must be valid 24-char hex string)

Response (200):
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Login button not working",
  "description": "...",
  "category": "Bug",
  "priority": "high",
  "status": "open",
  "createdBy": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "assignedTo": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Support Agent",
    "email": "agent@support.com"
  },
  "createdAt": "2024-08-18T10:30:00Z",
  "updatedAt": "2024-08-18T10:30:00Z"
}

Access Control Rules:
- Admin: Can view any ticket
- Agent: Can view tickets assigned to them
- User: Can view only their own tickets
- Returns 404 if user doesn't have permission

Errors:
- 400: Ticket ID is required | Invalid ticket ID format
- 401: Access token required/expired
- 403: Access forbidden (not authorized to view)
- 404: Ticket not found or access denied
- 500: Internal server error
```

---

#### 5. Update Ticket

```
PATCH /api/ticket/:id

Headers:
Authorization: Bearer <access_token>

URL Parameters:
- id: MongoDB ObjectId

Request Body (any combination):
{
  "title": "Updated title",
  "description": "Updated description",
  "category": "Feature Request",
  "priority": "medium",
  "status": "in progress"
}

Validation:
- All fields are optional
- priority: "low" | "medium" | "high"
- status: "open" | "in progress" | "resolved" | "closed"

Response (200):
{
  "message": "Ticket updated successfully",
  "ticket": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated title",
    "description": "Updated description",
    "category": "Feature Request",
    "priority": "medium",
    "status": "in progress",
    "createdBy": {...},
    "assignedTo": {...},
    "createdAt": "2024-08-18T10:30:00Z",
    "updatedAt": "2024-08-18T11:45:00Z"
  }
}

Access Control Rules:
- Admin: Can update any ticket
- Agent: Can update tickets assigned to them
- User: Can update only their own tickets
- Returns 403 if not authorized

Errors:
- 400: Ticket ID required | Invalid ID format | Validation failed
- 401: Access token required/expired
- 403: Access forbidden
- 404: Ticket not found or access denied
- 500: Internal server error
```

---

#### 6. Delete Ticket

```
DELETE /api/ticket/:id

Headers:
Authorization: Bearer <access_token>

URL Parameters:
- id: MongoDB ObjectId

Response (200):
{
  "message": "Ticket deleted successfully",
  "ticketId": "507f1f77bcf86cd799439011"
}

Access Control Rules:
- Admin: Can delete any ticket
- Agent: CANNOT delete any ticket (forbidden)
- User: Can delete only their own tickets
- Returns 403 if not authorized

Errors:
- 400: Ticket ID required | Invalid ID format
- 401: Access token required/expired
- 403: Access forbidden | Agents not allowed to delete
- 404: Ticket not found or access denied
- 500: Internal server error
```

---

## 🔒 Role-Based Access Control (RBAC)

### Middleware: `allowRoles(...roles)`

```javascript
// Usage in routes
router.get("/admin", authMiddleware, allowRoles("admin"), controller);

// Checks:
1. User must be authenticated (via authMiddleware)
2. User's role must be in allowed roles array
3. Returns 401 if not authenticated
4. Returns 403 if role not allowed
```

### Role Permissions Matrix

| Operation              | User | Admin | Agent |
| ---------------------- | ---- | ----- | ----- |
| Create Ticket          | ✅   | ✅    | ✅    |
| View Own Tickets       | ✅   | ✅    | ✅    |
| View All Tickets       | ❌   | ✅    | ❌    |
| View Assigned Tickets  | ❌   | ✅    | ✅    |
| Update Own Ticket      | ✅   | ✅    | ❌    |
| Update Assigned Ticket | ❌   | ✅    | ✅    |
| Update Any Ticket      | ❌   | ✅    | ❌    |
| Delete Own Ticket      | ✅   | ✅    | ❌    |
| Delete Any Ticket      | ❌   | ✅    | ❌    |
| Assign Ticket          | ❌   | ✅    | ❌    |

---

## 🔐 Middleware

### 1. Authentication Middleware (`authMiddleware`)

**Location:** `src/middlewares/auth.Middleware.js`

**Purpose:** Verify JWT token and extract user info

**Process:**

1. Extract `Authorization` header
2. Check "Bearer <token>" format
3. Verify JWT signature using `JWT_ACCESS_SECRET`
4. Extract and attach user data to `req.user`
5. Pass control to next middleware/controller

**Usage:**

```javascript
router.get("/protected", authMiddleware, controller);
```

**Error Responses:**

- `401` - Missing token, invalid format, expired, or invalid signature

---

### 2. Role Authorization Middleware (`allowRoles`)

**Location:** `src/middlewares/role.Middleware.js`

**Purpose:** Check if user has required role

**Usage:**

```javascript
router.get("/admin", authMiddleware, allowRoles("admin"), controller);
router.post(
  "/manage",
  authMiddleware,
  allowRoles("admin", "agent"),
  controller,
);
```

**Error Responses:**

- `401` - Authentication required
- `403` - User role not in allowed roles

---

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (v14+)
- MongoDB (local or cloud - MongoDB Atlas)
- npm or yarn

### 1. Clone Repository

```bash
git clone <repository-url>
cd help-desk/server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

```env
# Server
PORT=8080
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/helpdesk
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/helpdesk

# JWT Secrets (generate strong random strings)
JWT_ACCESS_SECRET=your_access_token_secret_here_min_32_chars
JWT_REFRESH_SECRET=your_refresh_token_secret_here_min_32_chars
```

### 4. Start MongoDB

**Local MongoDB:**

```bash
mongod
```

**Or use MongoDB Atlas (cloud)** - update `MONGO_URI` in `.env`

### 5. Run Server

**Development (with nodemon):**

```bash
npm run dev
# or
nodemon server.js
```

**Production:**

```bash
npm start
# or
node server.js
```

Server runs on: `http://localhost:8080`

---

## 📝 Input Validation Schemas (Joi)

### User Registration Schema

```javascript
{
  name: String (required, min 3)
  email: String (required, valid email)
  password: String (required, min 6)
  role: String (optional, default "user", enum: user|admin|agent)
}
```

### User Login Schema

```javascript
{
  email: String (required, valid email)
  password: String (required, min 6)
}
```

### Ticket Creation Schema

```javascript
{
  title: String (required)
  description: String (required)
  category: String (required)
  priority: String (optional, default "medium", enum: low|medium|high)
  status: String (optional, default "open", enum: open|in progress|resolved|closed)
  assignedTo: ObjectId (optional, valid MongoDB ID)
}
```

### Ticket Update Schema

```javascript
{
  title: String (optional)
  description: String (optional)
  category: String (optional)
  priority: String (optional, enum: low|medium|high)
  status: String (optional, enum: open|in progress|resolved|closed)
}
```

---

## 🧪 Testing API Endpoints

### Using Postman/Thunder Client

**1. Register User**

```
POST http://localhost:8080/api/user/register
Body (JSON):
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**2. Login**

```
POST http://localhost:8080/api/user/login
Body (JSON):
{
  "email": "john@example.com",
  "password": "password123"
}
```

**3. Create Ticket** (copy accessToken from login response)

```
POST http://localhost:8080/api/ticket
Headers:
  Authorization: Bearer <accessToken>
  Content-Type: application/json
Body (JSON):
{
  "title": "Bug report",
  "description": "The app crashes on login",
  "category": "Bug",
  "priority": "high"
}
```

**4. Get My Tickets**

```
GET http://localhost:8080/api/ticket/my-ticket
Headers:
  Authorization: Bearer <accessToken>
```

**5. Get Ticket Detail**

```
GET http://localhost:8080/api/ticket/<ticket_id>
Headers:
  Authorization: Bearer <accessToken>
```

---

## 📂 Project Structure

```
server/
├── server.js                          # Entry point
├── package.json                       # Dependencies
├── .env                               # Environment variables (not in git)
├── .gitignore
├── README.md                          # This file
│
├── src/
│   ├── config/
│   │   └── DBConnection.js            # MongoDB connection logic
│   │
│   ├── controller/
│   │   ├── User.Controller.js         # Auth logic (register, login, refresh)
│   │   └── Ticket.Controller.js       # Ticket CRUD operations
│   │
│   ├── middlewares/
│   │   ├── auth.Middleware.js         # JWT verification
│   │   └── role.Middleware.js         # Role-based access control
│   │
│   ├── models/
│   │   ├── User.Model.js              # User schema definition
│   │   └── Ticket.Model.js            # Ticket schema definition
│   │
│   ├── routes/
│   │   ├── User.Route.js              # User endpoints
│   │   └── Ticket.Route.js            # Ticket endpoints
│   │
│   └── utils/
│       ├── Schema.Validation.js       # Joi validation schemas
│       └── utils.functions.js         # Helper functions (generateToken)
│
└── node_modules/                      # Installed packages
```

---

## ✅ Current Implementation Status

### ✅ Completed Features

- [x] User authentication (register, login)
- [x] JWT access & refresh tokens
- [x] Password hashing (Argon2)
- [x] Role-based access control (user, admin, agent)
- [x] Ticket CRUD operations
- [x] Ticket filtering by status, priority
- [x] Pagination for ticket lists
- [x] User can view own tickets
- [x] Admin can view all tickets
- [x] Ticket assignment to agents
- [x] Input validation (Joi)
- [x] Error handling
- [x] MongoDB integration
- [x] Proper HTTP status codes

### 🔄 In Progress / TODO

**Backend:**

- [ ] Comments/discussion thread on tickets
- [ ] Internal notes (admin-only comments)
- [ ] Ticket history/audit log
- [ ] Notification system (email/in-app)
- [ ] Search functionality (title, user, keyword)
- [ ] Advanced filtering (date range, multiple filters)
- [ ] Bulk operations (bulk update status)
- [ ] Rate limiting
- [ ] Request logging (Morgan)
- [ ] API documentation (Swagger/OpenAPI)

**Frontend:**

- [ ] React application setup
- [ ] Login/Register pages
- [ ] Ticket dashboard
- [ ] Ticket creation form
- [ ] Ticket list view with filters
- [ ] Ticket detail page
- [ ] Admin dashboard with stats
- [ ] User profile page
- [ ] Responsive design
- [ ] Dark mode

**Real-time Features:**

- [ ] WebSocket integration (Socket.IO)
- [ ] Live ticket status updates
- [ ] Real-time notifications
- [ ] Live comment thread
- [ ] Typing indicators

**DevOps & Deployment:**

- [ ] Docker containerization
- [ ] Docker Compose setup
- [ ] MongoDB Atlas configuration
- [ ] Backend deployment (Render/Railway/Heroku)
- [ ] Frontend deployment (Vercel)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Environment management (staging/production)

**Testing & Documentation:**

- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] API endpoint testing (Postman collection)
- [ ] API documentation (Swagger)
- [ ] Deployment guide

---

## 🚀 Next Steps

1. **Test Current API** - Use Postman to test all endpoints
2. **Set Up Frontend** - Create React app with Vite/CRA
3. **Implement UI** - Build login, register, ticket pages
4. **Add Socket.IO** - Real-time ticket updates
5. **Deploy** - Docker + Heroku/Render for backend, Vercel for frontend

---

## 🐛 Known Issues & Fixes

### Fixed Issues

- ✅ CastError when invalid ObjectId passed to routes - Added ObjectId validation
- ✅ MissingSchemaError for User model - Fixed case-sensitivity in references
- ✅ Typo in error message - "alreadly" → "already"
- ✅ Missing controller in PATCH route - Added updateTicketController
- ✅ Env variable inconsistency - JWT_ACCESS_SECRET and JWT_REFRESH_SECRET

### Current Limitations

- Single-threaded Node.js (scaling requires load balancer)
- No caching layer (Redis not implemented)
- No rate limiting
- Passwords stored after hashing (Argon2)
- No two-factor authentication (2FA)
- No email verification

---

## 📚 API Response Format

### Success Response (2xx)

```javascript
{
  "message": "Operation successful",
  "data": { /* response data */ },
  "accessToken": "..." // if applicable
}
```

### Error Response (4xx, 5xx)

```javascript
{
  "message": "Error description",
  "error": "Validation error details"
}
```

---

## 🔗 Environment Variables Reference

| Variable             | Description          | Example                              |
| -------------------- | -------------------- | ------------------------------------ |
| `PORT`               | Server port          | `8080`                               |
| `NODE_ENV`           | Environment          | `development` \| `production`        |
| `MONGO_URI`          | MongoDB connection   | `mongodb://localhost:27017/helpdesk` |
| `JWT_ACCESS_SECRET`  | Access token secret  | `your_secret_32_chars_min`           |
| `JWT_REFRESH_SECRET` | Refresh token secret | `your_refresh_secret_32_chars_min`   |

---

## 📞 Support & Troubleshooting

**MongoDB Connection Error:**

```bash
# Check if MongoDB is running
mongod

# Or use MongoDB Atlas cloud database
# Update MONGO_URI in .env
```

**JWT Token Errors:**

```
"Access token required" - Add Authorization header
"Invalid authorization format" - Use "Bearer <token>" format
"Access token expired" - Use /api/user/refresh endpoint
```

**Validation Errors:**

```
Check request body matches schema requirements
Review error.details[0].message for specific field error
```

---

## 📄 License

ISC

---

## 👨‍💻 Author

**Vikram** - Project Developer

---

**Last Updated:** August 18, 2024
