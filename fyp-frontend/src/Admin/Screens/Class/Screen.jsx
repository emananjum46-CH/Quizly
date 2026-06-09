import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import { toast } from "react-toastify";
import Helpers from "../../../Config/Helpers";

function ClassManagement() {
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({ class_name: "" });
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentClassId, setCurrentClassId] = useState(null);

    // Fetch data on component mount
    useEffect(() => {
        fetchClasses();
        // fetchTeachers();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await fetch(`${Helpers.apiUrl}classes/get`);
            const data = await response.json();
            if (response.ok) setClasses(data);
        } catch (error) {
            toast.error("Failed to fetch classes");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const url = editMode 
            ? `${Helpers.apiUrl}classes/edit/${currentClassId}`
            : `${Helpers.apiUrl}classes/store`;
            
        const method = editMode ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`Class ${editMode ? 'updated' : 'created'} successfully!`);
                fetchClasses();
                handleCancel();
            } else {
                toast.error(data.message || "Operation failed");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (cls) => {
        setFormData({ class_name: cls.class_name });
        setEditMode(true);
        setCurrentClassId(cls.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this class?")) {
            try {
                const response = await fetch(`${Helpers.apiUrl}classes/delete/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                
                if (response.ok) {
                    toast.success("Class deleted successfully");
                    fetchClasses();
                } else {
                    toast.error("Failed to delete class");
                }
            } catch (error) {
                toast.error("Network error");
            }
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditMode(false);
        setCurrentClassId(null);
        setFormData({ class_name: "" });
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
                                            <h3 className="card-label">Classes Management</h3>
                                        </div>
                                        <div className="card-toolbar">
                                            <button 
                                                className="btn"
                                                onClick={() => setShowForm(!showForm)}
                                                style={{color: "white", backgroundColor: "black", border: "none"}}
                                            >
                                                {showForm ? "View List" : "Add New Class"}
                                            </button>
                                        </div>
                                    </div>

                                    {showForm ? (
                                        <div className="card-body">
                                            <form onSubmit={handleSubmit}>
                                                <div className="mb-5">
                                                    <label className="form-label">Class Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.class_name}
                                                        onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                                                        required
                                                    />
                                                </div>

                                                <div className="d-flex gap-3">
                                                    <button 
                                                        type="submit" 
                                                        className="btn "
                                                        disabled={loading}
                                                        style={{color: "white", backgroundColor: "black", border: "none"}}
                                                    >
                                                        {loading 
                                                            ? (editMode ? "Updating..." : "Creating...") 
                                                            : (editMode ? "Update Class" : "Create Class")}
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-secondary"
                                                        onClick={handleCancel}
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
                                                            <th className="min-w-150px">Class Name</th>
                                                            <th className="min-w-100px">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {classes.map(cls => (
                                                            <tr key={cls.id}>
                                                                <td>{cls.class_name}</td>
                                                                <td>
                                                                    <button 
                                                                        className="btn btn-sm btn-icon btn-bg-light btn-active-color-primary me-2"
                                                                        onClick={() => handleEdit(cls)}
                                                                    >
                                                                        <i className="fa-solid fa-pencil" style={{ color : "black"}}></i>
                                                                    </button>
                                                                    <button 
                                                                        className="btn btn-sm btn-icon btn-bg-light btn-active-color-danger"
                                                                        onClick={() => handleDelete(cls.id)}
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

export default ClassManagement;