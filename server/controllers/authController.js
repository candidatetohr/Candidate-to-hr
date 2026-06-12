import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let supabase;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, company, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Name, email, password, and role are required.' });
  }

  if (role === 'recruiter' && !company?.trim()) {
    return res.status(400).json({ success: false, message: 'Company name is required for recruiters.' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    company: company?.trim() || '',
    role,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'Login successful.',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      company: req.user.company,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, company } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { ...(name && { name }), ...(company && { company }) },
    { new: true, runValidators: true }
  );

  res.json({ success: true, user });
});

// @desc    Login/Register via Supabase Google OAuth
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = asyncHandler(async (req, res) => {
  const { access_token } = req.body;
  if (!access_token) {
    return res.status(400).json({ success: false, message: 'Access token is required.' });
  }
  if (!supabase) {
    return res.status(500).json({ success: false, message: 'Supabase is not configured on the server.' });
  }

  // Verify the token with Supabase
  const { data, error } = await supabase.auth.getUser(access_token);
  if (error || !data?.user) {
    return res.status(401).json({ success: false, message: 'Invalid or expired Google token.' });
  }

  const email = data.user.email.toLowerCase().trim();
  const name = data.user.user_metadata?.full_name || email.split('@')[0];
  const avatar = data.user.user_metadata?.avatar_url || null;

  // Check if user exists
  let user = await User.findOne({ email });

  if (!user) {
    // Create a new user (defaulting to 'candidate' role)
    user = await User.create({
      name,
      email,
      role: 'candidate',
      authProvider: 'google',
      avatar
    });
  } else {
    // If user exists but used local auth before, we can still let them log in,
    // or optionally update their avatar.
    if (avatar && !user.avatar) {
      user.avatar = avatar;
      await user.save();
    }
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'Google login successful.',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  });
});
