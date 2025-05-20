import React, { useEffect, useState } from "react";
import { Box, IconButton, Avatar, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import Dropdown from "react-bootstrap/Dropdown";
import Badge from "@mui/material/Badge";
import { BsPersonGear, BsBoxArrowRight } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/KPI-Logo-Dark.png";
import "../../assets/css/TopBar.css";
import { CapitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { toggleSidebarfalse } from "../../redux/reducers/sidebarReducer";
import { login } from "../../redux/reducers/authReducer";
import { toggleAuthenticationfalse} from "../../redux/reducers/twoFactorReducer";
import { updateToken } from "../../redux/reducers/authReducer";
import { updateServerToken } from "../../redux/reducers/serverReducer";
import { toggleActiveTab } from "../../redux/reducers/tabsReducer";
import Swal from "sweetalert2";

const Topbar = ({ OpenSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  console.log("my current user: ",currentUser)
  const serverToken = useSelector((state) => state.server.serverToken);
  const updatingState = useSelector((state) => state.submitting.isSubmitting);
  const [isSubmitting, setIsSubmitting] = useState(false);
  let fullName = currentUser?.firstname + currentUser?.lastname;
  const [allNotificationsCount,setAllNotificationsCount] = useState(0);
  let firstLetter = CapitalizeFirstLetter(currentUser?.firstname);
  let secondLetter = CapitalizeFirstLetter(currentUser?.lastname);

  return (
    <Box
      className="topbar-container"
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem 1.5rem",
        background: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}
    >
      <div className="topbar-left">
        <Box display="flex" alignItems="center" gap={2}>
          <div className="d-none d-lg-block">
            <img 
              src={logo} 
              alt="logo" 
              className="topbar-logo"
            />
          </div>
          <div className="d-block d-lg-none">
            <IconButton 
              onClick={OpenSidebar}
              sx={{ color: "red" }}
            >
              <MenuIcon />
            </IconButton>
          </div>
        </Box>
      </div>

      <Box display="flex" alignItems="center" gap={2}>

        <div className="user-info d-none d-sm-flex">
          <div className="user-details">
            <p className="user-name">
              {fullName.length <= 14
                ? currentUser?.firstname + " " + currentUser?.lastname
                : currentUser?.lastname}
            </p>
            <p className="user-role">{currentUser?.role}</p>
          </div>
        </div>

        <div className="user-avatar">
          {currentUser?.profileImage ? (
            <Avatar 
              alt="User Profile" 
              src={currentUser?.profileImage}
              sx={{ width: 40, height: 40 }}
            />
          ) : (
            <Avatar
              sx={{ 
                bgcolor: "#1976d2",
                width: 40,
                height: 40
              }}
            >{`${firstLetter}${secondLetter}`}</Avatar>
          )}
        </div>

        <Dropdown className="user-dropdown" autoClose="outside">
          <Dropdown.Toggle variant="" id="dropdown-basic" className="dropdown-toggle">
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu">
            <Dropdown.Item 
              href="/profile" 
              onClick={() => dispatch(toggleActiveTab({ activeTab: 8 }))}
              className="dropdown-item"
            >
              <BsPersonGear /> Profile
            </Dropdown.Item>
            <Dropdown.Item onClick={() =>{
              dispatch(toggleAuthenticationfalse());
        dispatch(toggleSidebarfalse());
        dispatch(
          login({
            user: {},
          })
        );
        navigate("/");
            }} className="dropdown-item">
              <BsBoxArrowRight /> Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Box>
    </Box>
  );
};

export default Topbar;
