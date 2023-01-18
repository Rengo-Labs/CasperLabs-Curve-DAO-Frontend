// REACT
import React, { useState,useEffect } from "react";
// CUSTOM STYLING
import "../../assets/css/SelectInput.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// MATERIAL UI
import { StyledEngineProvider } from "@mui/styled-engine";
// FORMIK
import { useField, useFormikContext } from "formik";
import { Avatar, MenuItem, TextField,Button } from "@mui/material";

const LockTimeButtons = ({
  icon,
  setDate,
  setDateDisplay,
  name,
  options,
  avatar,
  date,
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

useEffect(()=>{
    if (buttonValue ===1) {
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
        } else if (buttonValue===2) {
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
        } else if (buttonValue===3) {
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
        } else if (buttonValue===4) {
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
        } else if (buttonValue===5) {
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
        } else if (buttonValue===6) {
          setDate(
            new Date(
              currentDate.getFullYear() + 4,
              currentDate.getMonth(),
              currentDate.getDate()
            )
          );
          console.log("date value...",date);
          setDateDisplay(
            formatDate(
              new Date(
                currentDate.getFullYear() + 4,
                currentDate.getMonth(),
                currentDate.getDate()
              )
            )
          );
        }
},[buttonValue])

  return (
    <>
          <div className="btnWrapper my-4 text-center d-flex justify-content-between mr-5">
                          <Button
                            variant="contained"
                            size="large"
                            style={{ backgroundColor: "#5300e8", color: "white" }}
                            onClick={() => {
                                setbuttonValue(1)
                            }}
                          >
                            1 week
                          </Button>
                          <Button
                            variant="contained"
                            size="large"
                            style={{ backgroundColor: "#5300e8", color: "white" }}
                            onClick={() => {
                                setbuttonValue(2)
                            }}
                          >
                            1 month
                          </Button>
                          <Button
                            variant="contained"
                            size="large"
                            style={{ backgroundColor: "#5300e8", color: "white" }}
                            onClick={() => {
                                setbuttonValue(3)
                            }}
                          >
                            3 months
                          </Button>
                          <Button
                            variant="contained"
                            size="large"
                            style={{ backgroundColor: "#5300e8", color: "white" }}
                            onClick={() => {
                                setbuttonValue(4)
                            }}
                          >
                            6 months
                          </Button>
                          <Button
                            variant="contained"
                            size="large"
                            style={{ backgroundColor: "#5300e8", color: "white" }}
                            onClick={() => {
                                setbuttonValue(5)
                            }}
                          >
                            1 year
                          </Button>
                          <Button
                            variant="contained"
                            size="large"
                            style={{ backgroundColor: "#5300e8", color: "white" }}
                            onClick={() => {
                                setbuttonValue(6)
                                console.log("setbuttonValue",buttonValue);
                            }}
                          >
                            4 years
                          </Button>
                      </div>
    
    </>
  );
};

export default LockTimeButtons;
