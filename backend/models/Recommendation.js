const mongoose = require('mongoose');

const recommendationSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recommendedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    reason: {
        type: String, // e.g., "Based on your interest in AI" or "Because you scored high in Basic Math"
        required: true
    },
    generatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

module.exports = Recommendation;
