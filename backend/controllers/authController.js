const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const admin = require('../config/firebase');

// @desc    Verify Firebase token and login/register user
// @route   POST /api/auth/login
// @access  Public
const syncFirebaseUser  = asyncHandler(async (req, res) => {
  const { token } = req.body;

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name } = decodedToken;

    // Find or create user in MongoDB
    let user = await User.findOne({ uid });
    
    if (!user) {
      user = await User.create({
        uid,
        email,
        name: name || email.split('@')[0],
        avatar:"",
        emailVerified:false,
      });
    }

    res.status(200).json({
      _id: user._id,
      uid: user.uid,
      name: user.name,
      email: user.email,
      // You can still generate a JWT for additional backend auth if needed
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Firebase auth error:', error);
    res.status(401);
    throw new Error('Invalid authentication token');
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = asyncHandler(async (req, res) => {
  // req.user is set by our Firebase auth middleware
  const user = await User.findOne({ uid: req.user.uid }).select('-password');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  res.status(200).json(user);
});

module.exports = {
  syncFirebaseUser,
  getCurrentUser,
};