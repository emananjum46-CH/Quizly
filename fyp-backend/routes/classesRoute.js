const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all classes
router.get('/get', async (req, res) => {
    try {
        const [classes] = await pool.query('SELECT * FROM classes');
        res.json(classes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching classes" });
    }
});

// Create class
router.post('/store', async (req, res) => {
    const { class_name } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO classes (class_name) VALUES (?)`,
            [class_name]
        );
        res.json({
            id: result.insertId,
            message: "Class created successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating class" });
    }
});

// Update class
router.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { class_name } = req.body;
    try {
        await pool.query(
            `UPDATE classes SET class_name = ? WHERE id = ?`,
            [class_name, id]
        );
        res.json({ message: "Class updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating class" });
    }
});

// Delete class
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM classes WHERE id = ?', [id]);
        res.json({ message: "Class deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting class" });
    }
});

module.exports = router;