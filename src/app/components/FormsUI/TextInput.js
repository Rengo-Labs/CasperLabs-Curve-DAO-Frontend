// REACT
import React from "react";
// CUSTOM STYLES
import "../../assets/css/TextInput.css";
// MATERIAL UI
import { StyledEngineProvider } from "@mui/styled-engine";
// FORMIK
import { useField } from "formik";
import { TextField } from "@mui/material";

const TextInput = ({ name, ...otherProps }) => {
  const [field, meta] = useField(name);
  console.log("Name in text input: ", field);
  console.log("Meta in text input: ", meta);

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
