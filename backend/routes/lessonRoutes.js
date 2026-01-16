const express = require('express');
const router = express.Router();
const { addLesson, getLessons } = require('../controllers/lessonController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/:courseId')
    .get(getLessons)
    .post(protect, authorize('instructor', 'admin'), addLesson);

module.exports = router;
