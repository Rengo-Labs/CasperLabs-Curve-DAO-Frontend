import TextField from '@mui/material/TextField';
import { useField } from "formik";
import React from "react";

const DateTimePicker = ({ name, ...otherProps }) => {
  const [field, meta] = useField(name);
  const configDateTimePicker = {
    ...field,
    ...otherProps,
    type: "date",
    variant: "filled",
    fullWidth: true,
    InputLabelProps: {
      shrink: true,
    },
  };

  if (meta && meta.touched && meta.error) {
    configDateTimePicker.error = true;
    configDateTimePicker.helperText = meta.error;
  }

  return( 
    <TextField {...configDateTimePicker}/>
  );
};

export default DateTimePicker;
