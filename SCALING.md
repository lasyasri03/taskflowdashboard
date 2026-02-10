# SCALING & SCALABILITY GUIDE

## Architecture Overview

The TaskFlow Dashboard is designed with scalability in mind from the ground up. Here's how the application is structured for growth:

## Current Architecture (Phase 1: MVP)

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT TIER                                │
│  React Frontend (Vite) - Single Page Application              │
│  - Authentication pages (Login/Register)                      │
│  - Dashboard with task management                            │
│  - Real-time UI updates with React hooks                     │
└────────────────────────────────────────────────────────────────┘
                              ↓
                    HTTP REST API (JSON)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  APPLICATION TIER                              │
│  Node.js/Express Server - RESTful API                         │
│  - Auth Controller (Register/Login/Get User)                 │
│  - Task Controller (CRUD Operations)                         │
│  - Auth Middleware (JWT Verification)                        │
│  - Error Handling & Validation                               │
└────────────────────────────────────────────────────────────────┘
                              ↓
                  MongoDB Atlas or Local
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATA TIER                                     │
│  MongoDB NoSQL Database                                          │
│  - Users Collection (Indexed by email)                        │
│  - Tasks Collection (Indexed by user_id and status)          │
│  - Automatic indexing for performance                         │
└─────────────────────────────────────────────────────────────────┘
```

## Phase 2: Scaling (3-6 months)

### 1. Caching Layer (Redis)

**Why**: Reduce database load and improve response times

```javascript
// Example: Cache user profile
const redis = require('redis');
const client = redis.createClient();

export const getMe = async (req, res) => {
  const cacheKey = `user:${req.user.id}`;
  
  // Try cache first
  const cached = await client.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  // Fetch from database
  const user = await User.findById(req.user.id);
  
  // Store in cache for 1 hour
  await client.setex(cacheKey, 3600, JSON.stringify(user));
  
  res.json(user);
};
```

**Benefits**:
- 10-100x faster response times for frequently accessed data
- Reduced database connections
- Better user experience for dashboard loading

### 2. Database Optimization

**Add Indexes**:
```javascript
// User model
userSchema.index({ email: 1 });  // For login queries
userSchema.index({ createdAt: -1 });  // For sorting

// Task model
taskSchema.index({ user: 1, status: 1 });  // For filtering
taskSchema.index({ user: 1, createdAt: -1 });  // For sorting
taskSchema.index({ user: 1, title: 'text' });  // For search
```

**Connection Pooling**:
```javascript
// Mongoose automatically uses connection pooling
// Adjust pool size in MongoDB URI
const uri = 'mongodb://localhost:27017/taskflowdb?maxPoolSize=50';
```

### 3. Rate Limiting & API Protection

```javascript
import rateLimit from 'express-rate-limit';

// Limit login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,  // 5 attempts per 15 minutes
  message: 'Too many login attempts, try again later'
});

// Limit all API requests
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minute
  max: 100,  // 100 requests per minute
  message: 'Too many requests, try again later'
});

app.post('/api/auth/login', loginLimiter, login);
app.use('/api/', apiLimiter);
```

### 4. Pagination for Large Datasets

```javascript
export const getTasks = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  const tasks = await Task.find({ user: req.user.id })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Task.countDocuments({ user: req.user.id });

  res.json({
    success: true,
    tasks,
    pagination: {
      current: page,
      total: Math.ceil(total / limit),
      limit
    }
  });
};
```

## Phase 3: Advanced Scaling (6-12 months)

### 1. API Versioning

```
/api/v1/tasks  → Legacy version
/api/v2/tasks  → New version with pagination
```

```javascript
// routes/index.js
import v1Routes from './v1/index.js';
import v2Routes from './v2/index.js';

app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);
```

### 2. Microservices Architecture

```
┌──────────────────┐
│  Auth Service    │  Port 5001
│  - Register      │
│  - Login         │
│  - JWT Generation│
└──────────────────┘
         ↓
┌──────────────────┐
│  API Gateway     │  Port 5000
│  - Route Requests│
│  - Rate Limit    │
│  - Load Balance  │
└──────────────────┘
         ↓
┌──────────────────┐
│  Task Service    │  Port 5002
│  - CRUD Ops      │
│  - Search/Filter │
│  - Notifications │
└──────────────────┘
```

### 3. Message Queue (Bull/RabbitMQ)

```javascript
import Queue from 'bull';

const emailQueue = new Queue('send-email', {
  redis: { host: 'localhost', port: 6379 }
});

// Producer
export const createTask = async (req, res) => {
  // Create task...
  await emailQueue.add(
    { taskId: task._id, userId: req.user.id },
    { delay: 5000 }  // Send email after 5 seconds
  );
};

// Consumer
emailQueue.process(async (job) => {
  const { taskId, userId } = job.data;
  // Send email notification
});
```

### 4. WebSocket for Real-Time Updates

```javascript
import { Server } from 'socket.io';

const io = new Server(server, {
  cors: { origin: 'http://localhost:5173' }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-tasks', (userId) => {
    socket.join(`tasks:${userId}`);
  });

  // When a task is created
  socket.to(`tasks:${userId}`).emit('task:created', newTask);
});

// Frontend
import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

useEffect(() => {
  socket.emit('join-tasks', userId);

  socket.on('task:created', (newTask) => {
    setTasks(prev => [newTask, ...prev]);
  });
}, [userId]);
```

## Phase 4: Enterprise Scale (12+ months)

### 1. GraphQL For Flexible Queries

```graphql
query GetUserTasks {
  user(id: "507f1f77bcf86cd799439011") {
    name
    email
    tasks(status: "pending") {
      id
      title
      priority
      dueDate
    }
  }
}
```

### 2. Database Replication & Sharding

```javascript
// Shard by user ID
const getShardKey = (userId) => {
  const hash = crypto.createHash('md5').update(userId).digest('hex');
  const shardIndex = parseInt(hash, 16) % NUM_SHARDS;
  return shardIndex;
};

// Connect to appropriate shard
const connection = mongoConnections[getShardKey(userId)];
const tasks = await connection.collection('tasks').find({ user: userId });
```

### 3. CDN Integration for Assets

```javascript
// webpack.config.js
output: {
  publicPath: 'https://cdn.taskflow.com/',
}

// In template
<img src="https://cdn.taskflow.com/icons/task.png" />
```

### 4. Monitoring & Analytics

```javascript
import NewRelic from 'newrelic';
import DataDog from 'datadog-api-client';

// Track custom metrics
NewRelic.recordMetric('task/create', 1);

// Log errors to DataDog
DataDog.logger.error('Task creation failed', {
  userId: req.user.id,
  errorMessage: error.message
});
```

## Load Testing & Performance Benchmarks

### Expected Performance at Each Phase

| Metric | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|--------|---------|---------|---------|---------|
| Users | 100 | 1,000 | 10,000 | 100,000+ |
| RPS | 100 | 1,000 | 10,000 | 100,000+ |
| Avg Response | 500ms | 50ms | 20ms | <10ms |
| Uptime | 99% | 99.5% | 99.9% | 99.99% |

### Load Testing Example

```bash
# Using Artillery
npm install -g artillery

# Create load-test.yml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: 'Warm up'
    - duration: 120
      arrivalRate: 50
      name: 'Ramp up'
    - duration: 60
      arrivalRate: 100
      name: 'Spike'

scenarios:
  - name: 'Get User Tasks'
    flow:
      - post:
          url: '/api/auth/login'
          body: '{"email": "test@example.com", "password": "password123"}'
      - get:
          url: '/api/tasks'

# Run test
artillery run load-test.yml
```

## Cost Optimization

### Infrastructure Costs

**Phase 1 (100 users)**:
- Backend: ~$50/month (Heroku eco)
- Database: ~$0/month (MongoDB free tier)
- Hosting: ~$10/month (Vercel)
- **Total: ~$60/month**

**Phase 3 (10,000 users)**:
- Backend: ~$300/month (AWS 3 instances)
- Database: ~$100/month (MongoDB Atlas/AWS)
- Redis: ~$50/month (ElastiCache)
- CDN: ~$50/month (CloudFront)
- **Total: ~$500/month**

**Phase 4 (100,000 users)**:
- Backend: ~$2,000/month (Kubernetes 10+ nodes)
- Database: ~$500/month (Multi-region)
- Redis: ~$200/month (Multi-region)
- CDN: ~$200/month 
- Monitoring: ~$300/month
- **Total: ~$3,200/month**

## Implementation Timeline

```
Week 1-4: Phase 1 ✓ (Current)
  - MVP with basic authentication
  - Single database
  - Manual deployment

Week 5-8: Phase 2 Improvements
  - Add Redis caching
  - Database indexing
  - Rate limiting

Week 9-16: Phase 3 Enhancement
  - Microservices preparation
  - WebSocket integration
  - Message queues

Week 17+: Phase 4 Enterprise
  - Full microservices
  - GraphQL support
  - Global distribution
```

## Conclusion

This architecture provides a clear path from MVP to enterprise-scale application. Start with Phase 1, then systematically implement each phase based on actual traffic and growth metrics.

**Key Principle**: Scale horizontally (add more servers) rather than vertically (make server bigger) for true scalability.
