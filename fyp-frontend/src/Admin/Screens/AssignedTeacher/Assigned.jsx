import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import { toast } from "react-toastify";
import Helpers from "../../../Config/Helpers";

function Assigned() {
    const [assignments, setAssignments] = useState([]);
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({ class_id: "", teacher_id: "" });
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [classesRes, teachersRes, assignmentsRes] = await Promise.all([
                fetch(`${Helpers.apiUrl}classes/get`),
                fetch(`${Helpers.apiUrl}teachers/all-teachers`),
                fetch(`${Helpers.apiUrl}teachers/assignments`)
            ]);
            
            const classesData = await classesRes.json();
            const teachersData = await teachersRes.json();
            const assignmentsData = await assignmentsRes.json();

            setClasses(classesData);
            setTeachers(teachersData);
            setAssignments(assignmentsData);
        } catch (error) {
            toast.error("Failed to fetch data");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await fetch(`${Helpers.apiUrl}teachers/assignments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Assignment created successfully!");
                fetchData();
                setFormData({ class_id: "", teacher_id: "" });
                setShowForm(false);
            } else {
                toast.error(data.message || "Failed to create assignment");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this assignment?")) {
            try {
                const response = await fetch(`${Helpers.apiUrl}teachers/assignments/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                
                if (response.ok) {
                    toast.success("Assignment deleted successfully");
                    fetchData();
                } else {
                    toast.error("Failed to delete assignment");
                }
            } catch (error) {
                toast.error("Network error");
            }
        }
    };

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
                                            <h3 className="card-label">Teacher Assignments</h3>
                                        </div>
                                        <div className="card-toolbar">
                                            <button 
                                                className="btn"
                                                onClick={() => setShowForm(!showForm)}
                                                style={{color: "white" , background:"black"}}
                                            >
                                                {showForm ? "View List" : "Add New Assignment"}
                                            </button>
                                        </div>
                                    </div>

                                    {showForm ? (
                                        <div className="card-body">
                                            <form onSubmit={handleSubmit}>
                                                <div className="row mb-5">
                                                    <div className="col-md-6">
                                                        <label className="form-label">Class</label>
                                                        <select
                                                            className="form-select"
                                                            value={formData.class_id}
                                                            onChange={(e) => setFormData({ 
                                                                ...formData, 
                                                                class_id: e.target.value 
                                                            })}
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
                                                    
                                                    <div className="col-md-6">
                                                        <label className="form-label">Teacher</label>
                                                        <select
                                                            className="form-select"
                                                            value={formData.teacher_id}
                                                            onChange={(e) => setFormData({ 
                                                                ...formData, 
                                                                teacher_id: e.target.value 
                                                            })}
                                                            required
                                                        >
                                                            <option value="">Select Teacher</option>
                                                            {teachers.map(teacher => (
                                                                <option key={teacher.id} value={teacher.id}>
                                                                    {teacher.name} ({teacher.email})
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="d-flex gap-3">
                                                    <button 
                                                        type="submit" 
                                                        className="btn"
                                                        disabled={loading}
                                                        style={{color: "white" , background:"black"}}
                                                    >
                                                        {loading ? "Assigning..." : "Create Assignment"}
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-secondary"
                                                        onClick={() => setShowForm(false)}
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
                                                            <th className="min-w-150px">Class</th>
                                                            <th className="min-w-200px">Teacher</th>
                                                            <th className="min-w-100px">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {assignments.map(assignment => (
                                                            <tr key={assignment.id}>
                                                                <td>{assignment.class_name}</td>
                                                                <td>{assignment.teacher_name}</td>
                                                                <td>
                                                                    <button 
                                                                        className="btn btn-sm btn-icon btn-bg-light btn-active-color-danger"
                                                                        onClick={() => handleDelete(assignment.id)}
                                                                    >
                                                                        <i className="fa-solid fa-trash"></i>
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

export default Assigned;