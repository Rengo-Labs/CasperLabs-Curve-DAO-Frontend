// REACT
import React, { useState, useEffect } from "react";
// CUSTOM STYLING
import "../../assets/css/SelectInput.css";
import "../../assets/css/ThemeHoverButton.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// MATERIAL UI
import { StyledEngineProvider } from "@mui/styled-engine";
// FORMIK
import { useField, useFormikContext } from "formik";
import { Avatar, MenuItem, TextField, Button, Grid } from "@mui/material";

const LockTimeButtons = ({
  icon,
  setDate,
  setDateDisplay,
  name,
  options,
  avatar,
  date,
  setStartingVPower,
  lockAmount
}) => {
  // States
  const { setFieldValue } = useFormikContext() ?? {};
  const [field, meta] = useField(name);
  console.log("Name: ", name);
  console.log("Field: ", field);
  console.log("Meta: ", meta);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [buttonValue, setbuttonValue] = useState();

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  function formatDate(date) {
    return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join("-");
  }

  useEffect(() => {
    if (buttonValue === 1) {
      //   console.log("evt.target", evt.target.value);
      console.log(
        "currentDate.getTime()",
        formatDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))
      );
      console.log("date", currentDate.getDate() + 7);
      setDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
      setDateDisplay(
        formatDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))
      );
      setStartingVPower(lockAmount * 7 / 1460)
    } else if (buttonValue === 2) {
      setDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          currentDate.getDate()
        )
      );
      setDateDisplay(
        formatDate(
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            currentDate.getDate()
          )
        )
      );
      setStartingVPower(lockAmount * 30.33 / 1460)
    } else if (buttonValue === 3) {
      setDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 3,
          currentDate.getDate()
        )
      );
      setDateDisplay(
        formatDate(
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 3,
            currentDate.getDate()
          )
        )
      );
      setStartingVPower(lockAmount * 91.25 / 1460)
    } else if (buttonValue === 4) {
      setDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 6,
          currentDate.getDate()
        )
      );
      setDateDisplay(
        formatDate(
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 6,
            currentDate.getDate()
          )
        )
      );
      setStartingVPower(lockAmount * 182.52 / 1460)
    } else if (buttonValue === 5) {
      setDate(
        new Date(
          currentDate.getFullYear() + 1,
          currentDate.getMonth(),
          currentDate.getDate()
        )
      );
      setDateDisplay(
        formatDate(
          new Date(
            currentDate.getFullYear() + 1,
            currentDate.getMonth(),
            currentDate.getDate()
          )
        )
      );
      setStartingVPower(lockAmount * 365 / 1460)
    } else if (buttonValue === 6) {
      setDate(
        new Date(
          currentDate.getFullYear() + 4,
          currentDate.getMonth(),
          currentDate.getDate()
        )
      );
      console.log("date value...", date);
      setDateDisplay(
        formatDate(
          new Date(
            currentDate.getFullYear() + 4,
            currentDate.getMonth(),
            currentDate.getDate()
          )
        )
      );
      setStartingVPower(lockAmount * 1460 / 1460)
    }
  }, [buttonValue, lockAmount]);

  return (
    <>
      {/* <div className="btnWrapper my-4 text-center d-flex justify-content-between mr-5"> */}
      <Grid container columnSpacing={1} rowSpacing={1} 
        style={{ 
          // marginTop: "5px",
          
          // fontFamily: 'Poppins',
          // fontStyle: 'normal',
          // fontWeight: '500',
          // fontSize: '12px',
          // lineHeight: '18px', 
        }} 
        >
        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
          <button
            // style={{width: '37px',
            // height: '125px'}}
            className="hoverButton"
            // sx={{fontSize:"0.6rem",minWidth:"90px"}}
            // variant="outlined"
            // size="small"
            // style={{
            //   backgroundColor: "#1976d2",
            //   color: "white",
            //   // minWidth: "75%",
            // }}
            onClick={() => {
              setbuttonValue(1);
            }}
          >
            <p style={{marginBottom:0}} className="hoverButtonText">1 week</p>
            
          </button>
        </Grid>

        {/* </div> */}

        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
          <button
            className="hoverButton"
            // sx={{fontSize:"0.6rem",minWidth:"90px"}}
            // variant="outlined"
            // size="small"
            // style={{
            //   backgroundColor: "#1976d2",
            //   color: "white",
            //   // minWidth: "75%",
            // }}
            onClick={() => {
              setbuttonValue(2);
            }}
          >
             <p style={{marginBottom:0}} className="hoverButtonText">1 month</p>
          </button>
        </Grid>
        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
          <button
            className="hoverButton"
            // sx={{fontSize:"0.6rem",minWidth:"90px"}}
            // variant="outlined"
            // size="small"
            // style={{
            //   backgroundColor: "#1976d2",
            //   color: "white",
            //   minWidth: "75%",
            // }}
            onClick={() => {
              setbuttonValue(3);
            }}
          >
             <p style={{marginBottom:0}} className="hoverButtonText">3 months</p>
          </button>
        </Grid>
        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
          <button
            className="hoverButton"
            // sx={{fontSize:"0.6rem",minWidth:"90px"}}
            // variant="outlined"
            // size="small"
            // style={{
            //   backgroundColor: "#1976d2",
            //   color: "white",
            //   minWidth: "75%",
            // }}
            onClick={() => {
              setbuttonValue(4);
            }}
          >
             <p style={{marginBottom:0}} className="hoverButtonText">6 months</p>
          </button>
        </Grid>
        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
          <button
            className="hoverButton"
            // sx={{fontSize:"0.6rem",minWidth:"90px"}}
            // variant="outlined"
            // size="small"
            // style={{
            //   backgroundColor: "#1976d2",
            //   color: "white",
            //   minWidth: "75%",
            // }}
            onClick={() => {
              setbuttonValue(5);
            }}
          >
             <p style={{marginBottom:0}} className="hoverButtonText">1 year</p>
          </button>
        </Grid>
        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
          <button
            className="hoverButton"
            // sx={{fontSize:"0.6rem",minWidth:"90px"}}
            // variant="outlined"
            // size="small"
            // style={{
            //   backgroundColor: "#1976d2",
            //   color: "white",
            //   minWidth: "75%",
            // }}
            onClick={() => {
              setbuttonValue(6);
              console.log("setbuttonValue", buttonValue);
            }}
          >
             <p style={{marginBottom:0}} className="hoverButtonText">4 years</p>
          </button>
        </Grid>
      </Grid>

      {/* </div> */}
    </>
  );
};

export default LockTimeButtons;
