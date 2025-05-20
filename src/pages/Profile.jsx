import { React, useState, useRef, useEffect } from "react";
import "../assets/css/profile.css";
import { useTheme, useMediaQuery } from "@mui/material";
import profile from "../assets/images/profile.jpg";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { toggleIsSubmittingTrue,toggleIsSubmittingfalse } from "../redux/reducers/submittingReducer";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from "react-redux";
import { updateProfileImage } from "../redux/reducers/authReducer";
import { login } from "../redux/reducers/authReducer";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { updateToken } from "../redux/reducers/authReducer";
import { toggleSidebarfalse } from "../redux/reducers/sidebarReducer";
import handleAuthFailure from "../utils/handleAuthFailure";

function Profile() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [currentPasswordShown, setCurrentPasswordShown] = useState(false);
  const [newPasswordShown, setNewPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

  const inputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("select");
  const currentUser = useSelector((state) => state.auth.user);
  const [error, setError] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [newProfilePic, setNewProfilePic] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState(currentUser.firstname);
  const [lastName, setLastName] = useState(currentUser.lastname);
  const [email, setEmail] = useState(currentUser.email);
  console.log(currentUser)
  const [contactNumber, setContactNumber] = useState(currentUser.contactNumber);
  const [department, setDepartment] = useState(currentUser.department);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  //const serverToken = useSelector((state) => state.server.serverToken);
  //const tokenHeader = currentUser.token;
  const buttonStyle = {
    color: "red",
    borderColor: "red",
  };

  useEffect(() => {
    dispatch(toggleIsSubmittingTrue());
    if (currentUser && currentUser.profileImage) {
      const parsedData = currentUser.profileImage;
      setProfilePic(parsedData);
    }
    dispatch(toggleIsSubmittingfalse());
  }, [currentUser]);

  const convertToBase64 = (file) => {
    var reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      setNewProfilePic(reader.result);
    };
    reader.onerror = (error) => {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `${error}`,
        showConfirmButton: false,
        timer: 3000,
      });
    };
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
      const validMimeTypes = [
        "image/jpeg", // .jpg and .jpeg
        "image/png", // .png
      ];

      if (!allowedExtensions.exec(file.name)) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: `Please upload a valid image file with .jpg, .jpeg, or .png extension.`,
          showConfirmButton: false,
          timer: 4000,
        });
        setSelectedFile(null);
        return;
      }

      if (!validMimeTypes.includes(file.type)) {
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      convertToBase64(file);
    }
  };

  const clearFileInput = () => {
    inputRef.current.value = "";
    setSelectedFile(null);
    setNewProfilePic("");
    setUploadStatus("select");
    setError("");
  };

  const handleCameraClick = () => {
    inputRef.current.click();
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Passwords do not match!`,
        showConfirmButton: false,
        timer: 4000,
      });
    } else {
      try {
        setIsSubmitting(true);
        const response = await fetch(
          `https://dt.mtc.com.na:4000/auth/admin/change-password`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              //Authorization: `${serverToken}`,
              //'x-access-token': `${tokenHeader}`
            },
            
            body: JSON.stringify({
              currentPassword,
              newPassword,
              confirmPassword,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setIsSubmitting(false);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Password successfully updated!",
            showConfirmButton: false,
            timer: 4000,
          });
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          setIsSubmitting(false);
          await Swal.fire({
            position: "center",
            icon: "error",
            title: `${data.message}`,
            showConfirmButton: false,
            timer: 4000,
          });
          
        }
      } catch (error) {
        setIsSubmitting(false);
        handleAuthFailure({ dispatch, navigate, type: "network" });
      }
    }
  };

  const handleUserDetailsChange = async () => {
    if ( !email || !contactNumber) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Input fields cannot be empty`,
        showConfirmButton: false,
        timer: 3000,
      });
    } else {
      if (
        email === currentUser.email &&
        contactNumber === currentUser.contactNumber
      ) {
        Swal.fire({
          position: "center",
          icon: "info",
          title: `You have not made any changes`,
          showConfirmButton: false,
          timer: 4000,
        });
      } else {
        try {
          setIsSubmitting(true);
          const response = await fetch(
            `http://localhost:4000/auth/update/details`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
               // Authorization: `${serverToken}`,
                //'x-access-token': `${tokenHeader}`
              },
              
              body: JSON.stringify({
                email,
               phoneNumber: contactNumber,
               userId: currentUser.id
              }),
            }
          );

          const data = await response.json();

          if (response.ok) {
            setIsSubmitting(false);
            Swal.fire({
              position: "center",
              icon: "success",
              title: `${currentUser.role} details successfully updated!`,
              showConfirmButton: false,
              timer: 4000,
            });
            dispatch(login({
              user: data.currentUser
            }));
            setIsEditing(false);
          } else {
            setIsSubmitting(false);
            await Swal.fire({
              position: "center",
              icon: "error",
              title: `${data.message}`,
              showConfirmButton: false,
              timer: 4000,
            });
            
          }
        } catch (error) {
          setIsSubmitting(false);
          handleAuthFailure({ dispatch, navigate, type: "network" });
                  }
      }
    }
  };

  return (
    <>
    {
      isSubmitting ? (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isSubmitting}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) :(
        <div className="container mt-4">
      <div className="row d-flex flex-column flex-md-row justify-content-around mx-auto mt-4">
        <div className="d-flex align-items-center border rounded-3">
          <div>
            <div className="col-12  mt-4 p-1  p-md-4 d-flex flex-column justify-content-center align-items-center b-g me-3 ">
              <div className="position-relative">
                
                <img
                  src={selectedFile ? newProfilePic : profilePic || profile}
                  className="circular-image img-responsive img-thumbnail"
                  alt=""
                />
                
              </div>

              
            </div>
          </div>
          <div>
            <h3 className="d-none d-sm-block">
              {currentUser.firstname} {currentUser.lastname}
            </h3>
            <h5 className="d-block d-sm-none">
              {currentUser.firstname} {currentUser.lastname}
            </h5>
            <p className="role">Role: {currentUser.role}</p>
          </div>
        </div>
        <div className="col-12 rounded-3 mt-4 border p-4 d-flex flex-column justify-content-start align-items-start b-g me-3">
          <div className="d-flex justify-content-between align-items-center w-100">
            <h6 className="text-boldd">Personal Information</h6>
            <Stack direction="row" spacing={2}>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outlined"
                  size={isSmallScreen ? "small" : "medium"}
                  color="info"
                  endIcon={<EditIcon />}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setFirstName(currentUser.firstName);
                    setLastName(currentUser.lastName);
                    setEmail(currentUser.email);
                    setContactNumber(currentUser.phoneNumber);
                    setIsEditing(false);
                  }}
                  variant="outlined"
                  size={isSmallScreen ? "small" : "medium"}
                  style={buttonStyle}
                  endIcon={<DeleteIcon />}
                >
                  Undo
                </Button>
              )}
            </Stack>
          </div>
          <div className="container mt-3">
  <div className="row">
    <div className="col-12 col-md-6 mb-3">
      <div className="form-group">
        <label htmlFor="firstName" className="pb-md-2">First Name:</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          className="form-control place-holder p-md-2"
          placeholder="example@nipdb.com.na"
          autoComplete="off"
          name="firstName"
          disabled={true}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
    </div>

    <div className="col-12 col-md-6 mb-3">
      <div className="form-group">
        <label htmlFor="lastName" className="pb-md-2">Last Name:</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          className="form-control place-holder p-md-2"
          placeholder="example@nipdb.com.na"
          autoComplete="off"
          name="lastName"
          disabled={true}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
    </div>

    <div className="col-12 col-md-6 mb-3">
      <div className="form-group">
        <label htmlFor="email" className="pb-md-2">Email Address:</label>
        <input
          type="text"
          id="email"
          value={email}
          className="form-control place-holder p-md-2"
          placeholder="example@nipdb.com.na"
          autoComplete="off"
          name="email"
          disabled={!isEditing}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
    </div>

    <div className="col-12 col-md-6 mb-3">
      <div className="form-group">
        <label htmlFor="contactNumber" className="pb-md-2">Contact Number:</label>
        <input
          type="text"
          id="contactNumber"
          value={contactNumber}
          className="form-control place-holder p-md-2"
          placeholder="081 *** ****"
          autoComplete="off"
          name="contactNumber"
          disabled={!isEditing}
          onChange={(e) => setContactNumber(e.target.value)}
        />
      </div>
    </div>

    {isEditing && (
      <div className="col-12 col-md-6 mb-3">
        <button
          className="btn btn-success w-100"
          onClick={handleUserDetailsChange}
        >
          Submit
        </button>
      </div>
    )}
  </div>
</div>

        </div>
        <div className="col-12 rounded-3 mt-4 border p-4 d-flex flex-column justify-content-start align-items-start b-g me-3">
          <h6 className="text-boldd">Security Information</h6>
          <div className="row mt-2">
  <div className="col-12 col-md-8">
    <div className="form-group pb-md-3 position-relative">
      <label htmlFor="email" className="pb-md-2">Current Password:</label>
      <input
        type={currentPasswordShown ? "text" : "password"}
        value={currentPassword}
        className="form-control place-holder p-md-2"
        placeholder="**********************"
        autoComplete="off"
        name="email"
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <span
        className="show-password position-absolute"
        onClick={() => setCurrentPasswordShown(!currentPasswordShown)}
        style={{ cursor: "pointer", top: "50%", right: "10px", transform: "translateY(-50%)" }}
      >
        {currentPasswordShown ? (
          <VisibilityIcon sx={{ color: "rgba(0, 0, 0, 0.5)" }} />
        ) : (
          <VisibilityOffIcon sx={{ color: "rgba(0, 0, 0, 0.5)" }} />
        )}
      </span>
    </div>
  </div>

  <div className="col-12 col-md-5"></div>

  <div className="col-12 col-md-8">
    <div className="form-group pb-md-3 position-relative">
      <label htmlFor="email" className="pb-md-2">New Password:</label>
      <input
        type={newPasswordShown ? "text" : "password"}
        value={newPassword}
        className="form-control place-holder p-md-2"
        placeholder="**********************"
        autoComplete="off"
        name="email"
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <span
        className="show-password position-absolute"
        onClick={() => setNewPasswordShown(!newPasswordShown)}
        style={{ cursor: "pointer", top: "50%", right: "10px", transform: "translateY(-50%)" }}
      >
        {newPasswordShown ? (
          <VisibilityIcon sx={{ color: "rgba(0, 0, 0, 0.5)" }} />
        ) : (
          <VisibilityOffIcon sx={{ color: "rgba(0, 0, 0, 0.5)" }} />
        )}
      </span>
    </div>
  </div>

  <div className="col-12 col-md-5"></div>

  <div className="col-12 col-md-8">
    <div className="form-group pb-md-3 position-relative">
      <label htmlFor="email" className="pb-md-2">Confirm Password:</label>
      <input
        type={confirmPasswordShown ? "text" : "password"}
        value={confirmPassword}
        className="form-control place-holder p-md-2"
        placeholder="**********************"
        autoComplete="off"
        name="email"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <span
        className="show-password position-absolute"
        onClick={() => setConfirmPasswordShown(!confirmPasswordShown)}
        style={{ cursor: "pointer", top: "50%", right: "10px", transform: "translateY(-50%)" }}
      >
        {confirmPasswordShown ? (
          <VisibilityIcon sx={{ color: "rgba(0, 0, 0, 0.5)" }} />
        ) : (
          <VisibilityOffIcon sx={{ color: "rgba(0, 0, 0, 0.5)" }} />
        )}
      </span>
    </div>
  </div>

  <div className="col-12 col-md-8">
    {currentPassword && newPassword && confirmPassword && (
      <button
        className="btn btn-success p-md-2 w-100 pt-top"
        onClick={handlePasswordChange}
      >
        Change Password
      </button>
    )}
  </div>
</div>

        </div>
      </div>
    </div>
      )
    }
    </>
  );
}

export default Profile;