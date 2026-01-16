const Recommendation = require('../models/Recommendation');
const StudentProfile = require('../models/StudentProfile');
const Course = require('../models/Course');

// @desc    Get course recommendations
// @route   GET /api/recommendations
// @access  Private/Student
const getRecommendations = async (req, res) => {
    try {
        const studentId = req.user._id;

        // Check if there are existing recommendations
        let recommendation = await Recommendation.findOne({ studentId }).populate('recommendedCourses');

        if (recommendation) {
            return res.json(recommendation);
        }

        // Logic to generate simple recommendations (Mock AI for now)
        // 1. Get student interests
        const profile = await StudentProfile.findOne({ studentId });
        const interests = profile ? profile.interests : [];

        // 2. Find courses matching interests
        let recommendedCourses = [];
        if (interests.length > 0) {
            recommendedCourses = await Course.find({
                category: { $in: interests }
            }).limit(5);
        } else {
            // Default to popular/beginner courses if no interests
            recommendedCourses = await Course.find({ level: 'Beginner' }).limit(5);
        }

        const courseIds = recommendedCourses.map(c => c._id);

        // 3. Save recommendations
        const newRec = new Recommendation({
            studentId,
            recommendedCourses: courseIds,
            reason: interests.length > 0 ? 'Based on your interests' : 'Popular beginner courses'
        });

        await newRec.save();
        await newRec.populate('recommendedCourses');

        res.json(newRec);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getRecommendations
};
