const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./user');
const protect = require('./middleware');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Input validation & sanitization
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }

        // 2. Check for duplicate email
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(409).json({ message: 'Email is already registered.' });
        }

        // 3. Hash password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create and save user
        const newUser = await User.create({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        res.status(201).json({
            message: 'User registered successfully!',
            user: { id: newUser._id, username: newUser.username, email: newUser.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & return JWT
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password.' });
        }

        // 1. Check if user exists
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // 2. Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // 3. Generate JWT Token (expires in 1 hour)
        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful!',
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login.', error: error.message });
    }
});

// @route   GET /api/auth/dashboard
// @desc    Protected route example
router.get('/dashboard', protect, (req, res) => {
    res.status(200).json({
        message: `Welcome to your protected dashboard, ${req.user.username}!`,
        user: req.user
    });
});

module.exports = router;