const express = require('express');
const router = express.Router();
const { getMyProfile, updateStudentProfile, updateInstructorProfile } = require('../controllers/profileController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/me', protect, getMyProfile);
router.put('/student', protect, authorize('student'), updateStudentProfile);
router.put('/instructor', protect, authorize('instructor'), updateInstructorProfile);

module.exports = router;
