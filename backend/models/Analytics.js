const mongoose = require('mongoose');

const analyticsSchema = mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    avgScore: {
        type: Number,
        default: 0
    },
    completionRate: {
        type: Number, // Percentage
        default: 0
    },
    activeStudents: {
        type: Number,
        default: 0
    },
    totalEnrollments: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
