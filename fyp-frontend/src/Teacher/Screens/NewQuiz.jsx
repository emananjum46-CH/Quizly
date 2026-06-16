import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Helpers from "../../Config/Helpers";

function NewQuiz() {
  const [autoQuiz, setAutoQuiz] = useState(true);
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.id || user.userId;// 👈 Get user ID from local storage
    formData.append("created_by", userId); // 👈 Add created_by to form data
    formData.append("file", file);
    // formData.append("class_id", 1); // 👈 Add class ID from state

    try {
      const res = await fetch(`${Helpers.apiUrl}quizzes/auto-create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // 👈 Add auth token
        },
        body: formData,
      });

     const text = await res.text();
console.log("SERVER RESPONSE:", text);

const data = JSON.parse(text);
      if (data.success) {
        alert("Quiz auto-generated successfully!");
        setQuiz((prev) => ({ ...prev, ...data.quiz }));
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Auto-generation failed");
    }
  };
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    questions: [],
  });

  const handleAddQuestion = () => {
    setQuiz((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question_id: Date.now(),
          question_text: "",
          question_type: "mcq",
          difficulty_level: "easy",
          options: [{ option_text: "", is_correct: false }],
        },
      ],
    }));
  };

  const removeQuestion = (index) => {
    const updated = [...quiz.questions];
    updated.splice(index, 1);
    setQuiz((prev) => ({ ...prev, questions: updated }));
  };

  const handleQuizChange = (e) => {
    const { name, value } = e.target;
    setQuiz((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[index][field] = value;

    if (field === "question_type") {
      if (value === "mcq") {
        newQuestions[index].options = [{ option_text: "", is_correct: false }];
      } else if (value === "true_false") {
        newQuestions[index].options = [
          { option_text: "True", is_correct: true },
          { option_text: "False", is_correct: false },
        ];
      } else {
        newQuestions[index].options = [];
      }
    }

    setQuiz((prev) => ({ ...prev, questions: newQuestions }));
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options[oIndex][field] =
      field === "is_correct" ? value === "true" : value;

    setQuiz((prev) => ({ ...prev, questions: newQuestions }));
  };

  const addOption = (qIndex) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options.push({ option_text: "", is_correct: false });
    setQuiz((prev) => ({ ...prev, questions: newQuestions }));
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options.splice(oIndex, 1);
    setQuiz((prev) => ({ ...prev, questions: newQuestions }));
  };

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.id;
    const payload = {
      ...quiz,
      created_by: userId, // You can replace with actual user ID
      // class_id: 1, // Replace with actual class ID
    };
    console.log("QUIZ PAYLOAD:", payload);

    console.log("Payload to be sent:", payload); // Log the payload for debugging

    try {
      console.log("API URL:", `${Helpers.apiUrl}create-quiz`);
console.log("Payload:", payload);
      const res = await fetch(`${Helpers.apiUrl}create-quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
         
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Quiz created successfully! Quiz ID: " + data.quiz_id);
        // Optionally reset form or redirect
        setQuiz({
          title: "",
          description: "",
          questions: [],
        });
      } else {
        alert("❌ Failed to create quiz: " + data.message);
        console.log("❌ Failed to create quiz: " + data);
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("❌ An error occurred while submitting the quiz.");
    }
  };

  return (
    <div>
      <div
        id="kt_app_wrapper"
        className="app-wrapper flex-column flex-row-fluid"
      >
        <Sidebar />
        <div
          className="p-4 max-w-4xl mx-auto space-y-6 min-h-screen "
          style={{ color: "white" }}
        >
          {autoQuiz ? (
            // Auto-generate mode (file upload)
            <div className="flex gap-4 items-center mb-8">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.pptx"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="px-6 py-3 rounded-lg cursor-pointer transition-all bg-purple-600 hover:bg-purple-700 "
                style={{ color: "white" }}
              >
                Choose File
              </label>
              <button
                onClick={() => setAutoQuiz(false)}
                className="px-6 py-3 rounded-lg transition-all bg-gray-800 hover:bg-gray-700 "
                style={{ color: "white" }}
              >
                ✏️ Switch to Manual
              </button>
            </div>
          ) : (
            // Manual mode (form)
            <div className="space-y-8">
              <div className="flex gap-4 items-center mb-8">
                <button
                  onClick={() => setAutoQuiz(true)}
                  className="px-6 py-3 rounded-lg transition-all bg-purple-600 hover:bg-purple-700 "
                  style={{ color: "white" }}
                >
                  🤖 Switch to Auto
                </button>
              </div>

              <div className="p-6 bg-gray-900 rounded-xl shadow-lg">
                <h2
                  className="text-3xl font-bold mb-6 "
                  style={{ color: "white" }}
                >
                  Create New Quiz
                </h2>
                <div className="space-y-5">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "white" }}
                    >
                      Quiz Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Enter quiz title"
                      value={quiz.title}
                      onChange={handleQuizChange}
                      className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium  mb-2"
                      style={{ color: "white" }}
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Describe your quiz..."
                      value={quiz.description}
                      onChange={handleQuizChange}
                      className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32"
                    />
                  </div>
                </div>
              </div>
              

              {quiz.questions.map((q, index) => (
                <div
                  key={q.question_id}
                  className="p-6 bg-gray-900 rounded-xl shadow-lg"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3
                      className="text-xl font-semibold"
                      style={{ color: "white" }}
                    >
                      Question {index + 1}
                    </h3>
                    <button
                      onClick={() => removeQuestion(index)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      🗑 Remove
                    </button>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Enter question text"
                      value={q.question_text}
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          "question_text",
                          e.target.value
                        )
                      }
                      className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <select
                        value={q.question_type}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "question_type",
                            e.target.value
                          )
                        }
                        className="p-2 bg-gray-800 rounded-lg border border-gray-700"
                      >
                        <option value="mcq">Multiple Choice</option>
                        <option value="true_false">True/False</option>
                        <option value="short_answer">Short Answer</option>
                      </select>

                      <select
                        value={q.difficulty_level}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "difficulty_level",
                            e.target.value
                          )
                        }
                        className="p-2 bg-gray-800 rounded-lg border border-gray-700"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
<input
                type="number"
                min="1"
                placeholder="Time limit (seconds)"
                value={q.time_limit || ""}
                onChange={(e) =>
                  handleQuestionChange(
                    index,
                    "time_limit",
                    parseInt(e.target.value)
                  )
                }
                className="p-2 bg-gray-800 rounded-lg border border-gray-700 w-full"
              />
                    {q.question_type === "mcq" && (
                      <div className="space-y-3">
                        {q.options.map((opt, oIndex) => (
                          <div key={oIndex} className="flex gap-3 items-center">
                            <input
                              type="text"
                              placeholder={`Option ${oIndex + 1}`}
                              value={opt.option_text}
                              onChange={(e) =>
                                handleOptionChange(
                                  index,
                                  oIndex,
                                  "option_text",
                                  e.target.value
                                )
                              }
                              className="flex-1 p-2 bg-gray-800 rounded-lg border border-gray-700"
                            />
                            <select
                              value={opt.is_correct ? "true" : "false"}
                              onChange={(e) =>
                                handleOptionChange(
                                  index,
                                  oIndex,
                                  "is_correct",
                                  e.target.value
                                )
                              }
                              className="p-2 bg-gray-800 rounded-lg border border-gray-700"
                            >
                              <option value="false">Incorrect</option>
                              <option value="true">Correct</option>
                            </select>
                            <button
                              onClick={() => removeOption(index, oIndex)}
                              className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                              ❌
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addOption(index)}
                          className="mt-2 text-purple-500 hover:text-purple-400 flex items-center gap-2"
                        >
                          <span>+</span> Add Option
                        </button>
                      </div>
                    )}

                    {q.question_type === "true_false" && (
                      <div className="space-y-3">
                        {q.options.map((opt, oIndex) => (
                          <label
                            key={oIndex}
                            className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`correctOption-${index}`}
                              checked={opt.is_correct}
                              onChange={() => {
                                const newQuestions = [...quiz.questions];
                                newQuestions[index].options = newQuestions[
                                  index
                                ].options.map((option) => ({
                                  ...option,
                                  is_correct: false,
                                }));
                                newQuestions[index].options[
                                  oIndex
                                ].is_correct = true;
                                setQuiz((prev) => ({
                                  ...prev,
                                  questions: newQuestions,
                                }));
                              }}
                              className="w-5 h-5 text-purple-500"
                            />
                            <span className="flex-1">{opt.option_text}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleAddQuestion}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2"
                  style={{ color: "white" }}
                >
                  ➕ Add Question
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2 "
                  style={{ color: "white" }}
                >
                  💾 Save Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewQuiz;
