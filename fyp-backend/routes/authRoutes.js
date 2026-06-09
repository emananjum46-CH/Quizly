const express = require('express');
const { registerUser, loginUser , inviteTeacher , registerTeacher , studentRegister } = require('../controllers/authController');
const { verifyToken, isAdmin, isTeacher } = require('../middleware/authMiddleware');

const router = express.Router();

// Register a student (open to the public)
router.post('/register', registerUser);

// Login (open to the public)
router.post('/login', loginUser);
router.post('/invite-teacher', inviteTeacher);

router.post('/register/teacher', registerTeacher);

// Example of an admin-only route (protected)
router.get('/admin-dashboard', verifyToken, isAdmin, (req, res) => {
  res.send('Welcome to Admin Dashboard');
});

// Example of a teacher-only route (protected)
router.get('/teacher-dashboard', verifyToken, isTeacher, (req, res) => {
  res.send('Welcome to Teacher Dashboard');
});


router.post('/students/register' , studentRegister);

module.exports = router;
