import React, { useEffect, useState } from "react";
import {
  Dashboard as DashboardIcon,
  PeopleAlt as PeopleAltIcon,
  Assignment as AssignmentIcon,
  DevicesOther as DevicesOtherIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Tooltip from "@mui/material/Tooltip";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleActiveTab } from "../../redux/reducers/tabsReducer";
import "../../assets/css/Sidebar.css";

const menuItems = [
  { id: 1, title: "Dashboard", icon: DashboardIcon, path: "/Dashboard" },
  { id: 2, title: "Marshal Shifts", icon: AddBusinessIcon, path: "/Shifts" },
  { id: 3, title: "Manage Users", icon: PeopleAltIcon, path: "/Users" },
  { id: 4, title: "Manage Streets", icon: AssignmentIcon, path: "/Devices" },
  { id: 7, title: "Generate Reports", icon: PictureAsPdfIcon, path: "/Reports" },
  { id: 8, title: "Profile", icon: AccountCircleIcon, path: "/Profile" },
];

const Sidebar = ({ openSidebarToggle, OpenSidebar }) => {
  const dispatch = useDispatch();
  const activeSidebarTab = useSelector((state) => state.tabs.activeTab);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);
  const [navList, setNavList] = useState(activeSidebarTab);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setNavList(activeSidebarTab);
  }, [activeSidebarTab]);

  const handleNavLinkClick = (id) => {
    if (!isLargeScreen) {
      OpenSidebar();
    }
    dispatch(toggleActiveTab({ activeTab: id }));
  };

  return (
    <aside
      className={`sidebar-container ${openSidebarToggle ? "sidebar-responsive" : ""}`}
      style={{
        width: "280px",
         background: "linear-gradient(to right, #8b0000, #ff1a1a)",
  }}
    >
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <Tooltip title="in4msme portal">
            <NavLink
              to="/Dashboard"
              onClick={() => handleNavLinkClick(1)}
              className="brand-link"
            >
              <h4 className="brand-title">A Digital Solution</h4>
            </NavLink>
          </Tooltip>
        </div>
        <button className="close-button" onClick={OpenSidebar}>
          <CloseIcon />
        </button>
      </div>

      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={`nav-link ${navList === item.id ? "active" : ""}`}
                onClick={() => handleNavLinkClick(item.id)}
              >
                <Icon className="nav-icon" />
                <span className="nav-text">{item.title}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
