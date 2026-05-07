const User = require('../models/User');
const jwt = require('jsonwebtoken');


// 🔐 Generate Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1d' }
  );
};


// ================= REGISTER (USER ONLY) =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All required fields missing' });
    }

    const normalizedEmail = email.toLowerCase();

    let user = await User.findOne({ email: normalizedEmail });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email: normalizedEmail,
      password,
      phone,
      location,
      role: 'user' // 🔥 force role
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name,
        email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({
      message: 'Server error during registration',
      error: err.message
    });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({
      message: 'Server error during login',
      error: err.message
    });
  }
};


// ================= CREATE EMPLOYEE (ADMIN ONLY) =================
exports.createEmployee = async (req, res) => {
  try {
    // 🔥 Only admin allowed
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, email, password, phone, location } = req.body;

    const normalizedEmail = email.toLowerCase();

    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email: normalizedEmail,
      password,
      phone,
      location,
      role: 'employee' // 🔥 correct role
    });

    await user.save();

    res.status(201).json({
      message: 'Employee created successfully',
      user: { id: user._id, name, email }
    });

  } catch (err) {
    res.status(500).json({
      message: 'Error creating employee',
      error: err.message
    });
  }
};


// ================= GET ALL USERS =================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching users',
      error: err.message
    });
  }
};


// ================= GET EMPLOYEES =================
exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password');
    res.json({ employees });
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching employees',
      error: err.message
    });
  }
};
