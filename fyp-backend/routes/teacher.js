const express = require("express");
const router = express.Router();
const pool = require("../config/db");
router.get('/all-teachers', async (req, res) => {
    try {
        const [teachers] = await pool.query(
            "SELECT id, name, email FROM users WHERE role = 'teacher'"
        );
        res.json(teachers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching teachers" });
    }
});

// Get all assignments
router.get('/assignments', async (req, res) => {
    try {
        const [assignments] = await pool.query(`
            SELECT a.id, c.class_name, u.name AS teacher_name 
            FROM assigned_teachers a
            JOIN classes c ON a.class_id = c.id
            JOIN users u ON a.teacher_id = u.id
        `);
        res.json(assignments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching assignments" });
    }
});

// Create assignment
router.post('/assignments', async (req, res) => {
    const { class_id, teacher_id } = req.body;

    try {
        // Check if assignment already exists
        const [existing] = await pool.query(
            `SELECT id FROM assigned_teachers 
             WHERE class_id = ? AND teacher_id = ?`,
            [class_id, teacher_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Assignment already exists" });
        }

        const [result] = await pool.query(
            `INSERT INTO assigned_teachers 
             (class_id, teacher_id) 
             VALUES (?, ?)`,
            [class_id, teacher_id]
        );

        res.json({
            id: result.insertId,
            message: "Assignment created successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating assignment" });
    }
});

// Delete assignment
router.delete('/assignments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query(
            `DELETE FROM assigned_teachers WHERE id = ?`,
            [id]
        );
        res.json({ message: "Assignment deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting assignment" });
    }
});

router.get('/created-by/:teacherId', async (req, res) => {
    try {
        const [quizzes] = await pool.query(
            `SELECT id, title FROM quizzes WHERE created_by = ?`,
            [req.params.teacherId]
        );
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ message: "Error fetching quizzes" });
    }
});

router.get('/assigned-by/:teacherId', async (req, res) => {
    try {
        const [assignments] = await pool.query(`
        SELECT cq.*, q.title AS quiz_title, c.class_name 
        FROM class_quizzes cq
        JOIN quizzes q ON cq.quiz_id = q.id
        JOIN classes c ON cq.class_id = c.id
        WHERE cq.assigned_by = ?
      `, [req.params.teacherId]);
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: "Error fetching assignments" });
    }
});

// Updated store route
router.post('/store', async (req, res) => {
    const { quiz_id, class_id, start_time, end_time, assigned_by } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO class_quizzes 
             (quiz_id, class_id, start_time, end_time, assigned_by)
             VALUES (?, ?, ?, ?, ?)`,
            [quiz_id, class_id, start_time, end_time, assigned_by]
        );
        res.json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: "Error creating assignment" });
    }
});

// Updated edit route
router.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { start_time, end_time } = req.body;
    try {
        await pool.query(
            `UPDATE class_quizzes 
             SET start_time = ?, end_time = ?
             WHERE id = ?`,
            [start_time, end_time, id]
        );
        res.json({ message: "Assignment updated" });
    } catch (err) {
        res.status(500).json({ message: "Error updating assignment" });
    }
});
module.exports = router;