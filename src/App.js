import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Topbar from "./components/admin/TopBar";
import Sidebar from "./components/admin/SideBar";
import Dashboard from "./pages/Dashboard";
 import Email from "./pages/Email";
// import Content from "./pages/Content";
// import Msme from "./pages/Msme";
// import User from "./pages/User";
// import Notifications from "./pages/Notifications";
// import Reporting from "./pages/Reporting";
import Profile from "./pages/Profile";
import { useSelector } from "react-redux";
import AdminRoute from "./AdminRoute";
// import SubmitEmail from "./pages/SubmitEmail";
 import ForgotPassword from "./pages/ChangePassword";

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  let sidebar = useSelector((state) => state.sidebar.isSidebarOpen);
  let currentUser = useSelector((state) => state.auth.user);
  const isAuthenticated = currentUser ? true: false;

  return (
    <Router>
      <ToastContainer />
      <div className="App">
        <div className="content">
          <div className="d-flex" style={{ display: "flex", height: "100vh" }}>
            {sidebar && (
              <Sidebar
                openSidebarToggle={openSidebarToggle}
                OpenSidebar={OpenSidebar}
              />
            )}
            <div
              style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                borderBottom: "1px solid rgba(255, 255, 255, 1)",
              }}
            >
              <div>{sidebar && <Topbar OpenSidebar={OpenSidebar} />}</div>
              <div
                style={{ flexGrow: 1, overflow: "auto" }}
              >
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route element={<AdminRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    {/* <Route path="/bso" element={<Bso />} />
                    <Route path="/users" element={<User />} />
                    <Route path="/content" element={<Content />} />
                    <Route path="/msme" element={<Msme />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/reporting" element={<Reporting />} /> */}
                  </Route>
                  <Route path="/email" element={<Email />} />
                  <Route path="/reset-password" element={<ForgotPassword />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
