//REACT
import React, { useState } from "react";
//CUSTOM STYLING
import "../../assets/css/style.css";
import "../../assets/css/curveButton.css";
import "../../assets/css/common.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
//MATERIAL UI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  FormGroup,
} from "@material-ui/core";
//MATERIAL UI ICONS
import CloseIcon from "@mui/icons-material/Close";

//CONTENT
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "38.5rem",
  bgcolor: "background.paper",
  border: "1px solid #9E9E9E",
  boxShadow: 24,
  p: "1.5rem",
};

//COMPONENT FUNCTION
const AdvancedOptions = (props) => {
  return (
    <>
      <Modal
        aria-labelledby="advancedOptions"
        aria-describedby="advancedOptions-options"
        open={props.show}
        onClose={props.close}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.show}>
          <Box sx={style}>
            <div className="row no-gutters justify-content-between">
              <Typography id="advancedOptions" variant="h6" component="h2">
                Advanced Options
              </Typography>
              <div
                style={{
                  // border: "1px solid black",
                  padding: "5px",
                  cursor: "pointer",
                }}
                onClick={props.close}
              >
                <CloseIcon />
              </div>
            </div>
            <Typography id="advancedOptions-options" sx={{ mt: 2 }}>
              {/* Max Slippage */}
              <section className="createPoolContent createPoolform mb-1">
                <div className="row no-gutters justify-content-between px-0">
                  <FormControl>
                    {/* <FormLabel id="assets-type-radio-buttons-group-label">
                              Gender
                            </FormLabel> */}
                    <p
                      style={{
                        marginBottom: "0",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        color: "#9c9c9c",
                        paddingLeft: "0.9rem",
                        marginTop: "1.5rem",
                      }}
                    >
                      Max Slippage:
                    </p>
                    <RadioGroup
                      row
                      aria-labelledby="max-slippage-radio-buttons-group-label"
                      defaultValue="max-slippage"
                      name="max-slippage-radio-group"
                    >
                      <FormControlLabel
                        value="0.5%"
                        control={<Radio />}
                        label="0.5%"
                      />
                      <FormControlLabel
                        value="1%"
                        control={<Radio />}
                        label="1%"
                      />
                      <label for="customMaxSlippage">
                        <div className="row no-gutters justify-content-center align-items-center">
                          <div className="col-2 text-center">
                            <FormControlLabel
                              value="custom slippage"
                              control={<Radio />}
                              label=""
                            />
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              name="max-slippage-radio-group"
                              id="customMaxSlippage"
                            />
                          </div>
                          <div className="col-4 pl-2">
                            <span
                              style={{
                                fontSize: "1rem",
                                color: "#5300E8",
                                fontWeight: "bold",
                              }}
                            >
                              %
                            </span>
                          </div>
                        </div>
                      </label>
                    </RadioGroup>
                  </FormControl>
                </div>
              </section>
              {/* Gas Priority Fee */}
              <section className="createPoolContent createPoolform">
                <div className="row no-gutters justify-content-between px-0">
                  <FormControl>
                    {/* <FormLabel id="assets-type-radio-buttons-group-label">
                              Gender
                            </FormLabel> */}
                    <p
                      style={{
                        marginBottom: "0",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        color: "#9c9c9c",
                        paddingLeft: "0.9rem",
                        marginTop: "1.5rem",
                      }}
                    >
                      Gas Priority Fee:
                    </p>
                    <RadioGroup
                      row
                      aria-labelledby="gas-fee-radio-buttons-group-label"
                      defaultValue="gas-fee"
                      name="gas-fee-radio-group"
                    >
                      <FormControlLabel
                        value="standard fee"
                        control={<Radio />}
                        label="Standard"
                      />
                      <FormControlLabel
                        value="fast"
                        control={<Radio />}
                        label="Fast"
                      />
                      <FormControlLabel
                        value="instant"
                        control={<Radio />}
                        label="Instant"
                      />
                      <label for="customGas">
                        <div className="row no-gutters justify-content-center align-items-center">
                          <div className="col-2 text-center">
                            <FormControlLabel
                              value="custom"
                              control={<Radio />}
                              label=""
                            />
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              name="gas-fee-radio-group"
                              id="gasPriorityFee"
                            />
                          </div>
                          <div className="col-4 pl-2">
                            <span
                              style={{
                                fontSize: "1rem",
                                color: "#5300E8",
                                fontWeight: "bold",
                              }}
                            >
                              Slow
                            </span>
                          </div>
                        </div>
                      </label>
                    </RadioGroup>
                  </FormControl>
                </div>
              </section>
            </Typography>
            <div className="row no-gutters justify-content-center btnWrapper">
              <button onClick={props.close}>Close</button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default AdvancedOptions;
