const express = require('express');
const router = express.Router();
const {
    registerUser,
    authUser,
    logoutUser,
    getUserProfile,
    refreshToken
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshToken);
router.get('/profile', protect, getUserProfile);

module.exports = router;
