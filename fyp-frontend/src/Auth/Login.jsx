import React, { useState, useEffect } from "react";
import Helpers from "../Config/Helpers";
import axios from "axios";
import Loader from "../Config/Loaders";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${Helpers.apiUrl}auth/login`, {
        email,
        password,
      });
      console.log("LOGIN RESPONSE:", response.data);
console.log("FULL USER:", response.data.user);
console.log("ROLE CHECK:", response.data.user.role);

      const user = response.data.user;

localStorage.setItem("user", JSON.stringify(user));
localStorage.setItem("token", response.data.token);


const role = response.data.user.role.trim();

console.log("USER ROLE:", role);


if(role === "student"){
    navigate("/student/dashboard");
}
else if(role === "teacher"){
    navigate("/teacher/dashboard");
}
else if(role === "admin"){
    navigate("/admin/dashboard");
}
else{
    alert("Unknown role: " + role);
}
    } catch (error) {
      Helpers.toast("error", error.response?.data?.error || "Login Failed");
      console.error("Error logging in:", error);
    } finally {
      setLoading(false);
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
                Sign In to Quizly
              </h1>
              <div className="text-gray-600 fs-base text-center fw-semibold px-8">
                Empowering education with AI-driven assessments. Create quizzes, test knowledge, and improve learning through intelligent feedback.
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
                      <input
                        type="text"
                        placeholder="Email"
                        name="email"
                        autoComplete="off"
                        className="form-control bg-transparent"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="fv-row mb-8 relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        name="password"
                        autoComplete="off"
                        className="form-control bg-transparent pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                      <p>Don't have an account? <NavLink to="/signup" style={{color : "blue"}}>Create Account</NavLink></p>
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

export default Login;
