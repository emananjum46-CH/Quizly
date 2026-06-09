// studentRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Modified route with authentication middleware
// router.get('/assigned-quizzes', async (req, res) => {
//     try {
//         const studentId = req.query.student_id;
        
//         // Add validation
//         if (!studentId || isNaN(studentId)) {
//             return res.status(400).json({ message: "Invalid student ID" });
//         }

//         console.log(`Fetching quizzes for student ${studentId}`); // Logging

//         const [quizzes] = await pool.query(`
//             SELECT 
//                 cq.*,
//                 q.title,
//                 q.description,
//                 cs.class_id
//             FROM class_quizzes cq
//             INNER JOIN class_students cs 
//                 ON cq.class_id = cs.class_id
//             INNER JOIN quizzes q 
//                 ON cq.quiz_id = q.id
//             INNER JOIN assigned_teachers at 
//                 ON q.created_by = at.teacher_id 
//                 AND cq.class_id = at.class_id
//             WHERE cs.student_id = ?
//                 AND cq.due_date > UTC_TIMESTAMP()
//         `, [studentId]);

//         console.log("Query results:", quizzes); // Debugging output
//         res.json(quizzes);
        
//     } catch (err) {
//         console.error("Database error:", err);
//         res.status(500).json({ 
//             message: "Error fetching quizzes",
//             error: process.env.NODE_ENV === 'development' ? err.message : null
//         });
//     }
// });
router.get('/assigned-quizzes', async (req, res) => {
    try {
        const studentId = req.query.student_id;
        
        if (!studentId || isNaN(studentId)) {
            return res.status(400).json({ message: "Invalid student ID" });
        }

        const [quizzes] = await pool.query(`
            SELECT 
                cq.*,
                q.title,
                q.description,
                cs.class_id,
                cq.start_time,   -- Add this
                cq.end_time      -- Add this
            FROM class_quizzes cq
            INNER JOIN class_students cs 
                ON cq.class_id = cs.class_id
            INNER JOIN quizzes q 
                ON cq.quiz_id = q.id
          
            WHERE cs.student_id = ?
        `, [studentId]);

        res.json(quizzes);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ 
            message: "Error fetching quizzes",
            error: process.env.NODE_ENV === 'development' ? err.message : null
        });
    }
});
module.exports = router;