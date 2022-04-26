//REACT
import React, { useState } from "react";
// CUSTOME STYLING
import "../../../assets/css/style.css";
import "../../../assets/css/curveButton.css";
import "../../../assets/css/common.css";
import "../../../assets/css/BuyAndSell.css";
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
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  FormGroup,
} from "@material-ui/core";
import { StyledEngineProvider } from "@mui/styled-engine";
// import { FormGroup } from "@mui/material";

// CONTENT
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
const BuyAndSell = () => {
  // States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();
  const [totalFromValue, setTotalFromValue] = useState(0.0);
  const [totalToValue, setTotalToValue] = useState(0.0);
  const [open, setOpen] = useState(false);
  const [txCost, setTxCost] = useState("$0.00");
  const [openSellInfo, setOpenSellInfo] = useState(false);

  // Handlers
  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleSellClick = () => {
    if (openSellInfo) {
      setOpenSellInfo(false);
    } else setOpenSellInfo(true);
  };

  return (
    <>
      <div className="home-section home-full-height">
        <HeaderHome
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          setTorus={setTorus}
          selectedNav={"BuyAndSell"}
        />
        <div
          className="content"
          style={{ paddingTop: "100px" }}
          position="absolute"
        >
          <HomeBanner />
        </div>
        <StyledEngineProvider injectFirst>
          <div className="container-fluid">
            <div className="curve-container">
              <div className="curve-content-banks">
                <fieldset>
                  <legend>Buy And Sell</legend>
                  <div className="row no-gutters justify-content-center">
                    <div className="curve-content-wrapper mui-form-width col-12 col-lg-12 col-xl-6">
                      <div className="row no-gutters align-content-center">
                        {/* Exchange Fields and Radios */}
                        <Box
                          sx={{
                            width: "100%",
                          }}
                        >
                          <Paper elevation={4}>
                            <div className="row no-gutters p-4 p-xl-3">
                              <div className="col-sm-12 col-md-5 mb-md-4">
                                {/* <fieldset>
                            <legend>From:</legend> */}
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
                                      id="filled-basic"
                                      label="Filled"
                                      variant="filled"
                                      type={"number"}
                                    />
                                  </Box>
                                  <p
                                    className="w-100 text-right px-2 pt-2"
                                    style={{ color: "#000", fontSize: "1rem" }}
                                  >
                                    = ${totalFromValue}
                                  </p>
                                </div>
                                <div className="row no-gutters justify-content-between px-0 px-md-3">
                                  <FormControl>
                                    {/* <FormLabel id="to-buy-sell-radio-buttons-group-label">
                            Gender
                          </FormLabel> */}
                                    <RadioGroup
                                      aria-labelledby="to-buy-sell-radio-buttons-group-label"
                                      defaultValue="to-buy-sell"
                                      name="to-buy-sell-radio-group"
                                    >
                                      <FormControlLabel
                                        value="usdt"
                                        control={<Radio />}
                                        label={
                                          <span>
                                            <img
                                              src="../../../assets/img/usdt.png"
                                              // alt="usdt token"
                                            />{" "}
                                            USDT{" "}
                                          </span>
                                        }
                                      />
                                      <Divider />
                                      <FormControlLabel
                                        value="wbtc"
                                        control={<Radio />}
                                        label="wBTC"
                                      />
                                      <Divider />
                                      <FormControlLabel
                                        value="cspr"
                                        control={<Radio />}
                                        label="CSPR"
                                      />
                                      <Divider />
                                    </RadioGroup>
                                  </FormControl>
                                </div>
                                {/* </fieldset> */}
                              </div>
                              <div className="col-2 text-center swapIconWrapper d-md-block d-none">
                                <SwapHorizIcon className="tokenSwapIcon" />
                              </div>
                              <div className="col-12 text-center swapIconWrapper d-md-none d-block my-5">
                                <SwapVertIcon className="tokenSwapIcon" />
                              </div>
                              <div className="col-sm-12 col-md-5">
                                {/* <fieldset>
                            <legend>To:</legend> */}
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
                                      id="filled-basic"
                                      label="Filled"
                                      variant="filled"
                                      type={"number"}
                                    />
                                  </Box>
                                  <p
                                    className="w-100 text-right px-2 pt-2"
                                    style={{ color: "#000", fontSize: "1rem" }}
                                  >
                                    = ${totalToValue}
                                  </p>
                                </div>
                                <div className="row no-gutters justify-content-between px-0 px-md-3">
                                  <FormControl>
                                    {/* <FormLabel id="to-buy-sell-radio-buttons-group-label">
                            Gender
                          </FormLabel> */}
                                    <RadioGroup
                                      aria-labelledby="to-buy-sell-radio-buttons-group-label"
                                      defaultValue="to-buy-sell"
                                      name="to-buy-sell-radio-group"
                                    >
                                      <FormControlLabel
                                        value="usdt"
                                        control={<Radio />}
                                        label="USDT"
                                      />
                                      <Divider />
                                      <FormControlLabel
                                        value="wbtc"
                                        control={<Radio />}
                                        label="wBTC"
                                      />
                                      <Divider />
                                      <FormControlLabel
                                        value="cspr"
                                        control={<Radio />}
                                        label="CSPR"
                                      />
                                      <Divider />
                                    </RadioGroup>
                                  </FormControl>
                                </div>
                                {/* </fieldset> */}
                              </div>
                            </div>
                          </Paper>
                        </Box>

                        {/* Exchange Rates and Impact Price */}
                        <div className="row no-gutters my-3 w-100">
                          <Box sx={{ width: "100%" }}>
                            <Paper elevation={4}>
                              <div className="col-12 text-center text-md-right px-4 pt-4 pt-xl-3 px-xl-3">
                                <Box>
                                  <Typography
                                    variant="body1"
                                    gutterBottom
                                    color={"#000"}
                                  >
                                    Exchange rate ETH/USDT (including
                                    fees):&nbsp;
                                    <span>
                                      <Typography
                                        variant="h6"
                                        gutterBottom
                                        component="div"
                                        sx={{
                                          color: "#00cc52",
                                          fontWeight: "bold",
                                          display: "inline-block",
                                        }}
                                      >
                                        <Box sx={{ fontWeight: "bold" }}>
                                          2929.6006
                                        </Box>
                                      </Typography>
                                    </span>
                                  </Typography>
                                </Box>
                              </div>
                              <div className="col-12 text-center text-md-right px-4 px-xl-3 pb-4 pb-xl-3">
                                <Box>
                                  <Typography
                                    variant="body1"
                                    gutterBottom
                                    color={"#000"}
                                  >
                                    Price Impact: &nbsp;
                                    <span>
                                      <Typography
                                        variant="h6"
                                        gutterBottom
                                        component="div"
                                        sx={{
                                          color: "#00cc52",
                                          fontWeight: "bold",
                                          display: "inline-block",
                                        }}
                                      >
                                        <Box sx={{ fontWeight: "bold" }}>
                                          0.00%
                                        </Box>
                                      </Typography>
                                    </span>
                                  </Typography>
                                </Box>
                              </div>
                              <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2">
                                <div className="col-12 col-md-auto mx-4 mx-xl-3 mb-3 mx-xl-2 text-center text-md-left">
                                  <FormGroup>
                                    <FormControlLabel
                                      control={<Checkbox />}
                                      label={
                                        <Typography>
                                          &nbsp;Swap Wrapped CSPR
                                        </Typography>
                                      }
                                    />
                                  </FormGroup>
                                </div>
                              </div>
                              {/* Modal */}
                              <div className="row no-gutters px-4 px-xl-3 pb-4 pb-xl-3">
                                <div className="col-12 col-md-auto text-center text-md-left">
                                  <div className="btnWrapper">
                                    <button onClick={handleOpen}>
                                      Advanced Options
                                    </button>
                                  </div>
                                  <AdvancedOptions
                                    show={open}
                                    close={handleClose}
                                  />
                                </div>
                              </div>
                              <div className="row no-gutters justify-content-center pb-4">
                                <div className="btnWrapper col-12 text-center mb-2">
                                  <button onClick={handleSellClick}>
                                    Sell
                                  </button>
                                </div>
                                {openSellInfo && (
                                  <div className="estimatedCost">
                                    <Typography
                                      variant="body2"
                                      gutterBottom
                                      color={"#000"}
                                    >
                                      Estimated tx cost: {txCost}
                                    </Typography>
                                  </div>
                                )}
                              </div>
                            </Paper>
                          </Box>
                        </div>
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
                                        Liquidity utilization:&nbsp;
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
        </StyledEngineProvider>
      </div>
    </>
  );
};

export default BuyAndSell;
