const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// @desc    Add a lesson to a course
// @route   POST /api/lessons/:courseId
// @access  Private/Instructor
const addLesson = async (req, res) => {
    try {
        const { title, videoUrl, duration, order } = req.body;
        const courseId = req.params.courseId;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Ensure user is the instructor of the course
        if (course.instructorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to add lessons to this course' });
        }

        const lesson = new Lesson({
            courseId,
            title,
            videoUrl,
            duration,
            order
        });

        const createdLesson = await lesson.save();

        res.status(201).json(createdLesson);
    } catch (error) {
        res.status(400).json({ message: 'Invalid lesson data', error: error.message });
    }
};

// @desc    Get lessons for a course
// @route   GET /api/lessons/:courseId
// @access  Public
const getLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find({ courseId: req.params.courseId }).sort('order');
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    addLesson,
    getLessons
};
