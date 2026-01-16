const express = require('express');
const router = express.Router();
const { enrollCourse, getMyEnrollments, updateLessonProgress, getCourseProgress } = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/:courseId', protect, enrollCourse);
router.get('/my-courses', protect, getMyEnrollments);
router.route('/progress')
    .put(protect, authorize('student'), updateLessonProgress);

router.route('/:courseId/progress')
    .get(protect, authorize('student'), getCourseProgress);

module.exports = router;
