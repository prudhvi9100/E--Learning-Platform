const express = require('express');
const router = express.Router();
const { createQuiz, getQuizByLesson, submitQuiz } = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('instructor', 'admin'), createQuiz);
router.get('/:lessonId', protect, getQuizByLesson);
router.post('/attempt', protect, submitQuiz);

module.exports = router;
