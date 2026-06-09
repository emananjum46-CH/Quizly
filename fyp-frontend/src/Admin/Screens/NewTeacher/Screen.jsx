import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/Sidebar";
import Loader from "../../../Config/Loaders";
import Helpers from "../../../Config/Helpers";

function Screen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsButtonLoading(true);

    try {
      const response = await axios.post(`${Helpers.apiUrl}auth/invite-teacher`, {
        email: email,
      });

      alert(response.data.message);
      setEmail("");
    } catch (error) {
      console.error("Error inviting teacher:", error);
      alert(
        error.response?.data?.message ||
          "Failed to send invitation. Please try again."
      );
    } finally {
      setIsButtonLoading(false);
    }
  };

  return (
    <div>
      <div id="kt_app_wrapper" className="app-wrapper flex-column flex-row-fluid">
        <Sidebar />
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            <div
              className="card mb-5 mb-xl-8 bg-slate-200"
              style={{ marginTop: "-4%" }}
            >
              <div className="card-header border-0 pt-5">
                <h3 className="card-title align-items-start flex-column">
                  <span className="card-label fw-bold fs-3 mb-1">New Teacher</span>
                </h3>
              </div>
            </div>

            <div className="card-body py-3 m-5 px-5 rounded bg-gray-100">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    id="email"
                    placeholder="Enter teacher's email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="text-right">
                  <button
                    type="submit"
                    disabled={isButtonLoading}
                    className="bg-[#FF7A50] font-bold py-2 px-6 rounded-xl duration-300"
                    style={{ color: "white" , background:"black" }}
                  >
                    {isButtonLoading ? "Please wait..." : "Send Invite"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Screen;
