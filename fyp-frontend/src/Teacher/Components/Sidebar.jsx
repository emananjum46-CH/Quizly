import React from "react";
import { NavLink } from "react-router-dom";
function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("loginTimestamp");
    window.location.href = "/";
  };
  return (
    <>

      <div
        id="kt_app_sidebar"
        className="app-sidebar flex-column"
        data-kt-drawer="true"
        data-kt-drawer-name="app-sidebar"
        data-kt-drawer-activate="{default: true, lg: false}"
        data-kt-drawer-overlay="true"
        data-kt-drawer-width="225px"
        data-kt-drawer-direction="start"
        data-kt-drawer-toggle="#kt_app_sidebar_mobile_toggle"
      >
        <div className="app-sidebar-logo px-6" id="kt_app_sidebar_logo">
          <a href="#">
          <h1 style={{ fontSize : "2.4rem" , fontWeight : "bold", color: "white"}}>Quizly</h1>
          </a>
        </div>
        <div className="app-sidebar-menu overflow-hidden flex-column-fluid">
          <div id="kt_app_sidebar_menu_wrapper" className="app-sidebar-wrapper">
            <div
              id="kt_app_sidebar_menu_scroll"
              style={{ height: "calc(100vh - 170px)" }}
              className="scroll-y my-5 mx-3"
              data-kt-scroll="true"
              data-kt-scroll-activate="true"
              data-kt-scroll-height="auto"
              data-kt-scroll-dependencies="#kt_app_sidebar_logo, #kt_app_sidebar_footer"
              data-kt-scroll-wrappers="#kt_app_sidebar_menu"
              data-kt-scroll-offset="5px"
              data-kt-scroll-save-state="true"
            // style={{ height: "428px" }}
            >
              <div
                className="menu menu-column menu-rounded menu-sub-indention fw-semibold fs-6"
                id="#kt_app_sidebar_menu"
                data-kt-menu="true"
                data-kt-menu-expand="false"
              >
                <div
                  data-kt-menu-trigger="click"
                  className="menu-item here show menu-accordion"
                >
                  <span className="menu-link">
                    <span className="menu-title">
                      <NavLink
                        to="/teacher/dashboard"
                        className={({ isActive }) =>
                          isActive ? 'text-orange-500 hover:text-orange-500' : 'text-white hover:text-primary'
                        }
                      >
                        <i className="fa-solid fa-house pr-5"></i>
                        Dashboard
                      </NavLink>
                    </span>
                  </span>
                </div>
                <div className="menu-item pt-5">
                  <div className="menu-content">
                    <span className="menu-heading fw-bold text-uppercase fs-7">
                      Quiz Section
                    </span>
                  </div>
                </div>
                <div
                  data-kt-menu-trigger="click"
                  className="menu-item here show menu-accordion"
                >
                  <span className="menu-link">
                    <span className="menu-title">
                      <NavLink
                        to="/teacher/newquiz"
                        className={({ isActive }) =>
                          isActive ? 'text-orange-500 hover:text-orange-500' : 'text-white hover:text-primary'
                        }
                      >
                        <i className="fa-solid fa-plus pr-5"></i>
                        Create Quiz
                      </NavLink>
                    </span>
                  </span>
                </div>

                <div
                  data-kt-menu-trigger="click"
                  className="menu-item here show menu-accordion"
                >
                  <span className="menu-link">
                    <span className="menu-title">
                      <NavLink
                        to="/teacher/listquiz"
                        className={({ isActive }) =>
                          isActive ? 'text-orange-500 hover:text-orange-500' : 'text-white hover:text-primary'
                        }
                      >
                        <i className="fa-solid fa-list pr-5"></i>
                        Assign Quiz
                      </NavLink>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="app-sidebar-footer flex-column-auto pt-2 pb-6 px-6"
          id="kt_app_sidebar_footer"
        >
          <button
            className="btn btn-flex flex-center btn-custom btn-primary overflow-hidden text-nowrap px-0 h-40px w-100"
            data-bs-toggle="tooltip"
            data-bs-trigger="hover"
            data-bs-dismiss-="click"
            data-bs-original-title="200+ in-house components and 3rd-party plugins"
            data-kt-initialized="1"
            onClick={handleLogout}
          >
            <span className="btn-label">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
