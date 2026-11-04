const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isConfiguredAdmin = (email) => (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((adminEmail) => adminEmail.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());

const createToken = (userId) => jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'secretkey123',
    { expiresIn: '30d' }
);

const register = async (req, res) => {
    try {
        const { name, email, password, age, bloodGroup, contact, city } = req.body;
        const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

        if (!name || !normalizedEmail || typeof password !== 'string' || !password || !bloodGroup || !contact || !city) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ message: 'An account with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            age: age ? Number(age) : undefined,
            bloodGroup,
            phone: contact,
            address: city,
            role: isConfiguredAdmin(normalizedEmail) ? 'admin' : 'donor'
        });

        return res.status(201).json({
            message: 'Registration successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Unable to register user' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
        if (!normalizedEmail || typeof password !== 'string' || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: normalizedEmail });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (isConfiguredAdmin(user.email) && user.role !== 'admin') {
            user.role = 'admin';
            await user.save();
        }

        return res.status(200).json({
            token: createToken(user._id.toString()),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Unable to log in' });
    }
};

module.exports = { register, login };