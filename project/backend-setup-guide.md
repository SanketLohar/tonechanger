# Backend Setup Guide for ReTone

## 1. Backend Structure (Node.js + Express)

Create a new backend project:

```bash
mkdir retone-backend
cd retone-backend
npm init -y
```

## 2. Install Backend Dependencies

```bash
npm install express cors dotenv bcryptjs jsonwebtoken multer
npm install openai @google/generative-ai  # For AI integration
npm install mongoose  # If using MongoDB
npm install -D nodemon
```

## 3. Basic Backend Structure

```
backend/
├── server.js
├── routes/
│   ├── auth.js
│   ├── email.js
│   └── user.js
├── middleware/
│   └── auth.js
├── models/
│   └── User.js
├── controllers/
│   ├── authController.js
│   ├── emailController.js
│   └── userController.js
└── .env
```

## 4. Sample Backend Code

### server.js
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/email', require('./routes/email'));
app.use('/api/user', require('./routes/user'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### routes/auth.js
```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save user (implement your database logic)
    const user = { id: Date.now(), name, email, password: hashedPassword };
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user (implement your database logic)
    const user = { id: 1, email, name: 'Test User' }; // Mock user
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
```

### routes/email.js
```javascript
const express = require('express');
const { OpenAI } = require('openai');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Rewrite email
router.post('/rewrite', async (req, res) => {
  try {
    const { originalText, tone } = req.body;
    
    const prompt = `Rewrite the following email in a ${tone} tone while maintaining the original message:

Original email:
${originalText}

Rewritten email:`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500
    });

    const rewrittenText = completion.choices[0].message.content;

    res.json({
      rewrittenText,
      originalText,
      tone,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ message: 'Failed to rewrite email' });
  }
});

module.exports = router;
```

## 5. Environment Variables (.env)

```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key
MONGODB_URI=mongodb://localhost:27017/retone
```

## 6. Testing the Integration

### Start Backend:
```bash
cd retone-backend
npm run dev  # or node server.js
```

### Start Frontend:
```bash
cd retone-frontend
npm run dev
```

### Test Flow:
1. Register a new user
2. Login with credentials
3. Try rewriting an email with different tones
4. Check browser network tab for API calls
5. Check backend console for logs

## 7. API Testing with Postman/Thunder Client

### Register User:
```
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### Login:
```
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### Rewrite Email:
```
POST http://localhost:3001/api/email/rewrite
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "originalText": "Hey, can you send me the report?",
  "tone": "formal"
}
```

## 8. Troubleshooting

- **CORS Issues**: Make sure backend CORS is configured for your frontend URL
- **API Key Issues**: Verify OpenAI/Gemini API keys are valid
- **Network Errors**: Check if backend is running on correct port
- **Auth Issues**: Verify JWT token is being sent in requests
- **Environment Variables**: Make sure .env file is loaded properly

## 9. Next Steps

1. Add database integration (MongoDB/PostgreSQL)
2. Implement user sessions and refresh tokens
3. Add rate limiting and security middleware
4. Deploy backend to cloud (Heroku, Railway, etc.)
5. Add email history and user preferences
6. Implement file upload processing