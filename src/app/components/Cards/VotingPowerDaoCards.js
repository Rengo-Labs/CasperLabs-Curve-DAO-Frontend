import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from "@mui/material/Typography";
import React from "react";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/common.css";
import "../../assets/css/curveButton.css";
import "../../assets/css/style.css";

const VotingPowerDaoCards = ({title,value,src}) => {
  return (
    <>
      <div className="text-center">
        <Card sx={{
            paddingY:"20px",
            height:"150px",
            transition: "0.3s",
            boxShadow: "0 8px 40px -12px rgba(0,0,0,0.2)",
            "&:hover": {
              boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
            },
            borderRadius:"10px"
        }}>
          <CardContent>
            <Typography sx={{fontWeight:"bold"}}  variant="h6" style={{color: "#000027"}}>
              {value}
            </Typography>
            <div className="d-flex justify-content-center mt-2">
            {src?<img src={src} height="20" width="20" className="mr-1" alt="Curve Logo"></img>:null}
            <Typography sx={{fontSize:"15px"}}>
                {title}
            </Typography>
          </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default VotingPowerDaoCards;
