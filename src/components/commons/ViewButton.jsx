// ViewButton.jsx
import React from "react";
import { Button } from "@mui/material";
import { FaEye} from "react-icons/fa";

const ViewButton = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      style={{
         background: "linear-gradient(to right, #8b0000, #ff1a1a)",
        color: "#fff",
        padding: "6px",
        paddingLeft: "10px",
        borderRadius: "5px",
        cursor: "pointer",
        fontFamily:"Montserrat, sans-serif",
        width: "100%",
      }}
    >
      Download
    </Button>
  );
};

export default ViewButton;



// BenefitVoucher