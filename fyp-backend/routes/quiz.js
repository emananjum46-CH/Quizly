const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/create-quiz", async (req, res) => {
    const { title, description, questions, created_by } = req.body;

    if (!title || !description || !Array.isArray(questions) || !created_by) {
        return res.status(400).json({ message: "Missing or invalid required fields" });
    }

    try {
        const [quizResult] = await db.execute(
            `INSERT INTO quizzes (title, description, created_by, created_at)
             VALUES (?, ?, ?, NOW())`,
            [title, description, created_by]
        );
        const quiz_id = quizResult.insertId;

        for (const q of questions) {
            const timeLimit = q.time_limit || null;

            const [questionResult] = await db.execute(
                `INSERT INTO questions (quiz_id, question_text, question_type, difficulty_level, time_limit, created_at)
                 VALUES (?, ?, ?, ?, ?, NOW())`,
                [quiz_id, q.question_text, q.question_type, q.difficulty_level || "medium", timeLimit]
            );
            const question_id = questionResult.insertId;

            if (q.question_type === "mcq" || q.question_type === "true_false") {
                const options = Array.isArray(q.options) ? q.options : [];
                for (const opt of options) {
                    await db.execute(
                        `INSERT INTO options (question_id, option_text, is_correct)
                         VALUES (?, ?, ?)`,
                        [question_id, opt.option_text, opt.is_correct ? 1 : 0]
                    );
                }
            }
        }

        res.status(201).json({ message: "Quiz created successfully", quiz_id });
    } catch (err) {
        console.error("Error creating quiz:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

module.exports = router;
