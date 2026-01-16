const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Lesson = require('../models/Lesson');

// @desc    Create a quiz for a lesson
// @route   POST /api/quizzes
// @access  Private/Instructor
const createQuiz = async (req, res) => {
    try {
        const { courseId, lessonId, questions, difficultyLevel } = req.body;

        // Verify lesson exists and belongs to course
        if (lessonId) {
            const lesson = await Lesson.findById(lessonId);
            if (!lesson || lesson.courseId.toString() !== courseId) {
                return res.status(400).json({ message: 'Invalid lesson or course mismatch' });
            }
        }

        const quiz = new Quiz({
            courseId,
            lessonId,
            questions,
            difficultyLevel
        });

        const createdQuiz = await quiz.save();
        res.status(201).json(createdQuiz);
    } catch (error) {
        res.status(400).json({ message: 'Invalid quiz data', error: error.message });
    }
};

// @desc    Get quiz for a lesson
// @route   GET /api/quizzes/:lessonId
// @access  Private
const getQuizByLesson = async (req, res) => {
    try {
        // Exclude correct answers for students
        const quiz = await Quiz.findOne({ lessonId: req.params.lessonId });

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // For instructors, return full quiz. For students, hide correct answers.
        if (req.user.role === 'student') {
            const safeQuestions = quiz.questions.map(q => ({
                _id: q._id,
                question: q.question,
                options: q.options,
                marks: q.marks
            }));
            return res.json({ ...quiz.toObject(), questions: safeQuestions });
        }

        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Submit quiz attempt
// @route   POST /api/quizzes/attempt
// @access  Private/Student
const submitQuiz = async (req, res) => {
    try {
        const { quizId, answers } = req.body; // answers: [{ questionId, selectedOption }]
        const studentId = req.user._id;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        let score = 0;
        const totalScore = quiz.questions.reduce((acc, q) => acc + q.marks, 0);
        const gradedAnswers = [];

        answers.forEach(ans => {
            const question = quiz.questions.id(ans.questionId);
            if (question) {
                const isCorrect = question.correctAnswer === ans.selectedOption;
                if (isCorrect) score += question.marks;
                gradedAnswers.push({
                    questionId: ans.questionId,
                    selectedOption: ans.selectedOption,
                    isCorrect
                });
            }
        });

        const passed = (score / totalScore) >= 0.7; // 70% passing criteria

        const attempt = new QuizAttempt({
            studentId,
            quizId,
            score,
            passed,
            answers: gradedAnswers
        });

        await attempt.save();

        res.status(201).json({
            message: 'Quiz submitted',
            score,
            totalScore,
            passed,
            attemptId: attempt._id
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createQuiz,
    getQuizByLesson,
    submitQuiz
};
