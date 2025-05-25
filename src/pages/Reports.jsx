import React, { useEffect, useState } from "react";
import {useTheme, useMediaQuery } from "@mui/material";
import "../assets/css/Reporting.css";
import * as XLSX from 'xlsx';  
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import BackButton from "../components/commons/BackButton";
import DownloadButton from "../components/commons/DownloadButton";
import { toggleIsSubmittingTrue,toggleIsSubmittingfalse } from "../redux/reducers/submittingReducer";
import ViewButton from "../components/commons/ViewButton";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateToken } from "../redux/reducers/authReducer";
import handleAuthFailure from "../utils/handleAuthFailure";

function Reporting() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(0);
  const [allMSMEList,setAllMSMEList] = useState([]);
  const [allMSMEPendingList,setAllMSMEPendingList] = useState([]);
  const [allMSMERejectedList,setAllMSMERejectedList] = useState([]);
  const [allMSMEBlockedList,setAllMSMEBlockedList] = useState([]);
  const [allUserList,setAllUserList] = useState([]);
  const [allBSOList,setAllBSOList] = useState([]);
  const serverToken = useSelector((state) => state.server.serverToken);
  const currentUser = useSelector((state) => state.auth.user);
  const tokenHeader = currentUser.token;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch(toggleIsSubmittingTrue());
        const response = await fetch("http://localhost:4000/supervisor/all-users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            
          },
          
        }
      );

      const data = await response.json();
      
      
        if (response.ok) {
          dispatch(toggleIsSubmittingfalse());
          console.log(data.users)
          setAllMSMEList(data.users);
        }else {
          dispatch(toggleIsSubmittingfalse());
          
        }
      } catch (error) {
        dispatch(toggleIsSubmittingfalse());
      }
    };

    fetchUsers();
  }, []);
  useEffect(() => {
    const fetchMsmeAllMSMERejected = async () => {
      try {
        dispatch(toggleIsSubmittingTrue());
        const response = await fetch("http://localhost:4000/shift/weekly", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            
          },
          
        }
      );

      const data = await response.json();
      
      
        if (response.ok) {
          dispatch(toggleIsSubmittingfalse());
          console.log("Shift: ",data.data)
          setAllMSMERejectedList(data.data);
        } else {
          dispatch(toggleIsSubmittingfalse());
          
        }
      } catch (error) {
        dispatch(toggleIsSubmittingfalse());
      }
    };

    fetchMsmeAllMSMERejected();
  }, []);
  useEffect(() => {
    const fetchMsmeAllUsers = async () => {
      try {
        dispatch(toggleIsSubmittingTrue());
        const response = await fetch("/system/all/admin/list/download", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            
          },
          
        }
      );

      const data = await response.json();
      
      
        if (response.ok) {
          dispatch(toggleIsSubmittingfalse());
          setAllUserList(data.data);
        }else {
          dispatch(toggleIsSubmittingfalse());
          
        }
      } catch (error) {
        dispatch(toggleIsSubmittingfalse());
        
      }
    };

    fetchMsmeAllUsers();
  }, []);
 
  const lines = [
    "All User Report",
    "All Shift Report"
  ];

  const columns = [
    { field: "id", headerName: "#", width: isSmallScreen ?50 : 70 },
    { field: "reportName", headerName: "REPORT NAME", width: isSmallScreen ? 350:750 },
    {
      field: "action",
      headerName: "XLSX",
      width:250,
      renderCell: (params) => (
        <ViewButton onClick={() => {
          if(params.row.id === 1){
            handleDownloadAllMSME();
            console.log("here is the: ",allMSMEList)
          };
          if(params.row.id === 2 && allMSMERejectedList.length > 0 ){
            handleDownloadAllMSMERejected();
            console.log("here is the: ",allMSMEList)
          };
          console.log("here is the: ",params.row.id)
          //onClick={handleDownloadAllUsers}
        }}/>
      ),
    }

  ];
  const rows = lines.map((line, index) => ({
    id: index + 1,
    reportName: line,
    action: "",
    actions: "",
  }));
  const handleDownloadAllMSME =() =>{
    try{
      var wb = XLSX.utils.book_new();
      var ws = XLSX.utils.json_to_sheet(allMSMEList);
      XLSX.utils.book_append_sheet(wb,ws, "All System List");
      XLSX.writeFile(wb,"All_System_List.xlsx");
    }catch(error){
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Check your internet connection and try again!`,
        showConfirmButton: false,
        timer: 4000
      });
    }
  }
  
  const handleDownloadAllMSMERejected =() =>{
    console.log(allMSMERejectedList.Marshall);
    console.log(allMSMERejectedList.Marshall)
    try{
      var wb = XLSX.utils.book_new();
      var ws = XLSX.utils.json_to_sheet(allMSMERejectedList);
      XLSX.utils.book_append_sheet(wb,ws, "Shift List");
      XLSX.writeFile(wb,"Shift_List.xlsx");
    }catch(error){
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Check your internet connection and try again!`,
        showConfirmButton: false,
        timer: 4000
      });
    }
  }
  
  

  return (
    <div className="container-fluid mt-4">
      <p className="msme">Reports</p>
      <p>Access and view detailed reports.</p>
      <div className="mt-1 mt-md-4">
      <Box className="" justifyContent={"space-evenly"}>
        <Box
        marginTop={isSmallScreen ? "1px" : "50px"}
          display="grid"
          gridTemplateColumns={
            isSmallScreen ? "repeat(1, 1fr)" : "repeat(12, 1fr)"
          }
          //gridAutoRows="270px"
          gap={isSmallScreen ? "0px" : "10px"}
        >
          <Box
            gridColumn={isSmallScreen ? "span 12" : "span 12"}
            gridRow="span 3"
          >
            <div className="col-12 p-4 shadow rounded-3 mb-4">
              {
                activeTab === 0 &&<>
                  <div className="col-12 mt-1">
                <p className="list-groupp">All Reports</p>
                <Box sx={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={rows}
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
                          pageSize: 6,
                        },
                      },
                    }}
                    pageSizeOptions={[6]}
                    disableRowSelectionOnClick
                      hideFooter
                  />
                </Box>
              </div>
                </>
              }
              
            </div>
          </Box>
        </Box>{" "}
      </Box>
      </div>
    </div>
  );
}

export default Reporting;