import { Button, Grid } from "@mui/material";
import { useField, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/SelectInput.css";
import "../../assets/css/ThemeHoverButton.css";

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
  const { setFieldValue } = useFormikContext() ?? {};
  const [field, meta] = useField(name);
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
      <Grid container columnSpacing={1} rowSpacing={1} 
        style={{ 
        }} 
        >
        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
          <button

            className="hoverButton"
            onClick={() => {
              setbuttonValue(1);
            }}
          >
            <p style={{marginBottom:0}} className="hoverButtonText">1 week</p>
            
          </button>
        </Grid>
        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
          <button
            className="hoverButton"
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
            onClick={() => {
              setbuttonValue(6);
              console.log("setbuttonValue", buttonValue);
            }}
          >
             <p style={{marginBottom:0}} className="hoverButtonText">4 years</p>
          </button>
        </Grid>
      </Grid>
    </>
  );
};

export default LockTimeButtons;
