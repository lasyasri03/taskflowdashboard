# TaskFlow Dashboard - Full Stack Application

A scalable web application with authentication and task management dashboard built with React, Node.js/Express, and MongoDB.

## Features

✅ **User Authentication**
- User registration and login with JWT tokens
- Password hashing with bcryptjs
- Protected routes and API endpoints
- Secure token storage in localStorage

✅ **Dashboard**
- Create, read, update, and delete tasks
- Filter tasks by status (pending, in-progress, completed)
- Filter tasks by priority (low, medium, high)
- Search tasks by title and description
- View task statistics (total, completed, in-progress)
- Responsive design with modern UI

✅ **Security**
- Password hashing and validation
- JWT-based authentication
- Server-side validation
- CORS protection
- Secure API endpoints

✅ **Scalability**
- Modular code structure
- Separated concerns (controllers, models, routes, middleware)
- Database indexing ready
- API versioning support
- Environment configuration

## Project Structure

```
taskflowdashboard/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── styles/
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Navbar.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflowdb
JWT_SECRET=your_jwt_secret_key_change_in_production
FRONTEND_URL=http://localhost:5173
```

4. Start the server:
```bash
npm start      # Production
npm run dev    # Development (with nodemon)
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory (taskflowdashboard):
```bash
cd taskflowdashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201 Created):
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Get Current User
```
GET /auth/me
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-02-10T08:00:00.000Z"
  }
}
```

### Task Endpoints

#### Create Task
```
POST /tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Build API",
  "description": "Create RESTful API endpoints",
  "priority": "high",
  "status": "in-progress",
  "dueDate": "2026-02-15"
}

Response (201 Created):
{
  "success": true,
  "task": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Build API",
    "description": "Create RESTful API endpoints",
    "priority": "high",
    "status": "in-progress",
    "dueDate": "2026-02-15T00:00:00.000Z",
    "user": "507f1f77bcf86cd799439011",
    "createdAt": "2026-02-10T08:00:00.000Z",
    "updatedAt": "2026-02-10T08:00:00.000Z"
  }
}
```

#### Get All Tasks
```
GET /tasks?status=pending&priority=high&search=api
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "count": 2,
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Build API",
      "description": "Create RESTful API endpoints",
      "priority": "high",
      "status": "pending",
      "dueDate": "2026-02-15T00:00:00.000Z",
      "user": "507f1f77bcf86cd799439011",
      "createdAt": "2026-02-10T08:00:00.000Z",
      "updatedAt": "2026-02-10T08:00:00.000Z"
    }
  ]
}
```

Query Parameters:
- `status`: Filter by status (pending, in-progress, completed)
- `priority`: Filter by priority (low, medium, high)
- `search`: Search in title and description

#### Get Single Task
```
GET /tasks/{taskId}
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "task": { ... }
}
```

#### Update Task
```
PUT /tasks/{taskId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Build API",
  "status": "completed",
  "priority": "high"
}

Response (200 OK):
{
  "success": true,
  "task": { ... }
}
```

#### Delete Task
```
DELETE /tasks/{taskId}
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## Postman Collection

Import the included `TaskFlow.postman_collection.json` into Postman for easy API testing.

The collection includes:
- Complete authentication flow (Register → Login)
- All CRUD operations for tasks
- Pre-configured endpoints and headers
- Environment variables for tokens

## Security Practices

1. **Password Security**
   - Passwords are hashed using bcryptjs with 10 salt rounds
   - Never stored in plain text
   - Compared securely during login

2. **Authentication**
   - JWT tokens used for session management
   - Tokens expire after 7 days
   - Bearer token validation on protected routes

3. **Authorization**
   - Users can only access their own tasks
   - Server-side verification of ownership
   - Protected middleware on all task routes

4. **Data Validation**
   - Client-side validation on frontend
   - Server-side validation on backend
   - Input sanitization and error handling

5. **CORS Protection**
   - Configured to accept requests only from frontend URL
   - Credentials included in cross-origin requests

## Code Quality & Scalability

### Modular Architecture
- **Controllers**: Business logic separated from routes
- **Models**: Mongoose schemas with validation
- **Middleware**: Reusable authentication logic
- **Routes**: Clean endpoint definitions

### Database Optimization
- Indexed User email field for fast lookups
- Task user reference for efficient queries
- Lean queries to reduce data transfer

### Error Handling
- Centralized error responses
- Consistent error message format
- Proper HTTP status codes

### Environment Management
- Environment variables for configuration
- Different settings for development/production
- Sensible defaults where applicable

## Scaling Recommendations

### Short-term (Next 3-6 months)
1. **Database**: Add indexes on frequently queried fields
```javascript
userSchema.index({ email: 1 });
taskSchema.index({ user: 1, status: 1 });
```

2. **Caching**: Implement Redis for frequently accessed data
```javascript
// Cache user profile and task lists
const cachedTasks = await redis.get(`tasks:${userId}`);
```

3. **Rate Limiting**: Add request rate limiting
```javascript
const rateLimit = require('express-rate-limit');
```

### Medium-term (6-12 months)
1. **API Versioning**: Support multiple API versions
```
GET /api/v1/tasks
GET /api/v2/tasks
```

2. **Pagination**: Add pagination to task listings
```javascript
const page = req.query.page || 1;
const limit = 10;
const skip = (page - 1) * limit;
```

3. **JWT Refresh**: Implement refresh tokens for better security
```javascript
const refreshToken = generateRefreshToken(user._id);
```

### Long-term (12+ months)
1. **Microservices**: Split into separate services
   - Auth Service
   - Task Service
   - User Service

2. **Message Queue**: Implement task queue with Bull/RabbitMQ
```javascript
const taskQueue = new Queue('processTask', redisClient);
```

3. **Real-time Updates**: Add WebSocket support for live updates
```javascript
const io = require('socket.io')(server);
```

4. **GraphQL**: Consider GraphQL for more flexible queries
```javascript
// GraphQL endpoint for complex queries
POST /graphql
```

## Testing

To test the application:

1. **Register a new user** at Login page
2. **Login** with your credentials
3. **Create tasks** with different priorities and statuses
4. **Search** tasks by title
5. **Filter** by status or priority
6. **Edit** a task to change its status
7. **Delete** a task
8. **Logout** to return to login

## Demo Credentials

After creating a user, use those credentials to login.

## Troubleshooting

### Backend Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env is correct
- Verify PORT is not in use

### Frontend Can't Connect to Backend
- Ensure backend is running on port 5000
- Check CORS configuration in server.js
- Verify FRONTEND_URL in .env matches your frontend URL

### JWT Token Error
- Check token is provided in Authorization header
- Ensure JWT_SECRET matches in .env
- Token may have expired (valid for 7 days)

## License

This project is open source and available for educational purposes.

## Contact

For questions or issues, please open an issue in the repository.

---

**Built with:**
- React.js + Vite
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- TailwindCSS
