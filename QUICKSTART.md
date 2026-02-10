# Quick Start Guide - TaskFlow Dashboard

## Prerequisites

- Node.js v14+ installed
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)
- Git

## Installation & Setup (5 minutes)

### Step 1: Setup MongoDB

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running
# Windows: mongod
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Use it in backend `.env` file

### Step 2: Start the Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Update .env file with your MongoDB URI
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/taskflowdb
# JWT_SECRET=your_secret_key
# FRONTEND_URL=http://localhost:5173

# Start the server
npm run dev
```

Backend will run on: `http://localhost:5000`

### Step 3: Start the Frontend

```bash
# In a new terminal, navigate to frontend
cd taskflowdashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

## Using the Application

### 1. Register a New Account
- Go to http://localhost:5173
- Click "Register here"
- Fill in your details (name, email, password)
- Click Register

### 2. Login
- Use your credentials to login
- You'll be redirected to the dashboard

### 3. Create Your First Task
- Click "+ New Task" button
- Fill in the task details:
  - Title (required)
  - Description (optional)
  - Priority (low, medium, high)
  - Status (pending, in-progress, completed)
  - Due Date (optional)
- Click "Create Task"

### 4. Manage Tasks
- **Search**: Use the search box to find tasks
- **Filter by Status**: Select from dropdown
- **Filter by Priority**: Select from dropdown
- **Edit**: Click "Edit" button on any task card
- **Delete**: Click "Delete" button (with confirmation)

### 5. Logout
- Click "Logout" in the top right corner

## Testing with Postman

1. Import `TaskFlow.postman_collection.json` into Postman
2. Set environment variable: `token` = your JWT token (from login response)
3. Test all endpoints

### Sample API Flow

```
POST /api/auth/register → Get token
POST /api/auth/login → Get token
GET /api/auth/me → Verify user
POST /api/tasks → Create task
GET /api/tasks → List tasks
PUT /api/tasks/:id → Update task
DELETE /api/tasks/:id → Delete task
```

## Troubleshooting

### "Can't connect to backend"
- Check backend is running on port 5000
- Check MongoDB is running
- Check firewall settings

### "Page blank/ white screen"
- Open browser DevTools (F12)
- Check Console tab for errors
- Try refreshing the page

### "Login not working"
- Check backend logs for errors
- Verify MongoDB is connected
- Clear localStorage and try again

```javascript
// To clear localStorage in browser console:
localStorage.clear();
location.reload();
```

### "Token expired error"
- Login again to get a new token
- Tokens expire after 7 days

## Project Files Structure

```
taskflowdashboard/
├── backend/                 # Node.js/Express API
│   ├── models/             # MongoDB schemas
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth middleware
│   ├── routes/             # API endpoints
│   ├── server.js           # Main server file
│   └── package.json
│
├── taskflowdashboard/      # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── styles/         # CSS files
│   │   ├── App.jsx         # Main app
│   │   └── main.jsx        # Entry point
│   └── package.json
│
├── README.md               # Full documentation
├── SCALING.md              # Scalability guide
└── TaskFlow.postman_collection.json
```

## Key Technologies

- **Frontend**: React 19, Vite, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing

## Features Implementation

✅ User Registration & Login with JWT
✅ Create, Read, Update, Delete Tasks
✅ Filter tasks by status and priority
✅ Search tasks
✅ Responsive Design
✅ Protected Routes
✅ User Profile Display
✅ Admin Logout
✅ Full Client & Server Validation
✅ Error Handling

## Next Steps for Production

1. **Add HTTPS**: Use Let's Encrypt certificates
2. **Deploy Database**: Use MongoDB Atlas
3. **Deploy Backend**: Use Heroku, AWS, or DigitalOcean
4. **Deploy Frontend**: Use Vercel, Netlify, or AWS S3
5. **Setup CI/CD**: GitHub Actions or GitLab CI
6. **Add Monitoring**: NewRelic, DataDog, or Sentry
7. **Setup Email**: SendGrid for notifications
8. **Add Testing**: Jest for unit tests, Cypress for E2E

## API Endpoints Quick Reference

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks` - List all user tasks
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Support & Questions

For issues or questions:
1. Check the README.md for detailed documentation
2. Check the SCALING.md for architecture details
3. Review the Postman collection for API examples
4. Check browser console for error messages
5. Check backend logs for server errors

## Performance Tips

- Clear browser cache if seeing old version
- Use Firefox DevTools for faster debugging
- Monitor Network tab to see API calls
- Check MongoDB Atlas metrics for database performance

---

**Ready to start?** Open two terminals and run:
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd taskflowdashboard && npm run dev
```

Visit http://localhost:5173 and start managing your tasks!
