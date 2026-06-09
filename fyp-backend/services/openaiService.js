const { OpenAI } = require('openai');

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_KEY,
      timeout: 20000
    });
  }

  async generateQuiz(text) {
    try {
        console.log('Input text:', text.substring(0, 200));
        const prompt = this._buildPrompt(text.substring(0, 3000));
    
        const response = await this.client.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system", 
              content: "You are a quiz generator. Always return valid JSON." // 👈 Required
            },
            { 
              role: "user", 
              content: prompt 
            }
          ],
          temperature: 0.3,
          max_tokens: 1500,
          response_format: { type: "json_object" }
        });

      const rawResponse = response.choices[0].message.content;
      console.log("Raw Response:", rawResponse); // 👈 Debugging
      
      return this._validateQuiz(this._parseResponse(rawResponse));
    } catch (err) {
      throw new Error(`OpenAI Error: ${err.message}`);
    }
  }

  _parseResponse(raw) {
    try {
      // Extract JSON substring
      const jsonStart = raw.indexOf('{');
      const jsonEnd = raw.lastIndexOf('}');
      const jsonString = raw.slice(jsonStart, jsonEnd + 1);
      
      return JSON.parse(jsonString);
    } catch (err) {
      throw new Error(`JSON parse failed. Received: ${raw}`);
    }
  }

  _buildPrompt(text) {
    return `
    Generate a quiz in VALID JSON FORMAT. Do not include any text outside the JSON structure.
    Generate MCQs with EXACTLY ONE correct answer.
    Generate one short question.
    For True/False questions, include both options with one correct answer.
    Required format:
    {
      "title": "Quiz Title",
      "description": "...",
      "questions": [
        {
          "question_text": "...",
          "question_type": "mcq/true_false/short_answer",
          "difficulty_level": "easy/medium/hard",
          "options": [
            {"option_text": "...", "is_correct": true/false}
          ]
        }
      ]
    }
    Content: ${text}
    `;
  }

  _validateQuiz(quiz) {
    quiz.questions.forEach((q, index) => {
      if (q.question_type === 'mcq') {
        const correctOptions = q.options.filter(opt => opt.is_correct);
        if (correctOptions.length !== 1) {
          throw new Error(`Question ${index + 1} must have exactly 1 correct answer`);
        }
      }
    });
    return quiz;
  }
  // async evaluateAnswer(questionText, studentAnswer) {
  //   try {
  //     const response = await this.client.chat.completions.create({
  //       model: "gpt-3.5-turbo",
  //       messages: [{
  //         role: "system",
  //         content: `Evaluate the answer out of 5 marks. Consider accuracy and completeness. 
  //           Return JSON format: { "score": number (0-5), "feedback": string }`
  //       }, {
  //         role: "user",
  //         content: `Question: ${questionText}
  //           Student Answer: ${studentAnswer}`
  //       }],
  //       temperature: 0.2,
  //       max_tokens: 150,
  //       response_format: { type: "json_object" }
  //     });

  //     const result = JSON.parse(response.choices[0].message.content);
  //     return {
  //       score: Math.min(5, Math.max(0, Number(result.score) || 0)), 
  //       feedback: result.feedback || ""
  //     };
  //   } catch (err) {
  //     console.error('Evaluation error:', err);
  //     return { score: 0, feedback: "Evaluation failed" };
  //   }
  // }
  async evaluateAnswer(questionText, studentAnswer) {
  try {
    // Add length check and content validation
    if (!studentAnswer || studentAnswer.trim().length < 3) {
      return { score: 0, feedback: "Answer too short or empty" };
    }

    const response = await this.client.chat.completions.create({
      model: "gpt-4-turbo",  // Use a more powerful model
      messages: [{
        role: "system",
        content: `You are a strict exam evaluator. Evaluate answers based on:
1. Relevance to question (40%)
2. Accuracy of information (40%)
3. Completeness (20%)

Grading scale:
0: Completely irrelevant, nonsense, or empty
1-2: Partially relevant but mostly incorrect
3: Relevant but contains significant errors
4: Correct with minor omissions
5: Perfect answer

Rules:
- Deduct marks for made-up information
- Non-English answers get max 1 point
- Short/random answers like "idk" get 0
- Return JSON format: { "score": 0-5, "feedback": string }`
      }, {
        role: "user",
        content: `QUESTION: "${questionText}"
STUDENT ANSWER: "${studentAnswer}"`
      }],
      temperature: 0.1,  // More deterministic
      max_tokens: 200,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      score: Math.min(5, Math.max(0, Number(result.score) || 0)), 
      feedback: result.feedback || "No feedback provided"
    };
  } catch (err) {
    console.error('Evaluation error:', err);
    return { score: 0, feedback: "Evaluation failed" };
  }
}
}

module.exports = new OpenAIService();