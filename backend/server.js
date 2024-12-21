require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Initialize Express app
const app = express();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGO_URI', 'PORT'];
const missingVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
  console.error(`Missing environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

const { JWT_SECRET, MONGO_URI, PORT } = process.env;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(express.json());

// Rate Limiting for sensitive routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(['/api/login', '/api/register'], limiter);

// MongoDB Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  username: { type: String, required: true, minlength: 3 },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'trainer', 'trainee'], default: 'trainee' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

// Example course data
const mockCourses = [
  { id: 1, title: 'Basic Horse Training', students: 20 },
  { id: 2, title: 'Advanced Horse Riding', students: 15 },
];

// Middleware: Authenticate Token
function authenticateToken(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access Denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: 'Invalid Token.' });
  }
}

// Middleware: Role Authorization
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden. Access not allowed.' });
    }
    next();
  };
}

// Routes

// Register Route
app.post('/api/register', async (req, res, next) => {
  try {
    const { email, username, password, role } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (err) {
    next(err);
  }
});

// Login Route
app.post('/api/login', async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ success: false, message: 'Email/Username and password are required.' });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid password.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });

    res.json({ success: true, message: 'Login successful!', username: user.username, role: user.role, token });
  } catch (err) {
    next(err);
  }
});

// Admin Dashboard Route
app.get('/api/admin-dashboard', authenticateToken, authorizeRoles('admin'), async (req, res, next) => {
  try {
    console.log('Token verified, fetching users...');

    // Fetch all users without passwords
    const users = await User.find().select('-password');
    console.log('Users fetched:', users);

    res.status(200).json({ success: true, message: 'Admin data fetched successfully.', data: { users } });
  } catch (err) {
    console.error('Error in admin-dashboard route:', err);
    next(err);
  }
});

// Trainer Dashboard Route
app.get('/api/trainer-dashboard', authenticateToken, authorizeRoles('trainer'), async (req, res, next) => {
  try {
    const trainerId = req.user.id; // Extract trainer ID from token
    const trainer = await User.findById(trainerId).select('-password'); // Fetch trainer data without password

    if (!trainer || trainer.role !== 'trainer') {
      return res.status(404).json({ success: false, message: 'Trainer not found.' });
    }

    // Send the trainer data along with mock courses
    res.json({ success: true, message: 'Trainer data fetched successfully.', data: { trainer, courses: mockCourses } });
  } catch (err) {
    next(err);
  }
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error.' });
});

// Start Server
app.listen(PORT || 5000, () => {
  console.log(`Server running on port ${PORT || 5000}`);
});
