// //REACT
// import React, { useState } from "react";
// //CUSTOM STYLING
// import "../../assets/css/style.css";
// import "../../assets/css/curveButton.css";
// import "../../assets/css/common.css";
// // BOOTSTRAP
// import "../../assets/css/bootstrap.min.css";
// //MATERIAL UI
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Tooltip from "@mui/material/Tooltip";
// import IconButton from "@mui/material/IconButton";
// import TextField from "@mui/material/TextField";
// import Modal from "@mui/material/Modal";
// import Fade from "@mui/material/Fade";
// import Backdrop from "@mui/material/Backdrop";
// import Button from "@mui/material/Button";
// import {
//   FormControl,
//   FormControlLabel,
//   FormLabel,
//   Radio,
//   RadioGroup,
//   FormGroup,
// } from "@material-ui/core";
// //MATERIAL UI ICONS
// import CloseIcon from "@mui/icons-material/Close";

// //CONTENT
// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "38.5rem",
//   bgcolor: "background.paper",
//   border: "1px solid #9E9E9E",
//   boxShadow: 24,
//   p: "1.5rem",
// };

// //COMPONENT FUNCTION
// const AdvancedOptions = (props) => {
//   return (
//     <>
//       <Modal
//         aria-labelledby="advancedOptions"
//         aria-describedby="advancedOptions-options"
//         open={props.show}
//         onClose={props.handleClose}
//         closeAfterTransition
//         BackdropComponent={Backdrop}
//         BackdropProps={{
//           timeout: 500,
//         }}
//       >
//         <Fade in={props.show}>
//           <Box sx={style}>
//             <div className="row no-gutters justify-content-between">
//               <Typography id="advancedOptions" variant="h6" component="h2">
//                 Advanced Options
//               </Typography>
//               <div
//                 style={{
//                   // border: "1px solid black",
//                   padding: "5px",
//                   cursor: "pointer",
//                 }}
//                 onClick={props.handleClose}
//               >
//                 <CloseIcon />
//               </div>
//             </div>
//             <Typography id="advancedOptions-options" sx={{ mt: 2 }}>
//               {/* Max Slippage */}
//               <section className="createPoolContent createPoolform mb-1">
//                 <div className="row no-gutters justify-content-between px-0">
//                   <FormControl>
//                     {/* <FormLabel id="assets-type-radio-buttons-group-label">
//                               Gender
//                             </FormLabel> */}
//                     <p
//                       style={{
//                         marginBottom: "0",
//                         fontSize: "0.75rem",
//                         fontWeight: "bold",
//                         color: "#9c9c9c",
//                         paddingLeft: "0.9rem",
//                         marginTop: "1.5rem",
//                       }}
//                     >
//                       Max Slippage:
//                     </p>
//                     <RadioGroup
//                       row
//                       aria-labelledby="max-slippage-radio-buttons-group-label"
//                       defaultValue="max-slippage"
//                       name="max-slippage-radio-group"
//                     >
//                       <FormControlLabel
//                         value="0.5%"
//                         control={<Radio />}
//                         label="0.5%"
//                       />
//                       <FormControlLabel
//                         value="1%"
//                         control={<Radio />}
//                         label="1%"
//                       />
//                       <label for="customMaxSlippage">
//                         <div className="row no-gutters justify-content-center align-items-center">
//                           <div className="col-2 text-center">
//                             <FormControlLabel
//                               value="custom slippage"
//                               control={<Radio />}
//                               label=""
//                             />
//                           </div>
//                           <div className="col-6">
//                             <input
//                               type="text"
//                               name="max-slippage-radio-group"
//                               id="customMaxSlippage"
//                             />
//                           </div>
//                           <div className="col-4 pl-2">
//                             <span
//                               style={{
//                                 fontSize: "1rem",
//                                 color: "#5300E8",
//                                 fontWeight: "bold",
//                               }}
//                             >
//                               %
//                             </span>
//                           </div>
//                         </div>
//                       </label>
//                     </RadioGroup>
//                   </FormControl>
//                 </div>
//               </section>
//               {/* Gas Priority Fee */}
//               <section className="createPoolContent createPoolform">
//                 <div className="row no-gutters justify-content-between px-0">
//                   <FormControl>
//                     {/* <FormLabel id="assets-type-radio-buttons-group-label">
//                               Gender
//                             </FormLabel> */}
//                     <p
//                       style={{
//                         marginBottom: "0",
//                         fontSize: "0.75rem",
//                         fontWeight: "bold",
//                         color: "#9c9c9c",
//                         paddingLeft: "0.9rem",
//                         marginTop: "1.5rem",
//                       }}
//                     >
//                       Gas Priority Fee:
//                     </p>
//                     <RadioGroup
//                       row
//                       aria-labelledby="gas-fee-radio-buttons-group-label"
//                       defaultValue="gas-fee"
//                       name="gas-fee-radio-group"
//                     >
//                       <FormControlLabel
//                         value="standard fee"
//                         control={<Radio />}
//                         label="Standard"
//                       />
//                       <FormControlLabel
//                         value="fast"
//                         control={<Radio />}
//                         label="Fast"
//                       />
//                       <FormControlLabel
//                         value="instant"
//                         control={<Radio />}
//                         label="Instant"
//                       />
//                       <label for="customGas">
//                         <div className="row no-gutters justify-content-center align-items-center">
//                           <div className="col-2 text-center">
//                             <FormControlLabel
//                               value="custom"
//                               control={<Radio />}
//                               label=""
//                             />
//                           </div>
//                           <div className="col-6">
//                             <input
//                               type="text"
//                               name="gas-fee-radio-group"
//                               id="gasPriorityFee"
//                             />
//                           </div>
//                           <div className="col-4 pl-2">
//                             <span
//                               style={{
//                                 fontSize: "1rem",
//                                 color: "#5300E8",
//                                 fontWeight: "bold",
//                               }}
//                             >
//                               Slow
//                             </span>
//                           </div>
//                         </div>
//                       </label>
//                     </RadioGroup>
//                   </FormControl>
//                 </div>
//               </section>
//             </Typography>
//             <div className="row no-gutters justify-content-center btnWrapper">
//               <button onClick={props.handleClose}>Close</button>
//             </div>
//           </Box>
//         </Fade>
//       </Modal>
//     </>
//   );
// };

// export default AdvancedOptions;



import { Avatar, Card, CardHeader, Typography } from "@material-ui/core";
import React from "react";
import { Modal } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import Casper from "../../assets/img/cspr.png";
import Torus from "../../assets/img/torus.png";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
import Exit from "../../assets/img/exit.svg";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';


function AdvancedOptions(props) {
  const [value, setValue] = React.useState('');

  const handleChange = (prop) => (event) => {
    setValue(event.target.value);
  };
  // console.log("props", props);
  return (
    <Modal size="lg" centered show={props.show} onHide={props.handleClose}>
      {/* <Modal.Header style={{ textAlign: 'center' }}>
      </Modal.Header> */}
      <Modal.Body style={{ textAlign: 'center' }} >
        <Typography variant="h5" style={{ color: '#000027' }} gutterBottom >
          <strong>
            Advanced Options
            <span
              onClick={props.handleClose}
              style={{
                float: "right",
                cursor: "pointer",
              }}
            >
              <img
                src={Exit}
                alt="exit"
                width="15"
              />
            </span>
          </strong>
        </Typography>

      </Modal.Body>
      <Modal.Body>
        <div className="container">
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Max Slippage:</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue=".5"
              name="radio-buttons-group"
            >

              <FormControlLabel value=".5" control={<Radio />} label=".5%" />
              <FormControlLabel value="1" control={<Radio />} label="1%" />
              <FormControlLabel value="end" control={<Radio />} label={<FormControl fullWidth sx={{ m: 1 }} variant="filled">
                <FilledInput
                  id="filled-adornment-weight"
                  value={value}
                  onChange={handleChange}
                  endAdornment={<InputAdornment position="end">%</InputAdornment>}
                  aria-describedby="filled-weight-helper-text"
                  inputProps={{
                    'aria-label': 'percentage',
                  }}
                />
                <FormHelperText id="filled-weight-helper-text">Percentage</FormHelperText>
              </FormControl>} />

            </RadioGroup>
          </FormControl>
          <hr></hr>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Gas Priority Fee:</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="standard"
              name="radio-buttons-group"
            >
              <FormControlLabel value="standard" control={<Radio />} label="Standard" />
              <FormControlLabel value="fast" control={<Radio />} label="Fast" />
              <FormControlLabel value="instant" control={<Radio />} label="Instant" />
              <FormControlLabel value="slow" control={<Radio />} label={<FormControl fullWidth sx={{ m: 1 }} variant="filled">
                <FilledInput
                  id="filled-adornment-weight"
                  value={value}
                  onChange={handleChange}
                  // endAdornment={<InputAdornment position="end"></InputAdornment>}
                  aria-describedby="filled-weight-helper-text"
                  inputProps={{
                    'aria-label': 'Slow',
                  }}
                />
                <FormHelperText id="filled-weight-helper-text">Slow</FormHelperText>
              </FormControl>} />
            </RadioGroup>
          </FormControl>
        </div>
        {/* <Card
          onClick={() => {
            props.torusLogin();
            props.setSelectedWallet("Torus");
            localStorage.setItem("selectedWallet", "Torus");
          }}
          className="custom-card"
          style={{ borderRadius: "8px"}}
        >
          <CardHeader
            avatar={<Avatar src={Torus} aria-label="Torus Wallet" />}
            title="Torus Wallet"
            subheader="Connect to Torus Waller"
          />
        </Card>
        <hr></hr>
        <Card
          onClick={() => {
            props.casperLogin();
            localStorage.setItem("selectedWallet", "Casper");
            props.setSelectedWallet("Casper");
          }}
          className="custom-card"
          style={{ borderRadius: "8px" }}
        >
          <CardHeader
            avatar={<Avatar src={Casper} aria-label="Casper Signer" />}
            title="Casper Signer"
            subheader="Connect to Casper Signer"
          />
        </Card> */}
      </Modal.Body>
      <Modal.Footer>
        <div className="row no-gutters justify-content-center btnWrapper">
          <button onClick={props.handleClose}>Close</button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default AdvancedOptions;
