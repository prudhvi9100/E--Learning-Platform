const mongoose = require('mongoose');

const progressTrackingSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    timeSpent: {
        type: Number, // In seconds/minutes
        default: 0
    }
}, {
    timestamps: true
});

const ProgressTracking = mongoose.model('ProgressTracking', progressTrackingSchema);

module.exports = ProgressTracking;
