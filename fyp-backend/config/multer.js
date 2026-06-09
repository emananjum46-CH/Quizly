// config/multer.js
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage(); // Store files in memory

const fileFilter = (req, file, cb) => {
  // Allow only PDF and PowerPoint files
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and PPTX files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;