// REACT
import React, { useState } from "react";
// CUSTOM STYLING
import "../../../../assets/css/style.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/common.css";
// BOOTSTRAP
import "../../../../assets/css/bootstrap.min.css";
// COMPONENTS
import HeaderDAO from "../../../../components/Headers/HeaderDAO";
import HomeBanner from "../Home/HomeBanner";
// MATERIAL UI
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";

// CONTENT

// COMPONENT FUNCTION
const Calc = () => {
  // States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();
  const [boostGauge, setBoostGauge] = useState();
  const [gaugeDeposits, setGaugeDeposits] = useState(0);
  // always provide gaugeDeposits as a number or convert it into a number
  const [poolLiquidity, setPoolLiquidity] = useState(0);
  const [gaugeCRV, setGaugeCRV] = useState("0.00");
  const [gaugeVeCRV, setGaugeVeCRV] = useState(false);
  const [gaugeLock, setGaugeLock] = useState(1 + " Year");
  const [lockedVeCRV, setLockedVeCRV] = useState("0.00");
  const [totalVeCRV, setTotalVeCRV] = useState("452142663.71");
  const [crvBoost, setCrvBoost] = useState("1.00");
  const [maxPossibleBoost, setMaxPossibleBoost] = useState();
  const [minVeCRVForBoost, setMinVeCRVForBoost] = useState(2);
  const [depositForBoost, setDepositForBoost] = useState(10);
  const [maxDepositPerVeCRV, setMaxDepositPerVeCRV] = useState();

  // Content
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  // Handlers
  const handleGaugeChange = (event) => {
    setBoostGauge(event.target.value);
  };

  const handleVeCRVSelect = () => {
    setGaugeVeCRV(true);
  };

  const handleCRVSelect = () => {
    setGaugeVeCRV(false);
  };

  const handleGaugeLockChange = (event) => {
    setGaugeLock(event.target.value);
  };

  return (
    <>
      <div className="home-section home-full-height">
        <HeaderDAO
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          setTorus={setTorus}
          selectedNav={"Calc"}
        />
        <div
          className="content"
          style={{ paddingTop: "100px" }}
          position="absolute"
        >
          <HomeBanner />
        </div>
        {/* Main Content */}
        <div className="container-fluid">
          <div className="curve-container">
            <div className="curve-content-banks">
              <fieldset>
                <div className="row no-gutters justify-content-center">
                  <div className="curve-content-wrapper mui-form-width col-12 col-lg-12 col-xl-6">
                    <div className="row no-gutters justify-content-center">
                      {/* Voting Power */}
                      <Box
                        sx={{
                          width: "100%",
                        }}
                        className="mt-4"
                      >
                        <Paper elevation={4}>
                          <div className="py-5 px-4">
                            {/* Heading */}
                            <div className="row no-gutters">
                              <div className="col-12 text-center py-3">
                                <Typography
                                  variant="h4"
                                  gutterBottom
                                  component="div"
                                >
                                  <span className="font-weight-bold">
                                    Gauge Boost Calculator
                                  </span>
                                </Typography>
                              </div>
                            </div>
                            {/* Gauge Selector & Deposit */}
                            <div className="row no-gutters">
                              {/* Gauge Selector */}
                              <div className="col-12 col-md-6">
                                <FormControl
                                  variant="filled"
                                  sx={{ m: 1, minWidth: 120 }}
                                >
                                  <InputLabel id="select-gauge-label">
                                    Select a Gauge
                                  </InputLabel>
                                  <Select
                                    labelId="select-gauge-label"
                                    id="gauge-select"
                                    value={boostGauge}
                                    onChange={handleGaugeChange}
                                  >
                                    <MenuItem value="Select a Gauge">
                                      <em>Select a Gauge</em>
                                    </MenuItem>
                                    <MenuItem value={"USDT"}>USDT</MenuItem>
                                    <MenuItem value={"BTC"}>BTC</MenuItem>
                                    <MenuItem value={"CSPR"}>CSPR</MenuItem>
                                  </Select>
                                </FormControl>
                              </div>
                              {/* Deposit */}
                              <div className="col-12 col-md-6 mt-3 mt-md-0">
                                <Box
                                  component="form"
                                  noValidate
                                  autoComplete="off"
                                >
                                  <TextField
                                    id="calc-deposits"
                                    label="Deposit:"
                                    variant="filled"
                                    value={gaugeDeposits}
                                  />
                                </Box>
                                <div className="row no-gutters">
                                  <div className="col-12">
                                    <FormGroup>
                                      <FormControlLabel
                                        control={<Checkbox />}
                                        label="Use Existing Deposit"
                                      />
                                    </FormGroup>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Pool Liquidity & CRV */}
                            <div className="row no-gutters mt-3">
                              {/* Pool Liquidity */}
                              <div className="col-12 col-md-6">
                                <Box
                                  component="form"
                                  noValidate
                                  autoComplete="off"
                                >
                                  <TextField
                                    id="pool-liquidity"
                                    label="Pool Liquidity:"
                                    variant="filled"
                                    value={poolLiquidity}
                                  />
                                </Box>
                              </div>
                              {/* CRV */}
                              <div className="col-12 col-md-6 mt-3 mt-md-0">
                                <Box
                                  component="form"
                                  noValidate
                                  autoComplete="off"
                                >
                                  <TextField
                                    id="my-crv"
                                    label="My CRV:"
                                    variant="filled"
                                    value={gaugeCRV}
                                  />
                                </Box>
                                <div className="col-12">
                                  <FormControl>
                                    {/* <FormLabel id="gauge-crv-radio">Gender</FormLabel> */}
                                    <RadioGroup
                                      row
                                      aria-labelledby="gauge-crv-radio"
                                      name="crv-vecrv"
                                    >
                                      <FormControlLabel
                                        value="crv"
                                        control={<Radio />}
                                        label="CRV"
                                        onChange={handleCRVSelect}
                                      />
                                      <FormControlLabel
                                        value="cecrv"
                                        control={<Radio />}
                                        label="veCRV"
                                        onChange={handleVeCRVSelect}
                                      />
                                    </RadioGroup>
                                  </FormControl>
                                </div>
                              </div>
                              {gaugeVeCRV ? (
                                <div className="row no-gutters mt-2 w-100">
                                  <div className="col-12">
                                    <div className="row no-gutters justify-content-md-end">
                                      <div className="col-12 col-md-6">
                                        <FormControl
                                          variant="filled"
                                          sx={{ m: 1, minWidth: 120 }}
                                        >
                                          <InputLabel id="gauge-lock-period">
                                            Select a Gauge
                                          </InputLabel>
                                          <Select
                                            labelId="gauge-lock-period"
                                            id="lock-period"
                                            value={gaugeLock}
                                            onChange={handleGaugeLockChange}
                                          >
                                            <MenuItem value={1 + " Week"}>
                                              1 Week
                                            </MenuItem>
                                            <MenuItem value={1 + " Month"}>
                                              1 Month
                                            </MenuItem>
                                            <MenuItem value={6 + " Months"}>
                                              6 Months
                                            </MenuItem>
                                            <MenuItem value={1 + " Year"}>
                                              1 Year
                                            </MenuItem>
                                            <MenuItem value={2 + " Years"}>
                                              2 Years
                                            </MenuItem>
                                            <MenuItem value={3 + " Years"}>
                                              3 Years
                                            </MenuItem>
                                            <MenuItem value={4 + " Years"}>
                                              4 Years
                                            </MenuItem>
                                          </Select>
                                        </FormControl>
                                      </div>
                                    </div>
                                    <div className="row no-gutters justify-content-end">
                                      <div className="col-12 col-md-6 text-right align-self-center p-2 py-3">
                                        <Typography
                                          variant="body1"
                                          component={"div"}
                                        >
                                          <span className="font-weight-bold">
                                            {lockedVeCRV}&nbsp;
                                          </span>
                                          veCRV
                                        </Typography>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                            {/* Total veCRV */}
                            <div className="row no-gutters mt-3 align-items-center">
                              <div className="col-12 col-md-6">
                                <Box
                                  component="form"
                                  noValidate
                                  autoComplete="off"
                                >
                                  <TextField
                                    id="total-vecrv"
                                    label="Total veCRV:"
                                    variant="filled"
                                    value={totalVeCRV}
                                  />
                                </Box>
                                <div className="row no-gutters">
                                  <div className="col-12 text-right p-2 py-3">
                                    <Typography
                                      variant="body1"
                                      component={"div"}
                                    >
                                      <span className="font-weight-bold">
                                        Boost:&nbsp;
                                      </span>
                                      {crvBoost}x
                                    </Typography>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-md-6 text-center text-md-left mt-2 align-self-start">
                                <div className="btnWrapper">
                                  <button>Calculate</button>
                                </div>
                              </div>
                            </div>
                            {/* Boost Requirements */}
                            <div className="row no-gutters mt-3">
                              <div className="col-12 col-md-6">
                                <List>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Max boost possible:&nbsp;
                                      </span>
                                      {maxPossibleBoost}x
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Min veCRV for max boost:&nbsp;
                                      </span>
                                      {gaugeDeposits > 0 &&
                                      gaugeDeposits !== "" &&
                                      gaugeDeposits !== null
                                        ? minVeCRVForBoost
                                        : "Please enter a deposit amount"}
                                    </ListItemText>
                                  </ListItem>
                                </List>
                              </div>
                            </div>
                            <div className="w-100 my-4 pt-4">
                              <Divider />
                            </div>
                            {/* Gauge Selection Info Heading*/}
                            <div className="row no-gutters mt-4">
                              <div className="col-12 text-center py-3">
                                <Typography
                                  variant="h4"
                                  gutterBottom
                                  component="div"
                                >
                                  <span className="font-weight-bold">
                                    Gauge Selection Info
                                  </span>
                                </Typography>
                              </div>
                            </div>
                            {/* Gauge Selection Info */}
                            <div className="row no-gutters mt-3">
                              <div className="col-12 col-md-6">
                                <List>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Max deposite to have boost:&nbsp;
                                      </span>
                                      {depositForBoost ? (
                                        depositForBoost
                                      ) : (
                                        <CircularProgress size={20} />
                                      )}
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Max deposit per veCRV to have max
                                        boost:&nbsp;
                                      </span>
                                      {maxDepositPerVeCRV ? (
                                        maxDepositPerVeCRV
                                      ) : (
                                        <CircularProgress size={20} />
                                      )}
                                    </ListItemText>
                                  </ListItem>
                                </List>
                              </div>
                            </div>
                          </div>
                        </Paper>
                      </Box>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calc;
