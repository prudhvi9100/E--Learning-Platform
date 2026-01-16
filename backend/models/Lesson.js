const mongoose = require('mongoose');

const lessonSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    // We will link this lesson to a specific course
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    type: {
        type: String,
        enum: ['video', 'document', 'quiz'],
        default: 'video'
    },
    // This will store the URL path to the file (e.g., /uploads/lessons/video.mp4)
    content: {
        type: String,
        required: true
    },
    duration: {
        type: String, // e.g., "10:30"
        default: "0:00"
    },
    isFree: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
