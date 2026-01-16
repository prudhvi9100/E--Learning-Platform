const StudentProfile = require('../models/StudentProfile');
const InstructorProfile = require('../models/InstructorProfile');
const User = require('../models/User');

// @desc    Get current user profile (with extended data)
// @route   GET /api/profiles/me
// @access  Private
const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        let profile = null;

        if (user.role === 'student') {
            profile = await StudentProfile.findOne({ userId: user._id });
        } else if (user.role === 'instructor') {
            profile = await InstructorProfile.findOne({ userId: user._id });
        }

        res.json({ user, profile });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update/Create Student Profile
// @route   PUT /api/profiles/student
// @access  Private/Student
const updateStudentProfile = async (req, res) => {
    try {
        const { skillLevel, interests, learningPreferences } = req.body;

        const profile = await StudentProfile.findOneAndUpdate(
            { userId: req.user._id },
            {
                userId: req.user._id,
                skillLevel,
                interests,
                learningPreferences
            },
            { new: true, upsert: true } // Create if not exists
        );

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update/Create Instructor Profile
// @route   PUT /api/profiles/instructor
// @access  Private/Instructor
const updateInstructorProfile = async (req, res) => {
    try {
        const { bio, expertise } = req.body;

        const profile = await InstructorProfile.findOneAndUpdate(
            { userId: req.user._id },
            {
                userId: req.user._id,
                bio,
                expertise
            },
            { new: true, upsert: true }
        );

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getMyProfile,
    updateStudentProfile,
    updateInstructorProfile
};
