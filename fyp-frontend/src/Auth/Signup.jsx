import React, { useState, useEffect } from "react";
import Helpers from "../Config/Helpers";
import axios from "axios";
import Loader from "../Config/Loaders";
import { NavLink } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [classes, setClasses] = useState([]);
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    class_id: ''
});

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch(`${Helpers.apiUrl}auth/students/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const data = await res.json();
        if (data.success) {
            alert('Registration successful!');
            window.location.href = '/';
        }
    } catch (err) {
        alert('Registration failed');
    }
};
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classesRes] = await Promise.all([
        fetch(`${Helpers.apiUrl}classes/get`),
      ]);

      const classesData = await classesRes.json();

      setClasses(classesData);
    } catch (error) {
      toast.error("Failed to fetch data");
    }
  };


  return (
    <div>
      {pageLoading ? (
        <Loader />
      ) : (
        <div className="d-flex flex-column flex-lg-row flex-column-fluid">
          <div className="d-flex flex-lg-row-fluid">
            <div className="d-flex flex-column flex-center pb-0 pb-lg-10 p-10 w-100">
              <h1 className="text-gray-800 fs-2qx fw-bold text-center mb-7">
                Create Student Account
              </h1>
              <div className="text-gray-600 fs-base text-center fw-semibold px-8">
                Time tracker software boosts organization, productivity, and
                offers valuable insights into your time management. Align you
                personally with time management Ideal for hourly billing
                professionals & multitasking project.
              </div>
            </div>
          </div>
          <div className="d-flex flex-column-fluid flex-lg-row-auto justify-content-center justify-content-lg-end p-12">
            <div className="bg-body d-flex flex-column flex-center rounded-4 w-md-600px p-10">
              <div className="d-flex flex-center flex-column align-items-stretch h-lg-100 w-md-400px">
                <div className="d-flex flex-center flex-column flex-column-fluid pb-15 pb-lg-20">
                  <form
                    className="form w-100"
                    noValidate
                    id="kt_sign_in_form"
                    onSubmit={handleSubmit}
                  >
                    <div className="separator separator-content my-14">
                      <span className="w-125px text-gray-500 fw-semibold fs-7">
                        Sign In
                      </span>
                    </div>
                    <div className="fv-row mb-8">
                    {/* <label className="form-label">Enter your name</label> */}
                      <input
                        type="text"
                        placeholder="Enter Your Name"
                        name="name"
                        autoComplete="off"
                        className="form-control bg-transparent"
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="fv-row mb-8">
                      {/* <label className="form-label">Enter your email</label> */}
                      <input
                        type="text"
                        placeholder="Enter Your Email"
                        name="email"
                        autoComplete="off"
                        className="form-control bg-transparent"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="fv-row mb-8">
                      {/* <label className="form-label">Select Class</label> */}
                      <select
                        className="form-select"
                        value={formData.class_id}
                        onChange={(e) => setFormData({...formData, class_id: e.target.value})}
                        required
                      >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.class_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="fv-row mb-8 relative">
                    {/* <label className="form-label">Enter your password</label> */}
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Your Password"
                        name="password"
                        autoComplete="off"
                        className="form-control bg-transparent pr-10"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />

                      <i
                        className={`fa ${
                          showPassword ? "fa-eye" : "fa-eye-slash"
                        }`}
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          color: "#aaa",
                        }}
                      ></i>
                    </div>
                    <div className="fv-row mb-8">
                      <p>
                        Already have an account?{" "}
                        <NavLink to="/" style={{ color: "blue" }}>
                          Login
                        </NavLink>
                      </p>
                    </div>

                    <div className="d-grid mb-10">
                      <button
                        type="submit"
                        id="kt_sign_in_submit"
                        className="btn"
                        style={{
                          background: "#FF7A50",
                          color: "white",
                          padding: "1rem",
                          borderRadius: "5px",
                        }}
                      >
                        <span className="indicator-label">
                          {isLoading ? "Please wait ..." : "Sign In"}
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
