const { parseFile } = require('../utils/fileParser');
const openaiService = require('../services/openaiService');
const pool = require('../config/db');

// exports.createAutoQuiz = async (req, res) => {
//   const connection = await pool.getConnection();
//   try {
//     await connection.beginTransaction();
//     const { created_by } = req.body;

//     // 1. Process uploaded file
//     const text = await parseFile(req.file);
//     if (!text) throw new Error('File processing failed');

//     // 2. Generate quiz with OpenAI
//     const generatedQuiz = await openaiService.generateQuiz(text);
//     if (!generatedQuiz?.questions?.length) throw new Error('Quiz generation failed');

//     // 3. Save to database
//     const [quizResult] = await connection.query(
//       `INSERT INTO quizzes 
//              (title, description, created_by, created_at)
//              VALUES (?, ?, ?, NOW())`,
//       [
//         generatedQuiz.title || 'Untitled Quiz',
//         generatedQuiz.description || 'Auto-generated quiz',
//         created_by,  // 👈 Safe navigation operator
//       ]
//     );

//     // 4. Save questions and options
//     for (const question of generatedQuiz.questions) {
//       const [questionResult] = await connection.query(
//         `INSERT INTO questions 
//                  (quiz_id, question_text, question_type, difficulty_level)
//                  VALUES (?, ?, ?, ?)`,
//         [
//           quizResult.insertId,
//           question.question_text,
//           question.question_type,
//           question.difficulty_level || 'medium',
//         ]
//       );

//       // Save options if applicable
//       if (['mcq', 'true_false'].includes(question.question_type)) {
//         const options = question.options?.map(opt => [
//           questionResult.insertId,
//           opt.option_text,
//           opt.is_correct ? 1 : 0
//         ]) || [];

//         if (options.length > 0) {
//           await connection.query(
//             `INSERT INTO options 
//                          (question_id, option_text, is_correct)
//                          VALUES ?`,
//             [options]
//           );
//         }
//       }
//     }

//     await connection.commit();
//     res.status(201).json({
//       success: true,
//       quizId: quizResult.insertId,
//       message: 'Quiz generated and saved successfully'
//     });

//   } catch (err) {
//     await connection.rollback();
//     console.error('Auto Quiz Error:', {
//       error: err.message,
//       stack: err.stack,
//       // generatedQuiz: generatedQuiz, // 👈 Log the generated quiz
//       body: req.body
//     });
//     res.status(500).json({
//       success: false,
//       error: process.env.NODE_ENV === 'development' ? err.message : 'Quiz generation failed'
//     });
//   } finally {
//     connection.release();
//   }
// };

exports.createAutoQuiz = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { created_by } = req.body;

    // 1. Process uploaded file
    const text = await parseFile(req.file);
    if (!text) throw new Error('File processing failed');

    // 2. Generate quiz with OpenAI
    const generatedQuiz = await openaiService.generateQuiz(text);
    if (!generatedQuiz?.questions?.length) throw new Error('Quiz generation failed');

    // 3. Save to database
    const [quizResult] = await connection.query(
      `INSERT INTO quizzes 
             (title, description, created_by, created_at)
             VALUES (?, ?, ?, NOW())`,
      [
        generatedQuiz.title || 'Untitled Quiz',
        generatedQuiz.description || 'Auto-generated quiz',
        created_by,
      ]
    );

    // 4. Save questions and options with time limits
    for (const question of generatedQuiz.questions) {
      // Set time limit based on question type
      let timeLimit = 60; // Default for MCQ and True/False
      if (question.question_type === "short_answer") {
        timeLimit = 180; // 3 minutes for short answer
      }

      const [questionResult] = await connection.query(
        `INSERT INTO questions 
                 (quiz_id, question_text, question_type, difficulty_level, time_limit)
                 VALUES (?, ?, ?, ?, ?)`,
        [
          quizResult.insertId,
          question.question_text,
          question.question_type,
          question.difficulty_level || 'medium',
          timeLimit // 👈 Add time limit to the query
        ]
      );

      // Save options if applicable
      if (['mcq', 'true_false'].includes(question.question_type)) {
        const options = question.options?.map(opt => [
          questionResult.insertId,
          opt.option_text,
          opt.is_correct ? 1 : 0
        ]) || [];

        if (options.length > 0) {
          await connection.query(
            `INSERT INTO options 
                         (question_id, option_text, is_correct)
                         VALUES ?`,
            [options]
          );
        }
      }
    }

    await connection.commit();
    res.status(201).json({
      success: true,
      quizId: quizResult.insertId,
      message: 'Quiz generated and saved successfully'
    });

  } catch (err) {
    await connection.rollback();
    console.error('Auto Quiz Error:', {
      error: err.message,
      stack: err.stack,
      body: req.body
    });
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'development' ? err.message : 'Quiz generation failed'
    });
  } finally {
    connection.release();
  }
};