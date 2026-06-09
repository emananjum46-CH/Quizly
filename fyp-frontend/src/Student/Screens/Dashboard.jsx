import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Helpers from "../../Config/Helpers";
import Sidebar from "../Components/Sidebar";

function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("CURRENT USER:", user);
console.log("API URL:", Helpers.apiUrl);
// Dashboard.js
useEffect(() => {
  const fetchQuizzes = async () => {
    try {
      // Add null check for user
      if (!user || !user.id) {
        throw new Error("User not authenticated");
      }

      const res = await fetch(
        `${Helpers.apiUrl}student/assigned-quizzes?student_id=${user.id}`
      );
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();

console.log("QUIZZES RECEIVED:", data);

setQuizzes(data);
    } catch (err) {
      Helpers.toast("error", "Failed to load quizzes");
      console.error("Fetch error:", err);
    }
  };
  
  fetchQuizzes();
}, [user?.id]); // Add dependency

 // Dashboard.js - Updated handleStartQuiz
const handleStartQuiz = (quizId, classId , timeToComplete) => {
  const timerData = {
    startTime: Date.now(),
    duration: timeToComplete * 60 * 1000 // Convert minutes to milliseconds
  };
  localStorage.setItem(`quizTimer_${quizId}`, JSON.stringify(timerData));
  // Generate unique window name for tracking
  const windowName = `quiz_${quizId}_${Date.now()}`;
  
  // Open window with security features
  const quizWindow = window.open(
    `/quiz/${quizId}?class=${classId}`,
    windowName,
    `width=1000,height=700,
    fullscreen=yes,
    scrollbars=no,
    resizable=no,
    toolbar=no,
    location=no,
    status=no`
  );

  // Security monitoring system
  let violationCount = 0;
  const maxViolations = 3;
  let lastFocusTime = Date.now();

  // Communication channel
  const messageHandler = (event) => {
    if (event.data.type === 'quizViolation') {
      violationCount++;
      Helpers.toast("warning", `Security violation (${violationCount}/${maxViolations}): ${event.data.message}`);
      
      if (violationCount >= maxViolations) {
        quizWindow.postMessage({ type: 'forceSubmit' }, window.location.origin);
        quizWindow.close();
        Helpers.toast("error", "Quiz terminated due to multiple violations!");
        window.removeEventListener('message', messageHandler);
      }
    }
  };

  window.addEventListener('message', messageHandler);

  // Focus tracking system
  const monitorInterval = setInterval(() => {
    if (!quizWindow || quizWindow.closed) {
      clearInterval(monitorInterval);
      Helpers.toast("error", "Quiz window was closed!");
      window.location.reload(); // Reload the dashboard to refresh state
      return;
    }

    // Check window focus
    if (!quizWindow.document.hasFocus()) {
      const timeOutOfFocus = Date.now() - lastFocusTime;
      if (timeOutOfFocus > 5000) { // 5 seconds tolerance
        quizWindow.postMessage({ 
          type: 'focusViolation',
          duration: timeOutOfFocus
        }, window.location.origin);
      }
      quizWindow.focus();
    } else {
      lastFocusTime = Date.now();
    }
  }, 1000);

  // Cleanup on window close
  quizWindow.onbeforeunload = () => {
    clearInterval(monitorInterval);
    window.removeEventListener('message', messageHandler);
    window.location.reload(); // Reload the dashboard to refresh state
  };
};
  const isQuizAvailable = (quiz) => {
    if (!quiz.start_time || !quiz.end_time) return false;
    
    const now = new Date();
    const startTime = new Date(quiz.start_time);
    const endTime = new Date(quiz.end_time);
    
    return now >= startTime && now <= endTime;
  };

  // Dashboard.js render section
return (
  <>
      <div id="kt_app_wrapper" className="app-wrapper flex-column flex-row-fluid">
        <Sidebar />
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Dashboard</h1>
          <h2 className="text-xl text-gray-600 mb-6">Your Assigned Quizzes</h2>
          <div className="quiz-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => {
                const isAvailable = isQuizAvailable(quiz);
                const now = new Date();
                const isAttempted = quiz.is_attempted === 1;
                const startTime = new Date(quiz.start_time);
                const endTime = new Date(quiz.end_time);
                
                return (
                  <div key={quiz.id} className="quiz-card bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="quiz-card-header bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-t-lg">
                      <h3 className="text-xl font-semibold" style={{ color: "white" }}>{quiz.title}</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 mb-4 min-h-[60px]">{quiz.description}</p>
                    
                      
                      <div className="quiz-meta flex flex-col gap-2 bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm">
                          <span className="block text-blue-600 font-medium">
                            <i className="fas fa-calendar-start mr-2"></i>
                            Starts: {quiz.start_time ? new Date(quiz.start_time).toLocaleString() : 'N/A'}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="block text-blue-600 font-medium">
                            <i className="fas fa-calendar-times mr-2"></i>
                            Ends: {quiz.end_time ? new Date(quiz.end_time).toLocaleString() : 'N/A'}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="block text-red-600 font-medium">
                            <i className="fas fa-clock mr-2"></i>
                            {isAvailable ? 
                              `Time left: ${Math.ceil((endTime - now) / (1000 * 60))} mins` : 
                              now < startTime ? 
                                `Starts in ${Math.ceil((startTime - now) / (1000 * 60))} mins` : 
                                'Quiz ended'}
                          </span>
                        </div>
                      </div>
                      
                       <button
                      className={`w-full mt-4 font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform ${
                        isAvailable && !isAttempted ? 
                          'bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 hover:scale-105' : 
                          'bg-gray-400 cursor-not-allowed'
                      }`}
                      onClick={() => isAvailable && !isAttempted && handleStartQuiz(quiz.quiz_id, quiz.class_id, quiz.time_to_complete)}
                      style={{ color: "white" }}
                      disabled={!isAvailable || isAttempted}
                    >
                      <i className={`fas ${
                        isAttempted ? 'fa-check' : 
                        isAvailable ? 'fa-play' : 'fa-lock'
                      } mr-2`}></i>
                      {isAttempted ? 'Already Attempted' : 
                       isAvailable ? 'Start Quiz' : 'Not Available'}
                    </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-quizzes text-center py-8 col-span-full">
                <div className="text-gray-500 text-lg">
                  <i className="fas fa-book-open fa-2x mb-4"></i>
                  <p>No quizzes assigned yet</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
);
}

export default Dashboard;
