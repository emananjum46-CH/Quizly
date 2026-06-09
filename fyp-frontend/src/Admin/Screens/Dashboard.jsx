import React from 'react'
import Sidebar from '../Components/Sidebar'
function Dashboard() {
console.log("REAL ADMIN DASHBOARD STARTED");
const user =
JSON.parse(localStorage.getItem("user")) || {};
  return (
    <>
          <div
            id="kt_app_wrapper"
            className="app-wrapper flex-column flex-row-fluid"
            >
            <Sidebar />
            <div className="container mx-auto p-6">
            <h1 style={{fontSize : "2rem"}}>Admin Dashboard</h1>
              
            </div>
          </div>
        </>
  )
}

export default Dashboard
