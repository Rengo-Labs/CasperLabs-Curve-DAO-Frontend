// React
import React from "react";
// CUSTOM STYLING
import "../../assets/css/common.css";
import "../../assets/css/curveButton.css";
import "../../assets/css/factoryCreatePool.css";
import "../../assets/css/style.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// COMPONENTS
// MATERIAL UI
import Typography from "@mui/material/Typography";
import { FormControl, FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";

// CONTENT

// FUNCTIONAL COMPONENT
const GasPriorityFee = () => {
  // States
  // Handlers
  return (
    <>
      <div className="row no-gutters">
        <div className="col-12">
          <section className="createPoolContent createPoolform">
            <div className="row no-gutters px-0">
              <FormControl>
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  fontWeight={900}
                  sx={{
                    marginBottom: "0",
                    fontWeight: "bold",
                    color: "#9c9c9c",
                    marginTop: "2.25rem",
                  }}
                >
                  Gas Priority Fee:
                </Typography>
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
                        <TextField
                          id="filled-basic"
                          label=""
                          variant="filled"
                          name="gas-fee-radio-group"
                        />
                      </div>
                      <div className="col-4 pl-2">
                        <span
                          style={{
                            fontSize: "1rem",
                            color: "#1976d2",
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
        </div>
      </div>
    </>
  );
};

export default GasPriorityFee;
