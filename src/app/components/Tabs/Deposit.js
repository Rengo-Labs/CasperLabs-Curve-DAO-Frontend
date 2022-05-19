// REACT
import React, { useState } from "react";
// CUSTOM STYLING
import "../../assets/css/style.css";
import "../../assets/css/common.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// COMPONENTS
import AdvancedOptions from "../Modals/AdvancedOptions";
// MATERIAL UI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { FormControlLabel, FormGroup } from "@material-ui/core";
import { AlertTitle } from "@mui/material";
import { Link } from "react-router-dom";

// CONTENT

// COMPONENT FUNCTION
const Deposit = () => {
  //States
  const [openAdvOptions, setOpenAdvOptions] = useState(false);

  //Handlers
  const handleOpenAdvOptions = () => setOpenAdvOptions(true);
  const handleCloseAdvOptions = () => setOpenAdvOptions(false);

  return (
    <>
      <div className="row no-gutters justify-content-center">
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Paper elevation={4}>
            <div className="py-5 px-4">
              <div className="row no-gutters">
                <div className="col-12 col-lg-4">
                  <div className="text-center">
                    <Box
                      component="form"
                      sx={{
                        "& > :not(style)": {
                          m: 1,
                          width: "25ch",
                        },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        id="deposit-usdt-currency"
                        label="USDT"
                        variant="filled"
                        // value="0.00"
                        type={"number"}
                      />
                    </Box>
                    <div className="row no-gutters justify-content-between p-2">
                      <Typography variant="body1" gutterBottom color={"#000"}>
                        USDT
                      </Typography>
                      <Typography variant="body2" gutterBottom color={"#000"}>
                        <Box
                          sx={{ cursor: "pointer" }}
                          onClick={() => {
                            alert("USDT Max");
                          }}
                        >
                          Max: 0.00
                        </Box>
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <div className="text-center">
                    <Box
                      component="form"
                      sx={{
                        "& > :not(style)": {
                          m: 1,
                          width: "25ch",
                        },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        id="deposit-wbtc-currency"
                        label="wBTC"
                        // value=
                        variant="filled"
                        type={"number"}
                      />
                    </Box>
                    <div className="row no-gutters justify-content-between p-2">
                      <Typography variant="body1" gutterBottom color={"#000"}>
                        wBTC
                      </Typography>
                      <Typography variant="body2" gutterBottom color={"#000"}>
                        <Box
                          sx={{ cursor: "pointer" }}
                          onClick={() => {
                            alert("wBTC Max");
                          }}
                        >
                          Max: 0.00
                        </Box>
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <div className="text-center">
                    <Box
                      component="form"
                      sx={{
                        "& > :not(style)": {
                          m: 1,
                          width: "25ch",
                        },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        id="deposit-cspr-currency"
                        label="CSPR"
                        // value=
                        variant="filled"
                        type={"number"}
                      />
                    </Box>
                    <div className="row no-gutters justify-content-between p-2">
                      <Typography variant="body1" gutterBottom color={"#000"}>
                        CSPR
                      </Typography>
                      <Typography variant="body2" gutterBottom color={"#000"}>
                        <Box
                          sx={{ cursor: "pointer" }}
                          onClick={() => {
                            alert("CSPR Max");
                          }}
                        >
                          Max: 11377.94166133
                        </Box>
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="col-12 my-4">
                  <Divider />
                </div>
                <div className="row no-gutters justify-content-between w-100">
                  <div className="col-12 col-md-6 mb-3 mb-xl-2">
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label={
                          <Typography sx={{ padding: "10px 0" }}>
                            Add all coins in a balanced proportion
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        control={<Checkbox />}
                        label={
                          <Typography sx={{ padding: "10px 0" }}>
                            Use maximum amount of coins available
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        control={<Checkbox />}
                        label={
                          <Typography sx={{ padding: "10px 0" }}>
                            Deposit Wrapped CSPR
                          </Typography>
                        }
                      />
                    </FormGroup>
                  </div>
                  <div className="col-12 col-md-5 mb-3 text-center text-md-right align-self-end">
                    <div className="btnWrapper">
                      <button type="button" onClick={handleOpenAdvOptions}>
                        Advanced Options
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row no-gutters w-100 mt-4">
                  <Stack sx={{ width: "100%" }} spacing={2}>
                    <Alert
                      severity="error"
                      sx={{
                        padding: "2rem 1rem",
                        fontSize: "1rem",
                      }}
                    >
                      <AlertTitle>You're depositing 0 coins.</AlertTitle>
                      Maybe you forgot to uncheck the first "Add all
                      <strong>
                        &nbsp;coins in a balanced proportion"&nbsp;
                      </strong>
                      checkbox?
                    </Alert>
                  </Stack>
                </div>
                <div className="row no-gutters text-center w-100">
                  <div className="btnWrapper col-12 col-md-6 mx-auto mt-4">
                    <button className="mr-md-2 my-3">Deposit</button>
                    <button className="ml-md-2">
                      Deposit and Stake in Gauge
                    </button>
                  </div>
                </div>
                <div className="row no-gutters w-100 mt-4">
                  <Stack
                    sx={{ width: "100%", textAlign: "center" }}
                    spacing={2}
                  >
                    <Alert
                      severity="info"
                      sx={{
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      HIGH PRICE IMPACT: 3.57%
                    </Alert>
                  </Stack>
                </div>
                <div className="row no-gutters w-100 mt-4">
                  <Stack
                    sx={{ width: "100%", textAlign: "center" }}
                    spacing={2}
                  >
                    <Alert
                      icon={false}
                      severity="warning"
                      variant="outlined"
                      sx={{
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <Link to="/risks" style={{ color: "inherit" }}>
                        Risks of using tricrypto2 pool
                      </Link>
                    </Alert>
                  </Stack>
                </div>
              </div>
            </div>
          </Paper>
        </Box>
      </div>
      <AdvancedOptions
        show={openAdvOptions}
        handleClose={handleCloseAdvOptions}
      />
    </>
  );
};

export default Deposit;
