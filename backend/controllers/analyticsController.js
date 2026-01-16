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

        const courseData = [];
        let totalEnrollments = 0;
        let totalCompletionSum = 0; // for average calculation
        let totalScoreSum = 0;
        let totalTimeSpent = 0; // seconds

        for (const course of courses) {
            // Get enrollments for this course
            const enrollments = await Enrollment.find({ courseId: course._id });
            const studentCount = enrollments.length;
            totalEnrollments += studentCount;

            // Calculate average completion for this course
            let courseCompletionSum = 0;
            if (studentCount > 0) {
                courseCompletionSum = enrollments.reduce((acc, curr) => acc + (curr.progress || 0), 0);
                totalCompletionSum += (courseCompletionSum / studentCount); // Add average of this course to total sum logic or weighted?
                // Let's do simple aggregation for total stats later.
            }

            // Get progress/time spent for this course (aggregated from all students)
            // This is heavy, maybe optimize with aggregation pipeline later.
            const progressDocs = await ProgressTracking.find({ courseId: course._id });
            const courseTimeSpent = progressDocs.reduce((acc, curr) => acc + (curr.timeSpent || 0), 0);
            totalTimeSpent += courseTimeSpent;

            // Get quiz attempts for this course (if we can link them)
            // As noted before, linking quiz attempts directly to course efficiently is key.
            // Assuming we query QuizAttempt where student is in enrollments... or rely on Quiz having courseId.
            // Let's find quizzes for this course first.
            const quizzes = await require('../models/Quiz').find({ courseId: course._id });
            const quizIds = quizzes.map(q => q._id);
            const quizAttempts = await QuizAttempt.find({ quizId: { $in: quizIds } });

            let courseAvgScore = 0;
            if (quizAttempts.length > 0) {
                const courseScoreSum = quizAttempts.reduce((acc, curr) => acc + (curr.score || 0), 0);
                courseAvgScore = Math.round(courseScoreSum / quizAttempts.length);
            }

            // Calculate course specific completion avg
            const avgCompletion = studentCount > 0 ? Math.round(courseCompletionSum / studentCount) : 0;

            // Average time spent per student in hours
            const avgTime = studentCount > 0 ? ((courseTimeSpent / studentCount) / 3600).toFixed(1) : 0;

            courseData.push({
                course: course.title,
                students: studentCount,
                avgScore: courseAvgScore,
                completion: avgCompletion,
                timeSpent: Number(avgTime)
            });
        }

        // Global Averages logic (re-calculating properly from courseData could be easier)
        const avgCompletionGlobal = courseData.length > 0
            ? Math.round(courseData.reduce((acc, c) => acc + c.completion, 0) / courseData.length)
            : 0;

        const avgScoreGlobal = courseData.length > 0
            ? Math.round(courseData.reduce((acc, c) => acc + c.avgScore, 0) / courseData.length)
            : 0;

        res.json({
            totalStudents: totalEnrollments,
            avgCompletion: avgCompletionGlobal,
            avgScore: avgScoreGlobal,
            totalHours: Math.round(totalTimeSpent / 3600),
            coursePerformance: courseData
        });

    } catch (error) {
        console.error("Error in getInstructorAnalytics:", error);
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
