const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require("./routes/quiz");
const quizRoutes1 = require('./routes/quizRoutes');
const classesRoutes = require('./routes/classesRoute'); // Assuming you have a teacher route
const teacherRoutes = require('./routes/teacher'); // Assuming you have a teacher route
const studentRoutes = require('./routes/studentRoutes'); // Assuming you have a teacher route
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', quizRoutes);
app.use('/api/quizzes', quizRoutes1);
app.use('/api/classes', classesRoutes); // Teacher route for fetching teachers);
app.use('/api/teachers', teacherRoutes); // Teacher route for fetching teachers);
app.use('/api/student', studentRoutes); // Teacher route for fetching teachers);
// Backend Route for teacher registration

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
