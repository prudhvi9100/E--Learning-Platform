const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Instructor
const createCourse = async (req, res) => {
    try {
        const { title, description, level, category, price, totalDuration } = req.body;

        let thumbnail = req.body.thumbnail;
        if (req.file) {
            thumbnail = `/uploads/thumbnails/${req.file.filename}`;
        } else if (!thumbnail) {
            // Default thumbnail if none provided? Or keep it empty/optional
            thumbnail = '/uploads/thumbnails/default-course.png'; // Optional fallback
        }

        const course = new Course({
            instructorId: req.user._id,
            title,
            description,
            level,
            category,
            price,
            thumbnail,
            totalDuration
        });

        const createdCourse = await course.save();

        res.status(201).json(createdCourse);
    } catch (error) {
        console.error("Course creation error:", error);
        res.status(400).json({ message: 'Invalid course data', error: error.message });
    }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({}).populate('instructorId', 'name email');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get logged in instructor's courses
// @route   GET /api/courses/my-courses
// @access  Private/Instructor
const getMyCourses = async (req, res) => {
    try {
        const courses = await Course.find({ instructorId: req.user._id });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructorId', 'name email')
            .populate({
                path: 'modules.lessons',
                model: 'Lesson'
            });

        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Add lesson to course
// @route   POST /api/courses/:id/lessons
// @access  Private/Instructor
const addLessonToCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is the course instructor
        if (course.instructorId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to add lessons to this course' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        // Create new Lesson
        const lesson = new Lesson({
            title: req.body.title,
            courseId: course._id,
            type: req.body.type || 'video',
            content: `/uploads/lessons/${req.file.filename}`, // Store relative path
            duration: req.body.duration || "0:00"
        });

        const createdLesson = await lesson.save();

        // Add lesson to course modules (Default Module 1 for now)
        // Check if modules exist, if not create one
        if (course.modules.length === 0) {
            course.modules.push({ title: "General", lessons: [] });
        }

        // Push to first module for simplicity (can be enhanced later)
        course.modules[0].lessons.push(createdLesson._id);

        // Update total duration (simplified logic)
        // course.totalDuration += ... (could parse duration later)

        await course.save();

        res.status(201).json(createdLesson);
    } catch (error) {
        console.error("Add lesson error:", error);
        res.status(400).json({ message: 'Failed to add lesson', error: error.message });
    }
};

module.exports = {
    createCourse,
    getCourses,
    getCourseById,
    getMyCourses,
    addLessonToCourse
};
