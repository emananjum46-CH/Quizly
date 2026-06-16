// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Helpers from "../../Config/Helpers";

// function QuizWindow() {
//   const { quizId } = useParams();
//   const [quizData, setQuizData] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [submissionResult, setSubmissionResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [timeLeft, setTimeLeft] = useState(null);
//   const [timerExpired, setTimerExpired] = useState(false);
//   const [violationCount, setViolationCount] = useState(0);
//   const [isFullscreen, setIsFullscreen] = useState(false);

//   const handleShortAnswerChange = (questionId, answerText) => {
//     setSelectedAnswers((prev) => ({
//       ...prev,
//       [questionId]: answerText,
//     }));
//   };

//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         const res = await fetch(`${Helpers.apiUrl}quizzes/${quizId}`);
//         const data = await res.json();
//         setQuizData(data);
//       } catch (err) {
//         Helpers.toast("error", "Failed to load quiz");
//       }
//     };
//     fetchQuiz();
//   }, [quizId]);

//   useEffect(() => {
//     const handleContextMenu = (e) => {
//       e.preventDefault();
//       Helpers.toast("warning", "Right-click is disabled during the quiz");
//     };

//     const handleKeyDown = (e) => {
//       if (e.ctrlKey || e.metaKey || (e.keyCode >= 112 && e.keyCode <= 123)) {
//         e.preventDefault();
//         Helpers.toast("warning", "Keyboard shortcuts are disabled");
//       }
//     };

//     const handleSelectStart = (e) => {
//       e.preventDefault();
//       Helpers.toast("warning", "Text selection is disabled");
//     };

//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         setViolationCount((prev) => {
//           const newCount = prev + 1;
//           Helpers.toast("error", `Tab switching detected! (${newCount}/3)`);
//           if (newCount >= 3) {
//             handleSubmit();
//             Helpers.toast("error", "Quiz submitted due to multiple violations");
//           }
//           return newCount;
//         });
//       }
//     };

//     const enterFullscreen = () => {
//       const elem = document.documentElement;
//       if (elem.requestFullscreen) {
//         elem.requestFullscreen();
//         setIsFullscreen(true);
//       }
//     };

//     document.addEventListener("contextmenu", handleContextMenu);
//     document.addEventListener("keydown", handleKeyDown);
//     document.addEventListener("selectstart", handleSelectStart);
//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     enterFullscreen();

//     return () => {
//       document.removeEventListener("contextmenu", handleContextMenu);
//       document.removeEventListener("keydown", handleKeyDown);
//       document.removeEventListener("selectstart", handleSelectStart);
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//       if (document.fullscreenElement) {
//         document.exitFullscreen();
//         setIsFullscreen(false);
//       }
//     };
//   }, []);

//   // ⏱️ Initialize per-question timer when question changes
//   useEffect(() => {
//     if (!quizData) return;

//     const current = quizData.questions[currentQuestionIndex];
//     const seconds = current.time_limit ?? 60; // fallback default
//     setTimeLeft(seconds);
//     setTimerExpired(false);
//   }, [currentQuestionIndex, quizData]);

//   // ⏳ Countdown for current question
//   useEffect(() => {
//     if (timeLeft === null || timerExpired) return;

//     const timerId = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timerId);
//           setTimerExpired(true);

//           Helpers.toast("error", "Time's up for this question!");

//           if (currentQuestionIndex < quizData.questions.length - 1) {
//             setCurrentQuestionIndex((prev) => prev + 1);
//           } else {
//             handleSubmit();
//           }

//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [timeLeft, timerExpired]);

//   const formatTime = (seconds) => {
//     if (isNaN(seconds)) return "00:00";
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const handleOptionSelect = (questionId, optionId) => {
//     setSelectedAnswers((prev) => ({
//       ...prev,
//       [questionId]: optionId,
//     }));
//   };

//   const handleNavigation = (direction) => {
//     setCurrentQuestionIndex((prev) => {
//       const newIndex = direction === "next" ? prev + 1 : prev - 1;
//       return Math.max(0, Math.min(newIndex, quizData.questions.length - 1));
//     });
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       const answers = Object.entries(selectedAnswers).map(
//         ([questionId, answer]) => ({
//           question_id: parseInt(questionId),
//           ...(typeof answer === "number"
//             ? { option_id: answer }
//             : { text_answer: answer }),
//         })
//       );

//       const res = await fetch(`${Helpers.apiUrl}quizzes/attempts`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           student_id: user.id,
//           quiz_id: parseInt(quizId),
//           answers,
//         }),
//       });

//       const result = await res.json();
//       setSubmissionResult(result);
//       setLoading(false);
//     } catch (err) {
//       setLoading(false);
//       Helpers.toast("error", "Submission failed");
//     }
//   };

//   if (!quizData) return <div>Loading quiz...</div>;

//   if (submissionResult) {
//     return (
//       <div className="quiz-result">
//         <h2>Quiz Completed!</h2>
//         <div className="score-summary">
//           <p>
//             Your Score: {submissionResult.score} (Out of{" "}
//             {submissionResult.max_score})
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const currentQuestion = quizData.questions[currentQuestionIndex];

//   return (
//     <div className="quiz-container">
//       <div className="quiz-header">
//         <div className={`timer ${timeLeft < 30 ? "low" : ""}`}>
//           Time Remaining: {formatTime(timeLeft)}
//         </div>
//         <h1>{quizData.title}</h1>
//         <p>{quizData.description}</p>
//         <div className="progress">
//           Question {currentQuestionIndex + 1} of {quizData.questions.length}
//         </div>
//       </div>

//       <div className="question-card">
//         <h3>{currentQuestion.question_text}</h3>
//         {currentQuestion.question_type === "short_answer" ? (
//           <textarea
//             value={selectedAnswers[currentQuestion.id] || ""}
//             onChange={(e) =>
//               handleShortAnswerChange(currentQuestion.id, e.target.value)
//             }
//             placeholder="Type your answer here..."
//             rows={4}
//             className="short-answer-input"
//           />
//         ) : (
//           <div className="options-grid">
//             {currentQuestion.options.map((option) => (
//               <button
//                 key={option.id}
//                 className={`option-btn ${
//                   selectedAnswers[currentQuestion.id] === option.id
//                     ? "selected"
//                     : ""
//                 }`}
//                 onClick={() =>
//                   handleOptionSelect(currentQuestion.id, option.id)
//                 }
//               >
//                 {option.option_text}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="navigation-btns">
//         <button
//           onClick={() => handleNavigation("prev")}
//           disabled={currentQuestionIndex === 0}
//         >
//           Previous
//         </button>

//         {currentQuestionIndex < quizData.questions.length - 1 ? (
//           <button
//             onClick={() => handleNavigation("next")}
//             disabled={
//               currentQuestion.question_type === "short_answer"
//                 ? !selectedAnswers[currentQuestion.id]?.trim()
//                 : !selectedAnswers[currentQuestion.id]
//             }
//           >
//             Next
//           </button>
//         ) : (
//           <button
//             onClick={handleSubmit}
//             disabled={
//               currentQuestion.question_type === "short_answer"
//                 ? !selectedAnswers[currentQuestion.id]?.trim()
//                 : !selectedAnswers[currentQuestion.id]
//             }
//           >
//             {loading ? "Submitting..." : "Submit"}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default QuizWindow;
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Helpers from "../../Config/Helpers";


function QuizWindow() {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submissionResult, setSubmissionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // State for per-question timer
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerExpired, setTimerExpired] = useState(false);
  const [timerActive, setTimerActive] = useState(true); // New state to control timer

  const handleShortAnswerChange = (questionId, answerText) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerText,
    }));
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`${Helpers.apiUrl}quizzes/${quizId}`);
        const data = await res.json();
        setQuizData(data);
      } catch (err) {
        Helpers.toast("error", "Failed to load quiz");
      }
    };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      Helpers.toast("warning", "Right-click is disabled during the quiz");
    };

    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || (e.keyCode >= 112 && e.keyCode <= 123)) {
        e.preventDefault();
        Helpers.toast("warning", "Keyboard shortcuts are disabled");
      }
    };

    const handleSelectStart = (e) => {
      e.preventDefault();
      Helpers.toast("warning", "Text selection is disabled");
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolationCount((prev) => {
          const newCount = prev + 1;
          Helpers.toast("error", `Tab switching detected! (${newCount}/3)`);
          if (newCount >= 3) {
            handleSubmit();
            Helpers.toast("error", "Quiz submitted due to multiple violations");
          }
          return newCount;
        });
      }
    };

    const enterFullscreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
        setIsFullscreen(true);
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    enterFullscreen();

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    };
  }, []);

  // Initialize timer for current question
  useEffect(() => {
    if (!quizData || !quizData.questions || !quizData.questions[currentQuestionIndex]) return;

    // Reset timer state
    setTimerExpired(false);
    setTimerActive(true);
    
    // Get time limit for current question (default 60 seconds if not set)
    const currentQuestion = quizData.questions[currentQuestionIndex];
    const timeLimit = currentQuestion.time_limit || 60;
    
    setTimeLeft(timeLimit);
  }, [currentQuestionIndex, quizData]);

  // Countdown timer for current question
  useEffect(() => {
    if (timeLeft === null || !timerActive) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          setTimerExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, timerActive]);

  // Handle timer expiration
  useEffect(() => {
    if (timerExpired && quizData) {
      Helpers.toast("error", "Time's up for this question!");
      
      // Automatically move to next question or submit
      if (currentQuestionIndex < quizData.questions.length - 1) {
        // Pause timer during transition
        setTimerActive(false);
        
        // Move to next question after a brief delay
        setTimeout(() => {
          setTimerExpired(false); 
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }, 1500);
      } else {
        // Submit if it's the last question
        handleSubmit();
      }
    }
  }, [timerExpired, currentQuestionIndex, quizData]);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNavigation = (direction) => {
    // Pause timer during navigation
    setTimerActive(false);
    
    setCurrentQuestionIndex((prev) => {
      const newIndex = direction === "next" ? prev + 1 : prev - 1;
      
      // Resume timer after navigation
      setTimeout(() => setTimerActive(true), 100);
      
      return Math.max(0, Math.min(newIndex, quizData.questions.length - 1));
    });
  };
const [classId, setClassId] = useState(null);
  
  useEffect(() => {
    // Get class ID from URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const classParam = urlParams.get('class');
    setClassId(classParam);
  }, []);
  const handleSubmit = async () => {
    setLoading(true);
    setTimerActive(false); // Stop all timers
    
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const answers = Object.entries(selectedAnswers).map(
        ([questionId, answer]) => ({
          question_id: parseInt(questionId),
          ...(typeof answer === "number"
            ? { option_id: answer }
            : { text_answer: answer }),
        })
      );

      const res = await fetch(`${Helpers.apiUrl}quizzes/attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: user.id,
          quiz_id: parseInt(quizId),
          class_id: classId,
          answers,
        }),
      });

      const result = await res.json();
      setSubmissionResult(result);
      setLoading(false);
      // window.location.reload(); // Reload to reset state
    } catch (err) {
      setLoading(false);
      Helpers.toast("error", "Submission failed");
    }
  };

  if (!quizData) return <div>Loading quiz...</div>;

  if (submissionResult) {
    return (
      <div className="quiz-result">
        <h2>Quiz Completed!</h2>
        <div className="score-summary">
          <p>
            Your Score: {submissionResult.score} (Out of{" "}
            {submissionResult.max_score})
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const timeLimit = currentQuestion?.time_limit || 60; // Default to 60 seconds

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className={`timer ${timeLeft < 30 ? "low" : ""}`}>
          {/* Show time limit for current question */}
          {timeLeft !== null ? (
            `Time: ${formatTime(timeLeft)} / ${formatTime(timeLimit)}`
          ) : (
            "Loading timer..."
          )}
        </div>
        <h1>{quizData.title}</h1>
        <p>{quizData.description}</p>
        <div className="progress">
          Question {currentQuestionIndex + 1} of {quizData.questions.length}
        </div>
      </div>

      <div className="question-card">
        <h3>{currentQuestion.question_text}</h3>
        {currentQuestion.question_type === "short_answer" ? (
          <textarea
            value={selectedAnswers[currentQuestion.id] || ""}
            onChange={(e) =>
              handleShortAnswerChange(currentQuestion.id, e.target.value)
            }
            placeholder="Type your answer here..."
            rows={4}
            className="short-answer-input"
          />
        ) : (
          <div className="options-grid">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                className={`option-btn ${
                  selectedAnswers[currentQuestion.id] === option.id
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handleOptionSelect(currentQuestion.id, option.id)
                }
              >
                {option.option_text}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="navigation-btns">
        <button
          onClick={() => handleNavigation("prev")}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>

        {currentQuestionIndex < quizData.questions.length - 1 ? (
          <button
            onClick={() => handleNavigation("next")}
            disabled={
              currentQuestion.question_type === "short_answer"
                ? !selectedAnswers[currentQuestion.id]?.trim()
                : !selectedAnswers[currentQuestion.id]
            }
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={
              currentQuestion.question_type === "short_answer"
                ? !selectedAnswers[currentQuestion.id]?.trim()
                : !selectedAnswers[currentQuestion.id]
            }
          >
            {loading ? "Submitting..." : "Submit Quiz"}
          </button>
        )}
      </div>
    </div>
  );
}

export default QuizWindow;