import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

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

  // Create verification token
  const verificationToken = crypto.randomBytes(20).toString('hex');

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    company: company?.trim() || '',
    role,
    isVerified: false,
    verificationToken
  });

  // Send verification email
  const frontendUrl = process.env.FRONTEND_URL || 'https://www.candidatetohr.online';
  const verifyUrl = `${frontendUrl}/verify-email/${verificationToken}`;
  const message = `Welcome to CandidateToHR!\n\nPlease verify your email address by clicking the link below:\n\n${verifyUrl}\n\nThis link will expire in 24 hours. If you did not create an account, you can ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'CandidateToHR - Email Verification',
      message
    });
    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.',
    });
  } catch (err) {
    user.verificationToken = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({ success: false, message: 'Email could not be sent' });
  }
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

  if (!user.isVerified) {
    return res.status(401).json({ success: false, message: 'Please verify your email before logging in.' });
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

// @desc    Verify email
// @route   GET /api/auth/verifyemail/:token
// @access  Public
export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({ verificationToken: req.params.token });

  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid or expired verification token.' });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: 'Email verified successfully. You can now log in.' });
});

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() });

  if (!user) {
    return res.status(404).json({ success: false, message: 'There is no user with that email.' });
  }

  const resetToken = crypto.randomBytes(20).toString('hex');

  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save({ validateBeforeSave: false });

  const frontendUrl = process.env.FRONTEND_URL || 'https://www.candidatetohr.online';
  const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
  const message = `You requested a password reset for your CandidateToHR account.\n\nClick the link below to set a new password:\n\n${resetUrl}\n\nThis link expires in 10 minutes. If you did not request this, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'CandidateToHR - Password Reset',
      message
    });
    res.status(200).json({ success: true, message: 'Email sent' });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({ success: false, message: 'Email could not be sent' });
  }
});

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid token' });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ success: true, message: 'Password reset successful.' });
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

  const { data, error } = await supabase.auth.getUser(access_token);
  if (error || !data?.user) {
    return res.status(401).json({ success: false, message: 'Invalid or expired Google token.' });
  }

  const email = data.user.email.toLowerCase().trim();
  const name = data.user.user_metadata?.full_name || email.split('@')[0];
  const avatar = data.user.user_metadata?.avatar_url || null;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      role: 'candidate',
      authProvider: 'google',
      avatar,
      isVerified: true // Google users are implicitly verified
    });
  } else {
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
