const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const ProgressTracking = require('../models/ProgressTracking');
const Lesson = require('../models/Lesson');

// @desc    Enroll in a course
// @route   POST /api/enrollments/:courseId
// @access  Private/Student
const enrollCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const studentId = req.user._id;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const existingEnrollment = await Enrollment.findOne({ studentId, courseId });

        if (existingEnrollment) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        const enrollment = new Enrollment({
            studentId,
            courseId,
            instructorId: course.instructorId,
            status: 'Active'
        });

        await enrollment.save();

        res.status(201).json({ message: 'Enrolled successfully', enrollment });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get my enrolled courses
// @route   GET /api/enrollments/my-courses
// @access  Private
const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ studentId: req.user._id })
            .populate('courseId')
            .populate('instructorId', 'name email');
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update lesson progress
// @route   PUT /api/enrollments/progress
// @access  Private/Student
const updateLessonProgress = async (req, res) => {
    try {
        const { courseId, lessonId, completed, timeSpent } = req.body;
        const studentId = req.user._id;

        // 1. Update/Create ProgressTracking entry
        await ProgressTracking.findOneAndUpdate(
            { studentId, courseId, lessonId },
            { completed, timeSpent },
            { upsert: true, new: true }
        );

        // 2. Recalculate Course Progress Percentage
        const totalLessons = await Lesson.countDocuments({ courseId });
        const completedLessons = await ProgressTracking.countDocuments({
            studentId,
            courseId,
            completed: true
        });

        const progressPercentage = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

        // 3. Update Enrollment with new percentage
        const enrollment = await Enrollment.findOneAndUpdate(
            { studentId, courseId },
            { progressPercentage, status: progressPercentage === 100 ? 'Completed' : 'Active' },
            { new: true }
        );

        res.json({ message: 'Progress updated', progressPercentage, enrollment });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get progress for a specific course (completed lesson IDs)
// @route   GET /api/enrollments/:courseId/progress
// @access  Private/Student
const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user._id;

        const progressEntries = await ProgressTracking.find({
            studentId,
            courseId,
            completed: true
        }).select('lessonId');

        const completedLessonIds = progressEntries.map(p => p.lessonId);

        res.json({ completedLessonIds });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    enrollCourse,
    getMyEnrollments,
    updateLessonProgress,
    getCourseProgress
};
