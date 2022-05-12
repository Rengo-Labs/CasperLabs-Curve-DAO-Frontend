// REACT
import React from "react";
// CUSTOM STYLING
import "../../assets/css/style.css";
import "../../assets/css/common.css";
import "../../assets/css/curveButton.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// COMPONENTS
// MATERIAL UI ICONS
import HelpIcon from "@mui/icons-material/Help";
// MATERIAL UI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormGroup,
  CardHeader,
  Avatar,
} from "@material-ui/core";
// ICONS
import USDT from "../../assets/img/usdt.png";

// CONTENT

// FUNCTIONAL COMPONENT
const Withdraw = () => {
  // States

  // Handlers
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
              <div className="row no-gutters justify-content-center">
                <div className="col-12">
                  <Typography
                    variant="h6"
                    gutterBottom
                    component="div"
                    sx={{ color: "#5300e8" }}
                  >
                    Share Of Liquidity (%)
                  </Typography>
                </div>
              </div>

              <div className="row no-gutters p-4 p-xl-3">
                <div className="col-12">
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
                        label="Liquidity Percentage"
                        variant="filled"
                        // value="0.00"
                        type={"number"}
                      />
                    </Box>
                    <div className="row no-gutters p-2">
                      <Typography variant="body1" gutterBottom color={"#000"}>
                        Liquidity %
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="row no-gutters justify-content-between w-100">
                  <div className="col-12 col-md-6 mb-3 mb-xl-2 p-4 p-xl-3">
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label={<Typography>Show Staked</Typography>}
                      />
                    </FormGroup>
                  </div>
                </div>
              </div>
              <Divider />

              {/* Currencies */}
              <div className="row no-gutters">
                <div className="px-4 px-xl-3 pb-3 pb-xl-2 mt-3 justify-content-center">
                  <div className="col-12">
                    <Typography
                      variant="h6"
                      gutterBottom
                      component="div"
                      sx={{ color: "#5300e8" }}
                    >
                      Currencies
                    </Typography>
                  </div>
                </div>
                <div className="row no-gutters p-4 p-xl-3">
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
                      </div>
                    </div>
                  </div>
                  <div className="row no-gutters justify-content-between w-100">
                    <div className="col-12 col-md-6 mb-3 mb-xl-2 p-4 p-xl-3">
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox />}
                          label={<Typography>Withdraw Wrapped CSPR</Typography>}
                        />
                      </FormGroup>
                    </div>
                  </div>
                  <div className="col-12 my-4">
                    <Divider />
                  </div>
                </div>
              </div>

              {/* Withdraw in */}
              <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2">
                <div className="col-12">
                  <Typography
                    variant="h6"
                    gutterBottom
                    component="div"
                    sx={{ color: "#5300e8" }}
                  >
                    Withdraw % in:{" "}
                    <Tooltip title="You can also withdraw in one coin by tapping in a currency field">
                      <IconButton>
                        <HelpIcon />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                </div>
                <div className="row no-gutters px-0 px-md-3 w-100">
                  <div className="col-12">
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="withdraw-percentage-token-radio-buttons-group-label"
                        defaultValue="withdraw-percentage-token"
                        name="withdraw-percentage-token-radio-group"
                      >
                        <FormControlLabel
                          value="usdt"
                          control={<Radio />}
                          label={
                            <CardHeader
                              avatar={<Avatar src={USDT} aria-label="Artist" />}
                              title={"USD Token"}
                              subheader={"USDT"}
                            />
                          }
                        />
                        <Divider />
                        <FormControlLabel
                          value="wbtc"
                          control={<Radio />}
                          label={
                            <CardHeader
                              avatar={<Avatar src={USDT} aria-label="Artist" />}
                              title={"Wrapper BTC"}
                              subheader={"wBTC"}
                            />
                          }
                        />
                        <Divider />
                        <FormControlLabel
                          value="cspr"
                          control={<Radio />}
                          label={
                            <CardHeader
                              avatar={<Avatar src={USDT} aria-label="Artist" />}
                              title={"Casper"}
                              subheader={"CSPR"}
                            />
                          }
                        />
                        <Divider />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </div>
              </div>

              {/* Gas Priority Fee */}
              <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2 ">
                <div className="col-12">
                  <section className="createPoolContent createPoolform">
                    <div className="row no-gutters justify-content-between">
                      <FormControl>
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
                </div>
              </div>
              {/* Button */}
              <div className="row no-gutters justify-content-center">
                <div className="col-12 text-center btnWrapper">
                  <button type="button">Withdraw</button>
                </div>
              </div>
            </div>
          </Paper>
        </Box>
      </div>
    </>
  );
};

export default Withdraw;
