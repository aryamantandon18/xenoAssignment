const express = require('express');
const router = express.Router();
const {syncFirebaseUser, getCurrentUser } = require('../controllers/authController');
const isAuthenticated = require('../middlewares/authMiddleware');

// This endpoint is called after successful Firebase auth
router.post('/sync-user', isAuthenticated, syncFirebaseUser);
router.get('/me',isAuthenticated,getCurrentUser);

module.exports = router;