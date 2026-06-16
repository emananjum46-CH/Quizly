import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Auth/Login";
import AdminDashboard from "./Admin/Screens/Dashboard";
import TeacherDashboard from "./Teacher/Screens/Dashboard"; 
import StudentDashboard from "./Student/Screens/Dashboard"; 
import Screen from "./Admin/Screens/NewTeacher/Screen";
import Screen1 from "./Admin/Screens/Class/Screen";
import Register from "./Teacher/Screens/Register";
import NewQuiz from "./Teacher/Screens/NewQuiz";
import ListQuiz from "./Teacher/Screens/ListQuiz";
import Assigned from "./Admin/Screens/AssignedTeacher/Assigned";
import Result from "./Student/Screens/Result";
import Signup from "./Auth/Signup";
import QuizWindow from "./Student/Screens/QuizWindow";


function App() {
  return (
    <Router>
      <div className="d-flex flex-column flex-root app-root" id="kt_app_root">
        <div className="app-page flex-column flex-column-fluid" id="kt_app_page">
          <Routes>
            {/* Auth */}
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Dashboards */}
            <Route path="/admin/Dashboard" element={<AdminDashboard />} />
            <Route path="/admin/newteacher" element={<Screen />} />
            <Route path="/admin/classlist" element={<Screen1 />} />
            <Route path="/admin/teacherlist" element={<Assigned />} />

            <Route path="/register/teacher" element={<Register />} />
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/newquiz" element={<NewQuiz />} />
            <Route path="/teacher/listquiz" element={<ListQuiz />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/result" element={<Result />} />
            <Route path="/quiz/:quizId" element={<QuizWindow />} />
            <Route path="/quiz/:id" element={<QuizWindow />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
