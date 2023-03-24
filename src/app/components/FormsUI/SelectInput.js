import React, { useState } from "react";
import "../../assets/css/SelectInput.css";
import "../../assets/css/bootstrap.min.css";
import { StyledEngineProvider } from "@mui/styled-engine";
import { useField, useFormikContext } from "formik";
import { Avatar, MenuItem, TextField } from "@mui/material";

const SelectInput = ({
  icon,
  setDate,
  setDateDisplay,
  name,
  options,
  avatar,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext() ?? {};
  const [field, meta] = useField(name);
  const [currentDate, setCurrentDate] = useState(new Date());

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
  const handleChange = (evt) => {
    const { value } = evt.target;
    console.log("evt.target", evt.target);
    console.log("currentDate", currentDate);
    if (evt.target.value == "1 Week") {
      console.log("evt.target", evt.target.value);
      console.log(
        "currentDate.getTime()",
        formatDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))
      );
      console.log("date", currentDate.getDate() + 7);
      setDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
      setDateDisplay(
        formatDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))
      );
    } else if (evt.target.value == "1 Month") {
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
    } else if (evt.target.value == "3 Months") {
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
    } else if (evt.target.value == "6 Months") {
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
    } else if (evt.target.value == "1 Year") {
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
    } else if (evt.target.value == "4 Years") {
      setDate(
        new Date(
          currentDate.getFullYear() + 4,
          currentDate.getMonth(),
          currentDate.getDate()
        )
      );
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
    setFieldValue(name, value);
  };

  const configSelect = {
    ...field,
    ...otherProps,
    select: true,
    variant: "filled",
    fullWidth: true,
    onChange: handleChange,
  };

  if (meta && meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }

  return (
    <>
      <TextField {...configSelect}>
        {options.map((item, index) => {
          console.log("options mapped:", item, index);
          return (
            <MenuItem key={index} value={item}>
              <div className="row no-gutters align-items-center selectInputAvatar">
                {icon && (
                  <>
                    <StyledEngineProvider>
                      <Avatar
                        src={icon[index]}
                        aria-label="itemIcon"
                        alt="Item Icon"
                      />
                      &nbsp;
                    </StyledEngineProvider>
                  </>
                )}
                <span>{item}</span>
              </div>
            </MenuItem>
          );
        })}
      </TextField>
    </>
  );
};

export default SelectInput;
