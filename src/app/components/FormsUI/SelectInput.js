// REACT
import React from "react";
// CUSTOM STYLING
import "../../assets/css/SelectInput.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// MATERIAL UI
import { TextField, MenuItem, Avatar } from "@material-ui/core";
import { StyledEngineProvider } from "@mui/styled-engine";
// FORMIK
import { useField, useFormikContext } from "formik";

const SelectInput = ({ name, options, avatar, ...otherProps }) => {
  //console.log("raw data: ", options.dai[1]);
  console.log("values: ", options);
  // States
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  // Handlers
  const handleChange = (evt) => {
    const { value } = evt.target;
    setFieldValue(name, value);
  };

  const configSelect = {
    ...field,
    ...otherProps,
    select: true,
    variant: "filled",
    fullWidth: true,
    onchange: handleChange,
  };

  if (meta && meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }

  return (
    <>
      <TextField {...configSelect}>
        {options.map((item, index) => {
          return (
            <MenuItem key={index} value={item.name}>
              <div className="row no-gutters align-items-center selectInputAvatar">
                {item.icon && (
                  <StyledEngineProvider>
                    <Avatar
                      src={item.icon}
                      aria-label="itemIcon"
                      alt="Item Icon"
                    />
                    &nbsp;
                  </StyledEngineProvider>
                )}
                <span>{item.name}</span>
              </div>
            </MenuItem>
          );
        })}
      </TextField>
    </>
  );
};

export default SelectInput;
