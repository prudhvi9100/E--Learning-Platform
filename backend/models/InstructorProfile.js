const mongoose = require('mongoose');

const instructorProfileSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    bio: {
        type: String,
        required: true
    },
    expertise: [{
        type: String,
        required: true
    }],
    coursesCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
}, {
    timestamps: true
});

const InstructorProfile = mongoose.model('InstructorProfile', instructorProfileSchema);

module.exports = InstructorProfile;
