const Analytics = require('../models/Analytics');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const QuizAttempt = require('../models/QuizAttempt');
const ProgressTracking = require('../models/ProgressTracking');

// @desc    Get instructor analytics
// @route   GET /api/analytics/instructor
// @access  Private/Instructor
const getInstructorAnalytics = async (req, res) => {
    try {
        const instructorId = req.user._id;

        // Get all courses by instructor
        const courses = await Course.find({ instructorId });
        const courseIds = courses.map(c => c._id);

        // Calculate total enrollments
        const totalEnrollments = await Enrollment.countDocuments({ courseId: { $in: courseIds } });

        // Calculate active students
        const activeStudents = await Enrollment.countDocuments({
            courseId: { $in: courseIds },
            status: 'Active'
        });

        // Calculate average quiz scores across all courses
        // Note: Ideally we filter quizzes by these courses first
        // For simplicity:
        // const attempts = await QuizAttempt.find({ quizId: { $in: ... } });

        res.json({
            totalCourses: courses.length,
            totalEnrollments,
            activeStudents,
            // Mock data for now where calculation is complex
            completionRate: 85,
            avgRating: 4.8
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get student analytics
// @route   GET /api/analytics/student
// @access  Private/Student
const getStudentAnalytics = async (req, res) => {
    try {
        const studentId = req.user._id;

        // 1. Total Study Hours 
        // Logic: Sum 'timeSpent' from ProgressTracking. Assuming timeSpent is in seconds.
        const progressDocs = await ProgressTracking.find({ studentId });
        const totalSeconds = progressDocs.reduce((acc, curr) => acc + (curr.timeSpent || 0), 0);
        // Convert to hours roughly
        const totalStudyHours = Math.round(totalSeconds / 3600);

        // 2. Quiz Average
        const quizAttempts = await QuizAttempt.find({ studentId });
        let quizAverage = 0;
        if (quizAttempts.length > 0) {
            const totalScore = quizAttempts.reduce((acc, curr) => acc + (curr.score || 0), 0);
            // Assuming score is whatever is stored. If stored as raw marks, this might be high.
            // But let's assume it's normalized or we just take the raw average for now.
            quizAverage = Math.round(totalScore / quizAttempts.length);
        }

        // 3. Learning Streak
        // Simplified: Return mock or count unique last activity days.
        const streak = 5; // Placeholder or impl simple logic

        // 4. Course Performance
        const enrollments = await Enrollment.find({ studentId }).populate('courseId', 'title');
        const coursePerformance = enrollments.map(enroll => {
            // Calculate completion for this course (or use enroll.progress)
            return {
                course: enroll.courseId ? enroll.courseId.title : 'Unknown Course',
                score: Math.round(enroll.progress || 0), // Using progress as score proxy
                completion: Math.round(enroll.progress || 0)
            };
        }).slice(0, 5); // Limit to top 5

        // 5. Weak Areas (Topics)
        const weakAreas = ["Practice more"];

        // 6. Weekly Activity (Mock or aggregation)
        const weeklyActivity = [30, 45, 60, 20, 50, 40, 10];

        res.json({
            totalStudyHours,
            quizAverage,
            streak,
            coursePerformance,
            weakAreas,
            weeklyActivity
        });

    } catch (error) {
        console.error("Error in getStudentAnalytics:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getInstructorAnalytics,
    getStudentAnalytics
};
