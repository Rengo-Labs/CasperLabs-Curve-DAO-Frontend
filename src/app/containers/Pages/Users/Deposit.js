//REACT
import React, { useState } from "react";
// CUSTOME STYLING
import "../../../assets/css/style.css";
import "../../../assets/css/curveButton.css";
import "../../../assets/css/common.css";
// BOOTSTRAP
import "../../../assets/css/bootstrap.min.css";
//COMPONENTS
import HeaderHome from "../../../components/Headers/Header";
import HomeBanner from "./Home/HomeBanner";
import AdvancedOptions from "../../../components/Modals/AdvancedOptions";
//MATERIAL UI ICONS
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import CloseIcon from "@mui/icons-material/Close";
import HelpIcon from "@mui/icons-material/Help";
//MATERIAL UI
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  FormGroup,
} from "@material-ui/core";
import { StyledEngineProvider } from "@mui/styled-engine";
import { AlertTitle } from "@mui/material";
import { Link } from "react-router-dom";

//CONTENT

//COMPONENT FUNCTION
const Deposit = () => {
  //States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();
  const [openAdvOptions, setOpenAdvOptions] = useState(false);

  //Handlers
  const handleOpenAdvOptions = () => setOpenAdvOptions(true);
  const handleCloseAdvOptions = () => setOpenAdvOptions(false);

  return (
    <>
      <div className="home-section home-full-height">
        <HeaderHome
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          setTorus={setTorus}
          selectedNav={"Deposit"}
        />
        <div
          className="content"
          style={{ paddingTop: "100px" }}
          position="absolute"
        >
          <HomeBanner />
        </div>
        <div className="container-fluid">
          <div className="curve-container">
            <div className="curve-content-banks">
              <fieldset>
                <legend>Currencies</legend>
                <div className="row no-gutters justify-content-center">
                  <div className="curve-content-wrapper mui-form-width col-12 col-lg-12 col-xl-6">
                    <div className="row no-gutters justify-content-center">
                      <Box
                        sx={{
                          width: "100%",
                        }}
                      >
                        <Paper elevation={4}>
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
                                  <Typography
                                    variant="body1"
                                    gutterBottom
                                    color={"#000"}
                                  >
                                    USDT
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    gutterBottom
                                    color={"#000"}
                                  >
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
                                  <Typography
                                    variant="body1"
                                    gutterBottom
                                    color={"#000"}
                                  >
                                    wBTC
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    gutterBottom
                                    color={"#000"}
                                  >
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
                                  <Typography
                                    variant="body1"
                                    gutterBottom
                                    color={"#000"}
                                  >
                                    CSPR
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    gutterBottom
                                    color={"#000"}
                                  >
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
                                      <Typography>
                                        Add all coins in a balanced proportion
                                      </Typography>
                                    }
                                  />
                                  <FormControlLabel
                                    control={<Checkbox />}
                                    label={
                                      <Typography>
                                        Use maximum amount of coins available
                                      </Typography>
                                    }
                                  />
                                  <FormControlLabel
                                    control={<Checkbox />}
                                    label={
                                      <Typography>
                                        Deposit Wrapped CSPR
                                      </Typography>
                                    }
                                  />
                                </FormGroup>
                              </div>
                              <div className="col-12 col-md-5 mb-3 text-center text-md-right align-self-end">
                                <div className="btnWrapper">
                                  <button
                                    type="button"
                                    onClick={handleOpenAdvOptions}
                                  >
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
                                  <AlertTitle>
                                    You're depositing 0 coins.
                                  </AlertTitle>
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
                                <button className="mr-md-2 my-3">
                                  Deposit
                                </button>
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
                                  <Link
                                    to="/risks"
                                    style={{ color: "inherit" }}
                                  >
                                    Risks of using tricrypto2 pool
                                  </Link>
                                </Alert>
                              </Stack>
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
          {/* Currency Reserves */}
          <div className="curve-container">
            <div className="curve-content-banks">
              <fieldset>
                <div className="row no-gutters justify-content-center">
                  <div className="curve-content-wrapper col-12 col-lg-12 col-xl-6">
                    <Box
                      sx={{
                        width: "100%",
                      }}
                    >
                      <Paper elevation={4}>
                        <div className="py-3 py-md-4">
                          <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2 justify-content-center">
                            <div className="col-12">
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                                sx={{ color: "#5300e8" }}
                              >
                                Currency Reserves
                              </Typography>
                            </div>
                            <div className="col-12 col-md-6 text-center text-md-left">
                              <List>
                                <ListItem disablePadding>
                                  <ListItemText>
                                    <span className="font-weight-bold">
                                      USDT:&nbsp;
                                    </span>
                                    288,283,619.93 (33.47%)
                                  </ListItemText>
                                </ListItem>
                                <ListItem disablePadding>
                                  <ListItemText>
                                    <span className="font-weight-bold">
                                      wBTC:&nbsp;
                                    </span>
                                    7,072.36 (33.29%)
                                  </ListItemText>
                                </ListItem>
                                <ListItem disablePadding>
                                  <ListItemText>
                                    <span className="font-weight-bold">
                                      WCSPR:&nbsp;
                                    </span>
                                    95,479.4 (33.24%)
                                  </ListItemText>
                                </ListItem>
                                <ListItem disablePadding>
                                  <ListItemText>
                                    <span className="font-weight-bold">
                                      USD total:&nbsp;
                                    </span>
                                    $861m
                                  </ListItemText>
                                </ListItem>
                              </List>
                            </div>
                            <div className="col-12 col-md-6 text-center text-md-left">
                              <List>
                                <ListItem disablePadding>
                                  <ListItemText>
                                    <span className="font-weight-bold">
                                      Fee:&nbsp;
                                    </span>
                                    0.136%
                                  </ListItemText>
                                </ListItem>
                                <ListItem disablePadding>
                                  <ListItemText>
                                    <span className="font-weight-bold">
                                      Admin Fee:&nbsp;
                                    </span>
                                    50.000% of 0.136%
                                  </ListItemText>
                                </ListItem>
                              </List>
                            </div>
                            <div className="col-12 col-md-6 text-center text-md-left">
                              <List>
                                <ListItem disablePadding>
                                  <ListItemText>
                                    <span className="font-weight-bold">
                                      Virtual price:&nbsp;
                                    </span>
                                    <span>
                                      <Tooltip title="1.0102897016513703">
                                        <span>1.0103</span>
                                      </Tooltip>
                                    </span>
                                    <Tooltip title="Average Dollar value of Pool Taken">
                                      <IconButton>
                                        <HelpIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </ListItemText>
                                </ListItem>
                              </List>
                            </div>
                            <div className="col-12 col-md-6 text-center text-md-left">
                              <List>
                                <ListItem disablePadding>
                                  <ListItemText>
                                    <span className="font-weight-bold text-center text-md-left">
                                      Liquidity Utilization:&nbsp;
                                    </span>
                                    9.64%{" "}
                                    <Tooltip title="24h Volume/Liquidity ratio">
                                      <IconButton>
                                        <HelpIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </ListItemText>
                                </ListItem>
                                <ListItem disablePadding>
                                  <ListItemText>
                                    <span className="font-weight-bold">
                                      Daily USD volume:&nbsp;
                                    </span>
                                    $83,025,350.85
                                  </ListItemText>
                                </ListItem>
                              </List>
                            </div>
                          </div>
                          <Divider />
                          <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2 mt-3">
                            <div className="col-12 col-md-6">
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                                sx={{ color: "#5300e8" }}
                              >
                                CRV Details:
                              </Typography>
                              <List>
                                <ListItem disablePadding>
                                  <ListItemText>
                                    <span className="font-weight-bold">
                                      Min APY:&nbsp;
                                    </span>
                                    3.593%
                                  </ListItemText>
                                </ListItem>
                                <ListItem disablePadding>
                                  <ListItemText>
                                    <span className="font-weight-bold">
                                      Max APY:&nbsp;
                                    </span>
                                    8.982%
                                  </ListItemText>
                                </ListItem>
                              </List>
                            </div>
                          </div>
                          <Divider />
                          <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2 mt-3">
                            <div className="col-12">
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                                sx={{ color: "#5300e8" }}
                              >
                                Price Data
                              </Typography>
                            </div>
                            <div className="col-12 col-md-6">
                              <List>
                                <ListItem disablePadding>
                                  <ListItemText>
                                    <Box className="font-weight-bold">
                                      Price Oracle:&nbsp;
                                    </Box>
                                    <Box>
                                      <span>wBTC:&nbsp;</span>
                                      40462.63190414878
                                    </Box>
                                    <Box>
                                      <span>WETH:&nbsp;</span>
                                      3003.1796121051784
                                    </Box>
                                  </ListItemText>
                                </ListItem>
                              </List>
                            </div>
                            <div className="col-12 col-md-6">
                              <List>
                                <ListItem disablePadding>
                                  <ListItemText>
                                    <Box className="font-weight-bold">
                                      Price Scale:&nbsp;
                                    </Box>
                                    <Box>
                                      <span>wBTC:&nbsp;</span>
                                      39652.50997037234
                                    </Box>
                                    <Box>
                                      <span>WETH:&nbsp;</span>
                                      2934.6133730298957
                                    </Box>
                                  </ListItemText>
                                </ListItem>
                              </List>
                            </div>
                            <div className="col-12 col-md-6">
                              <List>
                                <ListItem disablePadding>
                                  <ListItemText>
                                    <Box className="font-weight-bold">
                                      Pool Parameters:&nbsp;
                                    </Box>
                                    <Box>
                                      <span>Gamma:&nbsp;</span>
                                      0.0000210000
                                    </Box>
                                    <Box>
                                      <span>A:&nbsp;</span>
                                      1707629
                                    </Box>
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
              </fieldset>
            </div>
          </div>
        </div>
        <AdvancedOptions
          show={openAdvOptions}
          handleClose={handleCloseAdvOptions}
        />
      </div>
    </>
  );
};

export default Deposit;
