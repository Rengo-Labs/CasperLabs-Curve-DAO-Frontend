// REACT
import React from "react";
// MATERIAL UI
import TextField from '@mui/material/TextField';
// import { createTheme, ThemeProvider,experimental_sx as sx,styled } from "@mui/material/styles";

// FORMIK
import { useField } from "formik";

const DateTimePicker = ({ name, ...otherProps }) => {
  const [field, meta] = useField(name);
  // console.log("otherProps",otherProps);
  // const color = "blue";
  // const theme = createTheme({
  //   components: {
  //     MuiIconButton: {
  //       styleOverrides: {
  //         sizeMedium: {
  //           color: "red",
  //           borderBottomColor:"#1976D2 "
  //         }
  //       }
  //     },
  //     MuiOutlinedInput: {
  //       styleOverrides: {
  //         root: {
  //           color,
  //           borderBottomColor:"#1976D2 "
  //         }
  //       }
  //     },
  //     MuiInputLabel: {
  //       styleOverrides: {
  //         root: {
  //           color,
  //           borderBottomColor:"#1976D2 "
            
  //         }
  //       }
  //     },
  //     MuiTextField: {
  //       styleOverrides: {
  //         root: sx({
  //           "& .MuiOutlinedInput-root": {
  //             "& > fieldset": {
  //               borderColor: "orange",
  //             },
  //           },
  //         }),
  //       },
  //     },
  //   }
  // });

  // const CssTextField = styled(TextField)({
  //   '& .MuiInput-underline:after': {
  //     borderBottomColor: '#1976D2',
  //   },
  //   '& .MuiOutlinedInput-root': {
  //     '& fieldset': {
  //       borderColor: '#1976D2',
  //     },
  //     '&:hover fieldset': {
  //       borderColor: '#1976D2',
  //     },
  //     '&.Mui-focused fieldset': {
  //       borderColor: '#1976D2',
  //     },
  //   },
  // });

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
  //   <ThemeProvider theme={theme}>
  // <TextField {...configDateTimePicker}/>
  // </ThemeProvider>
  // <CssTextField {...configDateTimePicker} />
  );
};

export default DateTimePicker;
