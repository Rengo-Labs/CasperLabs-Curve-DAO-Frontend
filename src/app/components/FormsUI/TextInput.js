import { TextField } from "@mui/material";
import { StyledEngineProvider } from "@mui/styled-engine";
import { useField } from "formik";
import React from "react";
import "../../assets/css/TextInput.css";

const TextInput = ({ name, ...otherProps }) => {
  const [field, meta] = useField(name);

  const configTextField = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: "filled",
  };

  if (meta && meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  }

  return (
    <>
      <StyledEngineProvider injectFirst>
        <div className="textFieldWrapper">
          <TextField {...configTextField} />
        </div>
      </StyledEngineProvider>
    </>
  );
};

export default TextInput;
