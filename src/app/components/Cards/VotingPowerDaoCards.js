// REACT
import React from "react";
// CUSTOM STYLES
import "../../assets/css/common.css";
import "../../assets/css/curveButton.css";
import "../../assets/css/style.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// COMPONENTS
import { CardHeader } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from "@mui/material/Typography";


// COMPONENT FUNCTION
const VotingPowerDaoCards = ({title,value,avatar,src}) => {
  return (
    <>
      <div className="text-center">
        <Card sx={{
            paddingY:"20px",
            height:"200px",
            transition: "0.3s",
            boxShadow: "0 8px 40px -12px rgba(0,0,0,0.2)",
            // "&:hover": {
            //   boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
            // },
            borderRadius:"10px"
        }}>
          <div className="d-flex justify-content-center">
            {src?<img src={src} height="40" width="40" className="mt-2" alt="Curve Logo"></img>:null}
            <CardHeader title={title} variant="h2" avatar={avatar?avatar:null} />
          </div>
          <CardContent>
            <Typography  variant="h5" style={{color: "#000027",}}>
              {value}
            </Typography>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default VotingPowerDaoCards;
