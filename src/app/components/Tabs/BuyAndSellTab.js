// REACT
import React, { useState } from "react";
// CUSTOM STYLING
import "../../assets/css/BuyAndSell.css";
import "../../assets/css/common.css";
import "../../assets/css/curveButton.css";
import "../../assets/css/style.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// COMPONENTS
import AdvancedOptions from "../Modals/AdvancedOptions";
// MATERIAL UI ICONS
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SwapVertIcon from "@mui/icons-material/SwapVert";
// MATERIAL UI
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import cspr from "../../assets/img/cspr.png";
import usdt from "../../assets/img/usdt.png";
import wbtc from "../../assets/img/wbtc.png";
import { Avatar, CardHeader, FormControl, FormControlLabel, FormGroup, Radio, RadioGroup } from "@mui/material";

// CONTENT

// FUNCTIONAL COMPONENT
const BuyAndSellTab = () => {
  // States
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
      <div className="row no-gutters align-content-center">
        {/* Exchange Fields and Radios */}
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Paper elevation={4}>
            <div className="py-5 px-4">
              {/* Token Select */}
              <div className="row no-gutters">
                <div className="col-sm-12 col-md-5 mb-md-4">
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
                      <RadioGroup
                        aria-labelledby="to-buy-sell-radio-buttons-group-label"
                        defaultValue="to-buy-sell"
                        name="to-buy-sell-radio-group"
                      >
                        <FormControlLabel
                          value="usdt"
                          control={<Radio />}
                          label={
                            <CardHeader
                              avatar={<Avatar src={usdt} aria-label="Artist" />}
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
                              avatar={<Avatar src={wbtc} aria-label="Artist" />}
                              title={"Wrapped BTC"}
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
                              avatar={<Avatar src={cspr} aria-label="Artist" />}
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
                      <RadioGroup
                        aria-labelledby="to-buy-sell-radio-buttons-group-label"
                        defaultValue="to-buy-sell"
                        name="to-buy-sell-radio-group"
                      >
                        <FormControlLabel
                          value="usdt"
                          control={<Radio />}
                          label={
                            <CardHeader
                              avatar={<Avatar src={usdt} aria-label="Artist" />}
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
                              avatar={<Avatar src={wbtc} aria-label="Artist" />}
                              title={"Wrapped BTC"}
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
                              avatar={<Avatar src={cspr} aria-label="Artist" />}
                              title={"Casper"}
                              subheader={"CSPR"}
                            />
                          }
                        />
                        <Divider />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  {/* </fieldset> */}
                </div>
              </div>
              {/* Exchange Rates and Impact Price */}
              <div className="row no-gutters my-3 w-100 py-3">
                <div className="col-12 text-center text-md-right px-4 pt-4 pt-xl-3 px-xl-3">
                  <Box>
                    <Typography variant="body1" gutterBottom color={"#000"}>
                      Exchange rate ETH/USDT (including fees):&nbsp;
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
                          <Box sx={{ fontWeight: "bold" }}>2929.6006</Box>
                        </Typography>
                      </span>
                    </Typography>
                  </Box>
                </div>
                <div className="col-12 text-center text-md-right px-4 px-xl-3 pb-4 pb-xl-3">
                  <Box>
                    <Typography variant="body1" gutterBottom color={"#000"}>
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
                          <Box sx={{ fontWeight: "bold" }}>0.00%</Box>
                        </Typography>
                      </span>
                    </Typography>
                  </Box>
                </div>
              </div>
              <div className="w-100 my-4">
                <Divider />
              </div>
              <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2">
                <div className="col-12 col-md-auto mx-4 mx-xl-2 mb-3 mb-xl-2 text-center text-md-left">
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox />}
                      label={<Typography>&nbsp;Swap Wrapped CSPR</Typography>}
                    />
                  </FormGroup>
                </div>
              </div>
              {/* Modal */}
              <div className="row no-gutters px-4 px-xl-3 pb-4 pb-xl-3">
                <div className="col-12 col-md-auto text-center text-md-left">
                  <div className="btnWrapper">
                    <button onClick={handleOpen}>Advanced Options</button>
                  </div>
                  <AdvancedOptions show={open} handleClose={handleClose} />
                </div>
              </div>
              <div className="row no-gutters justify-content-center pb-4">
                <div className="btnWrapper col-12 text-center mb-2">
                  <button onClick={handleSellClick}>Sell</button>
                </div>
                {openSellInfo && (
                  <div className="estimatedCost">
                    <Typography variant="body2" gutterBottom color={"#000"}>
                      Estimated tx cost: {txCost}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          </Paper>
        </Box>
      </div>
    </>
  );
};

export default BuyAndSellTab;
