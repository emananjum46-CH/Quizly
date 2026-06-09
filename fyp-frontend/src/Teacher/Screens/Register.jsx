
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Loader from "../../Config/Loaders";
import Helpers from "../../Config/Helpers";

function TeacherRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [email, setEmail] = useState("");
  const token = new URLSearchParams(location.search).get("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded?.email) {
        setEmail(decoded.email);
      }
    }
  }, [token]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      Helpers.toast("error", "Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${Helpers.apiUrl}auth/register/teacher`,
        {
          token,
          name: formData.name,
          password: formData.password,
        }
      );

      if (res.data.success) {
        Helpers.toast("success", "Registration successful!");
        navigate("/");
      }
    } catch (error) {
      Helpers.toast("error", error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
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
                Complete Teacher Registration
              </h1>
              <div className="text-gray-600 fs-base text-center fw-semibold px-8">
                Welcome to our educational platform. Please complete your registration
                to access teacher-specific features and classroom management tools.
              </div>
            </div>
          </div>
          
          <div className="d-flex flex-column-fluid flex-lg-row-auto justify-content-center justify-content-lg-end p-12">
            <div className="bg-body d-flex flex-column flex-center rounded-4 w-md-600px p-10">
              <div className="d-flex flex-center flex-column align-items-stretch h-lg-100 w-md-400px">
                <div className="d-flex flex-center flex-column flex-column-fluid pb-15 pb-lg-20">
                  <form className="form w-100" onSubmit={handleSubmit}>
                    <div className="fv-row mb-8">
                      <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={email}
                        disabled
                        className="form-control bg-transparent"
                      />
                    </div>

                    <div className="fv-row mb-8">
                      <input
                        type="text"
                        placeholder="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-control bg-transparent"
                        required
                      />
                    </div>

                    <div className="fv-row mb-8 relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="form-control bg-transparent pr-10"
                        required
                      />
                      <i
                        className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
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

                    <div className="fv-row mb-8 relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="form-control bg-transparent pr-10"
                        required
                      />
                      <i
                        className={`fa ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"}`}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

                    <div className="d-grid mb-10">
                      <button
                        type="submit"
                        className="btn"
                        style={{
                          background: "#2563eb",
                          color: "white",
                          padding: "1rem",
                          borderRadius: "5px",
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? "Registering..." : "Complete Registration"}
                      </button>
                    </div>

                    <div className="fv-row mb-8 text-center">
                      <NavLink to="/login" style={{ color: "#2563eb" }}>
                        Already have an account? Login here
                      </NavLink>
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

export default TeacherRegister;