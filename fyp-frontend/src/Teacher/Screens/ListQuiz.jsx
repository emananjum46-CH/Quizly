import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import { toast } from "react-toastify";
import Helpers from "../../Config/Helpers";

function ListQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    quiz_id: "",
    class_id: "",
    start_time: "",
    end_time: ""
  });
  const [editingId, setEditingId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [quizzesRes, classesRes, assignmentsRes] = await Promise.all([
        fetch(`${Helpers.apiUrl}teachers/created-by/${user.id}`),
        fetch(`${Helpers.apiUrl}classes/get`),
        fetch(`${Helpers.apiUrl}teachers/assigned-by/${user.id}`)
      ]);
      
      const quizzesData = await quizzesRes.json();
      const classesData = await classesRes.json();
      const assignmentsData = await assignmentsRes.json();

      setQuizzes(quizzesData);
      setClasses(classesData);
      setAssignments(assignmentsData);
    } catch (error) {
      toast.error("Failed to fetch data");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate time range
    if (new Date(formData.start_time) >= new Date(formData.end_time)) {
      toast.error("End time must be after start time");
      return;
    }

    const url = editingId 
      ? `${Helpers.apiUrl}teachers/edit/${editingId}`
      : `${Helpers.apiUrl}teachers/store`;

    try {
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          ...formData,
          assigned_by: user.id
        })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Assignment ${editingId ? 'updated' : 'created'}!`);
        fetchData();
        setShowForm(false);
        setFormData({ quiz_id: "", class_id: "", start_time: "", end_time: "" });
        setEditingId(null);
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleEdit = (assignment) => {
    setFormData({
      quiz_id: assignment.quiz_id,
      class_id: assignment.class_id,
      start_time: assignment.start_time ? assignment.start_time.replace(" ", "T").substring(0, 16) : "",
      end_time: assignment.end_time ? assignment.end_time.replace(" ", "T").substring(0, 16) : ""
    });
    setEditingId(assignment.id);
    setShowForm(true);
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // ... rest of your component remains similar ...

  return (
    <div>
      <div id="kt_app_wrapper" className="app-wrapper flex-column flex-row-fluid">
        <Sidebar />
        
        <div className="app-main flex-column flex-row-fluid">
          <div className="d-flex flex-column flex-column-fluid">
            <div className="app-content flex-column-fluid mt-10">
              <div className="app-container container-xxl">
                <div className="card">
                  <div className="card-header border-0 pt-6">
                    <div className="card-title">
                      <h3 className="card-label">Quiz Assignments</h3>
                    </div>
                    <div className="card-toolbar">
                      <button 
                        className="btn"
                        onClick={() => setShowForm(!showForm)}
                        style={{ backgroundColor: "black", color: "white" }}
                      >
                        {showForm ? "View Assignments" : "New Assignment"}
                      </button>
                    </div>
                  </div>

                  {showForm ? (
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row g-5">
                          <div className="col-md-4">
                            <label className="form-label">Quiz</label>
                            <select
                              className="form-select"
                              value={formData.quiz_id}
                              onChange={e => setFormData({...formData, quiz_id: e.target.value})}
                              required
                            >
                              <option value="">Select Quiz</option>
                              {quizzes.map(quiz => (
                                <option key={quiz.id} value={quiz.id}>
                                  {quiz.title}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="col-md-4">
                            <label className="form-label">Class</label>
                            <select
                              className="form-select"
                              value={formData.class_id}
                              onChange={e => setFormData({...formData, class_id: e.target.value})}
                              required
                            >
                              <option value="">Select Class</option>
                              {classes.map(cls => (
                                <option key={cls.id} value={cls.id}>
                                  {cls.class_name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="col-md-2">
                            <label className="form-label">Start Time</label>
                            <input
                              type="datetime-local"
                              className="form-control"
                              value={formData.start_time}
                              onChange={e => setFormData({...formData, start_time: e.target.value})}
                              required
                            />
                          </div>

                          <div className="col-md-2">
                            <label className="form-label">End Time</label>
                            <input
                              type="datetime-local"
                              className="form-control"
                              value={formData.end_time}
                              onChange={e => setFormData({...formData, end_time: e.target.value})}
                              required
                            />
                          </div>
                        </div>

                        <div className="d-flex gap-3 mt-5">
                          <button type="submit" className="btn " style={{ backgroundColor: "black", color: "white" }}>
                            {editingId ? "Update Assignment" : "Create Assignment"}
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => {
                              setShowForm(false);
                              setEditingId(null);
                              setFormData({ quiz_id: "", class_id: "", start_time: "", end_time: "" });
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                          <thead>
                            <tr className="fw-bold text-muted">
                              <th className="min-w-150px">Quiz Title</th>
                              <th className="min-w-150px">Class</th>
                              <th className="min-w-150px">Start Time</th>
                              <th className="min-w-150px">End Time</th>
                              <th className="min-w-100px">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {assignments.map(assignment => (
                              <tr key={assignment.id}>
                                <td>{assignment.quiz_title}</td>
                                <td>{assignment.class_name}</td>
                                <td>{formatDateTime(assignment.start_time)}</td>
                                <td>{formatDateTime(assignment.end_time)}</td>
                                <td>
                                  <button 
                                    className="btn btn-sm btn-icon btn-bg-light me-2"
                                    onClick={() => handleEdit(assignment)}
                                  >
                                    <i className="fa-solid fa-pencil" style={{ color: "black" }}></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListQuiz;