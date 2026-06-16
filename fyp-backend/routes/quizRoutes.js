const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const upload = require('../config/multer');
const OpenAIService = require('../services/openaiService');
const pool = require("../config/db");
const { verifyToken } = require('../middleware/authMiddleware');

// Get quiz questions with options (✅ includes time_limit now)
router.get("/:quizId", async (req, res) => {
  try {
    const [questions] = await pool.query(`
      SELECT 
        id,
        question_text,
        question_type,
        difficulty_level,
        time_limit  -- ✅ NEW
      FROM questions
      WHERE quiz_id = ?
      ORDER BY created_at
    `, [req.params.quizId]);

    const [options] = await pool.query(`
      SELECT 
        o.question_id,
        o.id AS option_id,
        o.option_text,
        o.is_correct
      FROM options o
      WHERE o.question_id IN (
        SELECT id FROM questions WHERE quiz_id = ?
      )
    `, [req.params.quizId]);

    const quizData = {
      title: "Software Quality Engineering Quiz",
      description: "Test your knowledge...",
      questions: questions.map(question => ({
        ...question,
        options: options.filter(opt => opt.question_id === question.id).map(opt => ({
          id: opt.option_id,
          option_text: opt.option_text,
          is_correct: Boolean(opt.is_correct)
        }))
      }))
    };

    res.json(quizData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
});

// Submit quiz attempt
router.post('/attempts', async (req, res) => {
  try {
    const { student_id, quiz_id, answers , class_id } = req.body;

    const [questions] = await pool.query(`
      SELECT 
        q.id,
        q.question_text,
        q.question_type,
        (SELECT o.id 
         FROM options o 
         WHERE o.question_id = q.id 
           AND o.is_correct = 1
         LIMIT 1) AS correct_option_id
      FROM questions q
      WHERE q.quiz_id = ?
    `, [quiz_id]);

    const maxScores = questions.reduce((acc, q) => {
      acc.total += q.question_type === 'short_answer' ? 5 : 1;
      return acc;
    }, { total: 0 });

    const [questionOptions] = await pool.query(`
      SELECT 
        o.question_id,
        o.id AS option_id,
        o.option_text,
        o.is_correct
      FROM options o
      WHERE o.question_id IN (
        SELECT id FROM questions WHERE quiz_id = ?
      )
    `, [quiz_id]);

    const optionsMap = questionOptions.reduce((acc, option) => {
      acc[option.question_id] = acc[option.question_id] || [];
      acc[option.question_id].push(option);
      return acc;
    }, {});

    let totalScore = 0;

    const details = await Promise.all(answers.map(async (answer) => {
      const question = questions.find(q => q.id === answer.question_id);
      const options = optionsMap[answer.question_id] || [];
      let score = 0;
      let feedback = '';

      if (question.question_type === 'short_answer') {
        try {
          const correctAnswer = options.find(o => o.is_correct)?.option_text || '';
          const evaluation = await OpenAIService.evaluateAnswer(
            question.question_text,
            answer.text_answer
          );
          score = evaluation.score;
          feedback = evaluation.feedback;
        } catch (err) {
          console.error('AI evaluation error:', err);
          score = 0;
          feedback = 'Evaluation failed';
        }
      } else {
        const correctOption = options.find(o => o.is_correct);
        score = correctOption?.option_id === answer.option_id ? 1 : 0;
      }

      totalScore += score;

      return {
        question_id: answer.question_id,
        question_type: question.question_type,
        score,
        max_score: question.question_type === 'short_answer' ? 5 : 1,
        ...(question.question_type === 'short_answer' && {
          feedback,
          student_answer: answer.text_answer
        })
      };
    }));

    const [result] = await pool.query(`
      INSERT INTO quiz_results 
        (quiz_id, student_id, score, total_questions, max_score, details, status)
      VALUES (?, ?, ?, ?, ?, ?, 'attempted')
    `, [
      quiz_id,
      student_id,
      totalScore,
      questions.length,
      maxScores.total,
      JSON.stringify(details)
    ]);
     await pool.query(`
      UPDATE class_quizzes 
      SET is_attempted = 1 
      WHERE quiz_id = ? 
        AND class_id = ?
    `, [quiz_id, class_id]);

    res.json({
      success: true,
      score: totalScore,
      max_score: maxScores.total,
      result_id: result.insertId,
      breakdown: details
    });

  } catch (err) {
    console.error('Submission error:', err);
    res.status(500).json({
      error: "Submission failed",
      ...(process.env.NODE_ENV === 'development' && { detail: err.message })
    });
  }
});

// Fetch student quiz results
router.get('/results/:studentId', async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        qr.id,
        q.title AS quiz_title,
        qr.score,
        qr.max_score,
        qr.status,
        qr.created_at AS attempt_date
      FROM quiz_results qr
      JOIN quizzes q ON qr.quiz_id = q.id
      WHERE qr.student_id = ?
      ORDER BY qr.created_at DESC
    `, [req.params.studentId]);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

// Auto quiz creation from file (unchanged)
router.post('/auto-create',
  verifyToken,
  upload.single('file'),

  quizController.createAutoQuiz
);
// Get all quizzes
router.get('/', async (req,res)=>{

  try {

    const [quizzes] = await pool.query(
      "SELECT id,title FROM quizzes"
    );

    res.json(quizzes);

  } catch(error){

    console.log(error);

    res.status(500).json({
      error:"Failed to load quizzes"
    });
  }

});
module.exports = router;
