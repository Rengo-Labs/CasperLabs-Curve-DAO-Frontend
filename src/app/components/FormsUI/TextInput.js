// REACT
import React from "react";
// CUSTOM STYLES
import "../../assets/css/TextInput.css";
// MATERIAL UI
import { TextField } from "@material-ui/core";
import { StyledEngineProvider } from "@mui/styled-engine";
// FORMIK
import { useField } from "formik";

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
