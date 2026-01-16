const express = require('express');
const router = express.Router();
const { getInstructorAnalytics, getStudentAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/instructor', protect, authorize('instructor'), getInstructorAnalytics);
router.get('/student', protect, authorize('student'), getStudentAnalytics);

module.exports = router;
