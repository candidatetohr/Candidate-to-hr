import express from 'express';
import { register, login, getMe, updateProfile, googleAuth, verifyEmail, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/verifyemail/:token', verifyEmail);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);

router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

export default router;
