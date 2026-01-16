const express = require('express');
const router = express.Router();
const { createCourse, getCourses, getCourseById, getMyCourses, addLessonToCourse } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .post(protect, authorize('instructor', 'admin'), upload.single('thumbnail'), createCourse)
    .get(getCourses);

router.route('/my-courses')
    .get(protect, authorize('instructor'), getMyCourses);

router.route('/:id/lessons')
    .post(protect, authorize('instructor'), upload.single('file'), addLessonToCourse);

router.route('/:id')
    .get(getCourseById);

module.exports = router;
