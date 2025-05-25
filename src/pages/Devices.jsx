import React, { useEffect, useState } from "react";
import { IconButton, useTheme, useMediaQuery } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import "../assets/css/msme.css";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import { toggleIsSubmittingTrue,toggleIsSubmittingfalse } from "../redux/reducers/submittingReducer";
import Box from "@mui/material/Box";
import { CgCloseR } from "react-icons/cg";
import { DataGrid } from "@mui/x-data-grid";
import UpdateButton from "../components/commons/UpdateButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Swal from "sweetalert2";
import "../assets/css/User.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import MyButton from "../components/commons/MyButton";
import Modal from "@mui/material/Modal";
import { toggleSidebarfalse } from "../redux/reducers/sidebarReducer";
import { useNavigate } from "react-router-dom";
import { updateToken } from "../redux/reducers/authReducer";
import DeleteButton from "../components/commons/DeleteButton";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/reducers/authReducer";
import handleAuthFailure from "../utils/handleAuthFailure";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '95%',
    sm: '90%', 
    md: '70%',
    xl: '50%',
    xxl: '30%'
  },
  height: "80%",
  bgcolor: 'background.paper',
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  p: 4,
  overflowY: 'auto'
};

function User() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const serverToken = useSelector((state) => state.server.serverToken);

  const [totalSystemUsers, setTotalSystemUsers] = useState("");
  const [totalSuperUser, setTotalSuperUser] = useState("");
  const [totalAdmins, setTotalAdmins] = useState("");
  const [totalAppUsers, setTotalAppUsers] = useState("");
  const [adminList, setAdminList] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setlastNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentError, setDepartmentError] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [contactNumberError, setContactNumberError] = useState("");
  const [role, setRole] = useState("");
  const [roleError, setRoleError] = useState("");
  const [newData, setNewData] = useState([])

  const [firstNameDetails, setFirstNameDetails] = useState("");
  const [firstNameDetailsError, setFirstNameDetailsError] = useState("");
  const [lastNameDetails, setLastNameDetails] = useState("");
  const [lastNameDetailsError, setlastNameDetailsError] = useState("");
  const [emailDetails, setEmailDetails] = useState("");
  const [emailDetailsError, setEmailDetailsError] = useState("");
  const [departmentDetails, setDepartmentDetails] = useState("");
  const [departmentDetailsError, setDepartmentDetailsError] = useState("");
  const [contactNumberDetails, setContactNumberDetails] = useState("");
  const [contactNumberDetailsError, setContactNumberDetailsError] =
    useState("");
  const [roleDetails, setRoleDetails] = useState("");
  const [roleDetailsError, setRoleDetailsError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingDetails, setUpdatingDetails] = useState([]);

  const [updatingFail, setUpdatingFail] = useState("");
  const tokenHeader = currentUser.token;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const namibiaPhoneRegex = /^(?:\+264|0)(\s?\d{2})\s?\d{3}\s?\d{4}$/;

  const [searchQuery, setSearchQuery] = useState("");
  const [openModel, setOpenModel] = useState(false);
  const [openModelEditing, setOpenModelEditing] = useState(false);
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => {
    setFirstNameError("");
    setlastNameError("");
    setEmailError("");
    setContactNumberError("");
    setDepartmentError("");
    setRoleError("");
    setOpenModel(false);
  };

  const handleCloseEditing = () => {
    setFirstNameDetails("");
    setLastNameDetails("");
    setEmailDetails("");
    setContactNumberDetails("");
    setDepartmentDetails("");
    setRoleDetails("");
    setFirstNameDetailsError("");
    setlastNameDetailsError("");
    setEmailDetailsError("");
    setContactNumberDetailsError("");
    setDepartmentDetailsError("");
    setRoleDetailsError("");
    setUpdatingFail("");
    setOpenModelEditing(false);
  };
  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        dispatch(toggleIsSubmittingTrue());
        const response = await fetch(
          "http://localhost:4000/street/all-street",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
             // Authorization: `${serverToken}`,
             // 'x-access-token': `${tokenHeader}`
            },
            
          }
        );

        const data = await response.json();

        if (response.ok) {
          dispatch(toggleIsSubmittingfalse());
          console.log(data.total)
          setTotalSystemUsers(data.total);
        } else {
          dispatch(toggleIsSubmittingfalse());
          //handleAuthFailure({ dispatch, navigate, type: "auth" });
        }
      } catch (error) {
        dispatch(toggleIsSubmittingfalse());
      }
    };

    fetchTotalCount();
  }, [isSubmitting]);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        dispatch(toggleIsSubmittingTrue());
        const response = await fetch(
          "http://localhost:4000/street/all-active",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
             // Authorization: `${serverToken}`,
             // 'x-access-token': `${tokenHeader}`
            },
            
          }
        );

        const data = await response.json();
        
        if (response.ok) {
          dispatch(toggleIsSubmittingfalse());
          setTotalSuperUser(data.total);
        } else {
          dispatch(toggleIsSubmittingfalse());
          //handleAuthFailure({ dispatch, navigate, type: "auth" });
        }
      } catch (error) {
        dispatch(toggleIsSubmittingfalse());
      }
    };

    fetchPendingCount();
  }, [isSubmitting]);

  useEffect(() => {
    const fetchRejectedCount = async () => {
      try {
        dispatch(toggleIsSubmittingTrue());
        const response = await fetch(
          "http://localhost:4000/street/all-inactive",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
             // Authorization: `${serverToken}`,
             // 'x-access-token': `${tokenHeader}`
            },
            
          }
        );

        const data = await response.json();
        

        if (response.ok) {
          console.log(data)
          dispatch(toggleIsSubmittingfalse());
          setTotalAdmins(data.total);
        } else {
          dispatch(toggleIsSubmittingfalse());
          //handleAuthFailure({ dispatch, navigate, type: "auth" });
        }
      } catch (error) {
        dispatch(toggleIsSubmittingfalse());
      }
    };

    fetchRejectedCount();
  }, [isSubmitting]);

  useEffect(() => {
    const fetchApprovedCount = async () => {
      try {
        dispatch(toggleIsSubmittingTrue());
        const response = await fetch(
          "http://localhost:4000/street/all-under-maintenance",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            //  Authorization: `${serverToken}`,
             // 'x-access-token': `${tokenHeader}`
            },
            
          }
        );

        const data = await response.json();
       
        if (response.ok) {
          dispatch(toggleIsSubmittingfalse());
          setTotalAppUsers(data.total);
        } else {
          dispatch(toggleIsSubmittingfalse());
         // handleAuthFailure({ dispatch, navigate, type: "auth" });
        }
      } catch (error) {
        dispatch(toggleIsSubmittingfalse());
      }
    };

    fetchApprovedCount();
  }, [isSubmitting]);
  useEffect(() => {
    const fetchApprovedCount = async () => {
      try {
        dispatch(toggleIsSubmittingTrue());
        const response = await fetch(
          "http://localhost:4000/street/all-street",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            //  Authorization: `${serverToken}`,
            //  'x-access-token': `${tokenHeader}`
            },
            
          }
        );

        const data = await response.json();
        

        if (response.ok) {
          dispatch(toggleIsSubmittingfalse());
          setAdminList(data.data);
        } else {
          dispatch(toggleIsSubmittingfalse());
         // handleAuthFailure({ dispatch, navigate, type: "auth" });
        }
      } catch (error) {
        dispatch(toggleIsSubmittingfalse());
        
      }
    };

    fetchApprovedCount();
  }, [isSubmitting]);

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(
          `http://localhost:4000/street/single/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          
        }
      );

      const data = await response.json();

      const street = data.data[0];

if (response.ok) {
  setUpdatingDetails(street);
  setFirstNameDetails(street.streetCode);
  setLastNameDetails(street.priority);
  setRoleDetails(street.status);
  setOpenModelEditing(true);
      } else {
        await Swal.fire({
          position: "center",
          icon: "error",
          title: `${data.message}`,
          showConfirmButton: false,
          timer: 4000,
        });
        
      }
    } catch (error) {
      
    }
    //setOpenModelEditing(true)
  };
  const handleDeletion = async (id) => {
    
      Swal.fire({
        title: "Are you sure?",
        text: "Street will be removed from the system completely!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            setIsSubmitting(true);

            const response = await fetch(
              "http://localhost:4000/street/single",
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                
                body: JSON.stringify({ id }),
              }
            );

            const data = await response.json();
            console.log(data, email)
            if (response.ok) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: `Street Successfully Deleted`,
                showConfirmButton: false,
                timer: 4000,
              });
            } else {
              await Swal.fire({
                position: "center",
                icon: "error",
                title: `${data.message}`,
                showConfirmButton: false,
                timer: 4000,
              });
              
            }
          } catch (error) {
            
          } finally {
            setIsSubmitting(false);
          }
        }
      });
    
  };

  const columns = [
    {
      field: "streetCode",
      headerName: "Street code",
      width: isSmallScreen ? 100 : 170,
    },
    {
      field: "priority",
      headerName: "Priority",
      width: isSmallScreen ? 100 : 170,
    },
    { field: "status", headerName: "Status", width: isSmallScreen ? 120 : 220 },
    {
      field: "action",
      headerName: "",
      width: isSmallScreen ? 230 : 350,
      renderCell: (params) => (
        <>
          {currentUser.role !== "Marshall" && (
            <>
              <UpdateButton onClick={() => handleUpdate(params.row.id)} />
              <DeleteButton onClick={() => handleDeletion(params.row.id)} />
            </>
          )}
        </>
      ),
    },
  ];

  const rows = adminList.map((admin) => ({
    id: admin.id,
    streetCode: admin.streetCode,
    priority: admin.priority,
    status: admin.status
  }));

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const companyDepartmentsOptions = [
    { value: "Active" },
    { value: "Inactive" },
    { value: "Under Maintainance" },
  ];

  const roleOptions = [
    {
      value: 1,
    },
    {
      value: 2,
    },
    {
      value: 3,
    },

  ];

  const fields1 = [
    { value: firstName, setError: setFirstNameError, name: "Street code" },
    { value: lastName, setError: setlastNameError, name: "Priority" },
    { value: role, setError: setRoleError, name: "Status" }
  ];
  const validateFields1 = () => {
    let isValid = true;
    fields1.forEach((field) => {
      field.setError("");
      if (!field.value) {
        field.setError(`${field.name} is required.`);
        isValid = false;
      }
    });
    return isValid;
  };

  const fields2 = [
    {
      value: firstNameDetails,
      setError: setFirstNameDetailsError,
      name: "First Name",
    },
    {
      value: lastNameDetails,
      setError: setlastNameDetailsError,
      name: "Last Name",
    },
    
    { value: roleDetails, setError: setRoleDetailsError, name: "Role" },
  ];
  const validateFields2 = () => {
    let isValid = true;
    fields2.forEach((field) => {
      field.setError("");
      if (!field.value) {
        field.setError(`${field.name} is required.`);
        isValid = false;
      }
    });
    return isValid;
  };

  const handleSubmitUpdate = async () => {
    console.log(firstNameDetails)
    if (
      updatingDetails.streetCode === firstNameDetails &&
      updatingDetails.priority === lastNameDetails &&
      updatingDetails.status === roleDetails
    ) {
      setUpdatingFail("You have not made any changes");
    } else {
      if (validateFields2()) {
        try {
          setIsSubmitting(true);
          const requestData = {
            id: updatingDetails.id,
            streetCode: firstNameDetails,
            priority: lastNameDetails,
            status: roleDetails,
          };
          const response = await fetch(
            `http://localhost:4000/street/single`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              
              body: JSON.stringify(requestData),
            }
          );

          const data = await response.json();

          if (response.ok) {
            setOpenModelEditing(false);
            setIsSubmitting(false);
            Swal.fire({
              position: "center",
              icon: "success",
              title: `Street Successfully Updated`,
              showConfirmButton: false,
              timer: 4000,
            });
            setFirstNameDetails("");
            setLastNameDetails("");
            setEmailDetails("");
            setContactNumberDetails("");
            setRoleDetails("");
          } else {
            setIsSubmitting(false);
            setOpenModelEditing(false);
            await Swal.fire({
              position: "center",
              icon: "error",
              title: `${data.message}`,
              showConfirmButton: false,
              timer: 4000,
            });
            setFirstNameDetails("");
            setLastNameDetails("");
            setEmailDetails("");
            setContactNumberDetails("");
            setRoleDetails("");
          }
        } catch (error) {
          setIsSubmitting(false);
          setOpenModelEditing(false);
          
        }
      }
    }
  };
  const handleSubmit = async () => {
    if (validateFields1()) {
      console.log("here is the device: ",department)
      try {
        setIsSubmitting(true);
        const requestData = {
          streetCode:firstName,
          priority:lastName,
          status:role,
        };

        const response = await fetch(
          "http://localhost:4000/street/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            
            body: JSON.stringify(requestData),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setOpenModel(false);
          setIsSubmitting(false);
          Swal.fire({
            position: "center",
            icon: "success",
            title: `${firstName} Successfully Added`,
            showConfirmButton: false,
            timer: 4000,
          });
          setFirstName("");
          setLastName("");
          
          setRole("");
        } else {
          setIsSubmitting(false);
          setOpenModel(false);
          await Swal.fire({
            position: "center",
            icon: "error",
            title: `${data.message}`,
            showConfirmButton: false,
            timer: 4000,
          });
          setFirstName("");
          setLastName("");
          
          setRole("");
        }
      } catch (error) {
        setIsSubmitting(false);
        setOpenModel(false);
        
      }
    }
  };

  return (
    <>
      {isSubmitting ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isSubmitting}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <div className="container-fluid mt-4">

          <Box className="" justifyContent={"space-evenly"}>
            <Box
              display="grid"
              gridTemplateColumns={
                isSmallScreen ? "repeat(1, 1fr)" : "repeat(12, 1fr)"
              }
              gridAutoRows="140px"
              gap={isSmallScreen ? "0px" : "10px"}
            >
              <Box
                marginTop={"10px"}
                gridColumn={isSmallScreen ? "span 12" : "span 3"}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <div className="col-12 p-5 shadow rounded-2">
                  <div className="d-flex justify-content-between">
                    <Tooltip title="Total Streets" className="pointer">
                      <p className="text">Total streets</p>
                    </Tooltip>
                    
                  </div>
                  <div className="d-flex justify-content-start">
                    
                    <Tooltip title={totalSystemUsers}>
                      <p className="digit text pointer">{totalSystemUsers}</p>
                    </Tooltip>
                  </div>
                </div>
              </Box>

              <Box
                marginTop={"10px"}
                gridColumn={isSmallScreen ? "span 12" : "span 3"}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <div className="col-12 p-5 shadow rounded-2">
                  <div className="d-flex justify-content-between">
                    <Tooltip title="Total active streets" className="pointer">
                      <p className="text">Active streets</p>
                    </Tooltip>

                  </div>
                  <div className="d-flex align-items-center justify-content-start text-center">
                    
                    <Tooltip title={totalSuperUser}>
                      <p className="digit text pointer">{totalSuperUser}</p>
                    </Tooltip>
                  </div>
                </div>
              </Box>

              <Box
                marginTop={"10px"}
                gridColumn={isSmallScreen ? "span 12" : "span 3"}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <div className="col-12 p-5 shadow rounded-2">
                  <div className="d-flex justify-content-between">
                    <Tooltip title="Total inactive streets" className="pointer">
                      <p className="text">Inactive streets</p>
                    </Tooltip>

                   
                  </div>
                  <div className="d-flex align-items-center justify-content-start text-center">
                    
                    <Tooltip title={totalAdmins}>
                      <p className="digit text pointer">{totalAdmins}</p>
                    </Tooltip>
                  </div>
                </div>
              </Box>

              <Box
                marginTop={"10px"}
                gridColumn={isSmallScreen ? "span 12" : "span 3"}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <div className="col-12 p-5 shadow rounded-2">
                  <div className="d-flex justify-content-between">
                    <Tooltip title="Total under maintanence" className="pointer">
                      <p className="text">Under maintanence</p>
                    </Tooltip>

                  </div>
                  <div className="d-flex align-items-center justify-content-start text-center">
                    
                    <Tooltip title={totalAppUsers}>
                      <p className="digit text pointer">{totalAppUsers}</p>
                    </Tooltip>
                  </div>
                </div>
              </Box>

              <Box
                gridColumn={isSmallScreen ? "span 12" : "span 12"}
                gridRow="span 3"
              >
                <div className="col-12 mb-4 listing-msme p-4 shadow rounded-3 mb-4">
                  <div className="col-12 col-lg-12 col-xxl-9 mx-auto mt-4 d-flex justify-content-end">
                    <Box
                      display="flex"
                      backgroundColor="rgba(245, 246, 248, 1)"
                      borderRadius="3px"
                      width="300px"
                      marginRight="10px"
                    >
                      {/* rgba(245, 246, 248, 1) */}
                      <InputBase
                        sx={{ ml: 2, flex: 1 }}
                        placeholder="Search here........."
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <IconButton type="button" sx={{ p: 1 }}>
                        <SearchIcon />
                      </IconButton>
                    </Box>
                    {currentUser.role === "Supervisor" && (
                      <>
                        <div onClick={handleOpen}>
                          <MyButton text="Add Street" />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="col-12 mt-1">
                    <p className="list-groupp">Street List</p>
                    {adminList ? (
                      <>
                        <Box sx={{ height: 500, width: "100%" }}>
                          <DataGrid
                            rows={filteredRows}
                            columns={columns}
                            sx={{
                              "& .MuiDataGrid-root": {
                                fontFamily: "Montserrat, sans-serif",
                              },
                              "& .status-pending": {
                                color: "rgb(234, 156, 0)",
                              },
                              "& .status-rejected": {
                                color: "red",
                              },
                              "& .status-approved": {
                                color: "green",
                              },
                              "& .MuiDataGrid-columnHeaders": {
                                fontWeight: 800,
                                fontFamily: "Montserrat, sans-serif",
                              },
                              "& .MuiDataGrid-columnHeaderTitle": {
                                fontWeight: 600,
                                fontFamily: "Montserrat, sans-serif",
                              },
                              "& .MuiDataGrid-cell": {
                                fontWeight: 400,
                                fontFamily: "Montserrat, sans-serif",
                              },
                            }}
                            initialState={{
                              pagination: {
                                paginationModel: {
                                  pageSize: 25, 
                                },
                              },
                            }}
                            pageSizeOptions={[25, 50, 100]}
                            checkboxSelection
                            disableRowSelectionOnClick
                          />
                        </Box>
                      </>
                    ) : (
                      <>
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{ height: 500, width: "100%" }}
                        >
                          <div style={{ textAlign: "center" }}>
                            <CircularProgress color="inherit" />
                            <p className="p-4 text-secondary">
                              Just a moment, we’re getting things ready...
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Box>
            </Box>{" "}
          </Box>
          <Modal
            open={openModel}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <div className="d-flex justify-content-between align-items-center">
                <div></div>
                <h1 className="text-center">Add New Street</h1>
                <CgCloseR
                  style={{
                    color: "red",
                    fontSize: "32px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setFirstName("");
                    setLastName("");
          
                    setRole("");
                    setFirstNameError("");
                    setlastNameError("");
                
                    setDepartment("")
                    setRoleError("");
                    setOpenModel(false);
                  }}
                />
              </div>

              <div className="container mt-0">
  <div className="row g-2">
    <div className="col-md-6">
      <div className="form-group pb-md-2">
        <label htmlFor="firstName" className="pb-2 text-boldd">
          Street Code: <span>*</span>
        </label>
        <input
          type="text"
          className="form-control place-holder"
          placeholder="Street code"
          autoComplete="off"
          value={firstName}
          name="firstName"
          onChange={(e) => {
            setFirstNameError("");
            setFirstName(e.target.value);
          }}
        />
        {firstNameError && (
          <p className="error-message">{firstNameError}</p>
        )}
      </div>
    </div>

    <div className="col-md-6">
      <div className="form-group pb-md-2">
        <label htmlFor="role" className="pb-2 text-boldd">
          Priority: <span>*</span>
        </label>
        <select
          className="form-select"
          value={lastName}
          onChange={(e) => {
            setlastNameError("");
            setLastName(e.target.value);
          }}
        >
          <option value="" disabled>
            Select priority
          </option>
          {roleOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.value}
            </option>
          ))}
        </select>
        {roleError && (
          <p className="error-message">{roleError}</p>
        )}
      </div>
    </div>



    <div className="col-md-6">
      <div className="form-group pb-md-2">
        <label htmlFor="role" className="pb-2 text-boldd">
          Status: <span>*</span>
        </label>
        <select
          className="form-select"
          value={role}
          onChange={(e) => {
            setRoleError("");
            setRole(e.target.value);
          }}
        >
          <option value="" disabled>
            Select role
          </option>
          {companyDepartmentsOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.value}
            </option>
          ))}
        </select>
        {roleError && (
          <p className="error-message">{roleError}</p>
        )}
      </div>
    </div>

    <div className="col-12 d-flex justify-content-center mt-md-4">
      <button
        className="btn btn-warning m-1 p-2 w-50 text-boldd"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  </div>
</div>

            </Box>
          </Modal>
          <Modal
            open={openModelEditing}
            onClose={handleCloseEditing}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <div className="d-flex justify-content-between align-items-center">
                <div></div>
                <h1 className="text-center">Update Street Details</h1>
                <CgCloseR
                  style={{
                    color: "red",
                    fontSize: "32px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setFirstNameDetails("");
                    setLastNameDetails("");
                    
                    setRoleDetails("");
                    setFirstNameDetailsError("");
                    setlastNameDetailsError("");
                    
                    setRoleDetailsError("");
                    setUpdatingFail("");
                    setOpenModelEditing(false);
                  }}
                />
              </div>

              {updatingFail && (
                <>
                  <div className="col-md-6 p-1 p-md-3 error-div d-flex justify-content-center align-items-center m-auto">
                    <p>{updatingFail}</p>
                  </div>
                </>
              )}
              <div className="row mt-0">
  <div className="col-12 col-md-6">
    <div className="form-group pb-md-2">
      <label htmlFor="firstName" className="pb-2 text-boldd">
        Street code: <span>*</span>
      </label>
      <input
        type="text"
        value={firstNameDetails}
        className="form-control place-holder"
        placeholder="Street code"
        autoComplete="off"
        name="firstName"
        onChange={(e) => {
          setFirstNameDetailsError("");
          setUpdatingFail("");
          setFirstNameDetails(e.target.value);
        }}
      />
      {firstNameDetailsError && (
        <p className="error-message">{firstNameDetailsError}</p>
      )}
    </div>
  </div>

  <div className="col-12 col-md-6">
    <div className="form-group pb-md-2">
      <label htmlFor="role" className="pb-2 text-boldd">
        Priority: <span>*</span>
      </label>
      <select
        className="form-select"
        value={lastNameDetails}
        onChange={(e) => {
          setlastNameDetailsError("");
          setUpdatingFail("");
          setLastNameDetails(e.target.value);
        }}
      >
        <option value="" disabled>
          Select priority
        </option>
        {roleOptions.map((option) => (
          <option value={option.value} key={option.value}>
            {option.value}
          </option>
        ))}
      </select>
      {roleDetailsError && (
        <p className="error-message">{roleDetailsError}</p>
      )}
    </div>
  </div>


  <div className="col-12 col-md-6">
    <div className="form-group pb-md-2">
      <label htmlFor="role" className="pb-2 text-boldd">
        Status: <span>*</span>
      </label>
      <select
        className="form-select"
        value={roleDetails}
        onChange={(e) => {
          setRoleDetailsError("");
          setUpdatingFail("");
          setRoleDetails(e.target.value);
        }}
      >
        <option value="" disabled>
          Select role
        </option>
        {companyDepartmentsOptions.map((option) => (
          <option value={option.value} key={option.value}>
            {option.value}
          </option>
        ))}
      </select>
      {roleDetailsError && (
        <p className="error-message">{roleDetailsError}</p>
      )}
    </div>
  </div>


  <div className="col-12 d-flex justify-content-center mt-md-4">
    <button
      className="btn btn-warning m-1 p-2 w-50 text-boldd"
      onClick={handleSubmitUpdate}
      disabled={updatingDetails.streetCode === firstNameDetails &&
      updatingDetails.priority === lastNameDetails &&
      updatingDetails.status === roleDetails }
    >
      Update
    </button>
  </div>
</div>

            </Box>
          </Modal>
        </div>
      )}
    </>
  );
}

export default User;