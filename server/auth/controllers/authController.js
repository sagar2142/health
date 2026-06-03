const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret'; // Use env var in production

exports.register = async (req, res) => {
  const { email, password, name, phone, bloodGroup } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: 'Email and password required' });
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, error: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, name, phone, bloodGroup });
    await user.save();
    // Generate JWT token for the new user
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
    // Return token and user info for redirecting to homescreen
    res.json({
      success: true,
      token,
      user: { email: user.email, name: user.name, phone: user.phone, bloodGroup: user.bloodGroup }
    });
  } catch (err) {
    // Send actual error message for debugging
    res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: 'Email and password required' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ success: false, error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ 
      token, 
      user: { 
        email: user.email, 
        name: user.name, 
        phone: user.phone, 
        bloodGroup: user.bloodGroup 
      } 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

exports.logout = (req, res) => {
  // For JWT, logout is handled client-side by deleting the token
  res.json({ success: true });
};

exports.updateProfile = async (req, res) => {
  const { email, name, phone, bloodGroup } = req.body;
  if (!email) return res.status(400).json({ success: false, error: 'Email required' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bloodGroup !== undefined) user.bloodGroup = bloodGroup;
    await user.save();
    res.json({
      success: true,
      user: { email: user.email, name: user.name, phone: user.phone, bloodGroup: user.bloodGroup }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
};

exports.deleteAccount = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: 'Email required' });
  try {
    const user = await User.findOneAndDelete({ email });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: 'Email required' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        phone: user.phone,
        bloodGroup: user.bloodGroup
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
};
