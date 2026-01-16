const mongoose = require('mongoose');

const quizAttemptSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    passed: {
        type: Boolean,
        default: false
    },
    answers: [{
        questionId: String,
        selectedOption: String,
        isCorrect: Boolean
    }],
    attemptedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

module.exports = QuizAttempt;
