const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const lessonDir = path.join(__dirname, '../uploads/lessons');
const thumbnailDir = path.join(__dirname, '../uploads/thumbnails');

[lessonDir, thumbnailDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'thumbnail') {
            cb(null, thumbnailDir);
        } else {
            cb(null, lessonDir);
        }
    },
    filename: function (req, file, cb) {
        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const prefix = file.fieldname === 'thumbnail' ? 'thumb-' : 'lesson-';
        cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter (Video, Docs, Images)
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'thumbnail') {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
            return cb(new Error('Please upload an image file (jpg, jpeg, png, webp)'));
        }
    } else {
        // Lessons
        const filetypes = /mp4|mkv|pdf|doc|docx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (!extname || !mimetype) {
            return cb(new Error('Error: Videos and Documents Only!'));
        }
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    fileFilter: fileFilter
});

module.exports = upload;
