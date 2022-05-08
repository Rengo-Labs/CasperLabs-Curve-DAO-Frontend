// REACT
import React, { useState } from "react";
// CUSTOM STYLING
import "../../assets/css/SwapUsingCurvePools.css";
import "../../assets/css/curveButton.css";
import "../../assets/css/common.css";
//BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
//COMPONENTS
import AdvancedOptions from "../Modals/AdvancedOptions";
// MATERIAL UI
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { StyledEngineProvider } from "@mui/styled-engine";
//MATERIAL UI ICONS
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
//ICONS
import daiIcon from "../../assets/img/dai.png";
import busdIcon from "../../assets/img/busd.png";
import sbtcIcon from "../../assets/img/sbtc.png";
import tusdIcon from "../../assets/img/tusd.png";
import usdcIcon from "../../assets/img/usdc.png";
import usdtIcon from "../../assets/img/usdt.png";
import wbtcIcon from "../../assets/img/wbtc.png";
import WalletModal from "../Modals/WalletModal";

// CONTENT
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

// COMPONENT FUNCTION
const SwapUsingCurvePools = () => {
  // States
  const [tokenA, setTokenA] = useState("DAI");
  const [tokenB, setTokenB] = useState("USDC");
  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);
  const [tokenAQuantity, setTokenAQuantity] = useState();
  const [tokenBQuantity, setTokenBQuantity] = useState();
  const [xrateWithFee, setXrateWithFee] = useState(0.9991);
  const [tradeRoute, setTradeRoute] = useState("tusd");
  const [caretRotate, setCaretRotate] = useState(true);
  const [slippageValue, setSlippageValue] = useState(true);
  const [openAdvancedOptions, setOpenAdvancedOptions] = useState(false);

  const classes = useStyles();

  //   Event Handlers
  const handleChangetokenA = (event) => {
    setTokenA(event.target.value);
  };

  const handleChangetokenB = (event) => {
    setTokenB(event.target.value);
  };

  const handleCloseA = () => {
    setOpenA(false);
  };

  const handleCloseB = () => {
    setOpenB(false);
  };

  const handleOpenA = () => {
    setOpenA(true);
  };

  const handleOpenB = () => {
    setOpenB(true);
  };

  const handleTokenAQuantity = (e) => {
    setTokenAQuantity(e.target.value);
  };

  const handleTokenBQuantity = (e) => {
    setTokenBQuantity(e.target.value);
  };

  const handleOpenAdvancedOptions = () => setOpenAdvancedOptions(true);
  const handleCloseAdvancedOptions = () => setOpenAdvancedOptions(false);

  return (
    <>
      <div className="curve-container">
        <fieldset>
          <legend>Swap using all Curve pools</legend>
          <div className="row no-gutters justify-content-center">
            <div className="curve-content-wrapper mui-form-width col-12 col-lg-12 col-xl-6">
              <Paper elevation={4}>
                <div className="py-5 px-4">
                  {/* TOKEN A */}
                  <div className="row no-gutters justify-content-center">
                    <div className="curve-content-wrapper mui-wrapper mui-form-width col-12">
                      <div className="row no-gutters justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6 mt-3 mt-lg-0">
                          <FormControl variant="filled">
                            <Select
                              labelId="constrolled-tokenA-selector"
                              id="tokenA-controlled-open"
                              open={openA}
                              onClose={handleCloseA}
                              onOpen={handleOpenA}
                              value={tokenA}
                              onChange={handleChangetokenA}
                              placeholder="Select Token"
                            >
                              <MenuItem value={"DAI"}>
                                <div className="iconsHanlde row no-gutters align-items-center">
                                  <img src={daiIcon} alt="DAI token icon" />
                                  <span>DAI</span>
                                </div>
                              </MenuItem>
                              <MenuItem value={"USDC"}>
                                <span className="iconsHanlde">
                                  <img src={usdcIcon} alt="USDC token icon" />
                                  <span>USDC</span>
                                </span>
                              </MenuItem>
                              <MenuItem value={"USDT"}>
                                <span className="iconsHanlde">
                                  <img src={usdtIcon} alt="USDT token icon" />
                                  <span>USDT</span>
                                </span>
                              </MenuItem>
                              <MenuItem value={"TUSD"}>
                                <span className="iconsHanlde">
                                  <img src={tusdIcon} alt="TUSD token icon" />
                                  <span>TUSD</span>
                                </span>
                              </MenuItem>
                              <MenuItem value={"BUSD"}>
                                <span className="iconsHanlde">
                                  <img src={busdIcon} alt="BUSD token icon" />
                                  <span>BUSD</span>
                                </span>
                              </MenuItem>
                              <MenuItem value={"wBTC"}>
                                <span className="iconsHanlde">
                                  <img src={wbtcIcon} alt="wBTC token icon" />
                                  <span>wBTC</span>
                                </span>
                              </MenuItem>
                              <MenuItem value={"sBTC"}>
                                <span className="iconsHanlde">
                                  <img src={sbtcIcon} alt="sBTC token icon" />
                                  <span>sBTC</span>
                                </span>
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                        <div className="col-12 col-md-8 col-lg-6 mt-3 mt-lg-0">
                          <Box
                            className={classes.root}
                            noValidate
                            autoComplete="off"
                          >
                            <TextField
                              id="tokenQuantityA"
                              placeholder="0.00"
                              variant="filled"
                              value={tokenAQuantity}
                              onChange={handleTokenAQuantity}
                            />
                          </Box>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* SWAP ICON */}
                  <div className="row no-gutters justify-content-center">
                    <div className="col-12 text-center">
                      <StyledEngineProvider injectFirst>
                        <div className="swapIconWrapper">
                          <SwapVertIcon className="tokenSwapIcon" />
                        </div>
                      </StyledEngineProvider>
                    </div>
                  </div>
                  {/* TOKEN B */}
                  <div className="row no-gutters justify-content-center">
                    <div className="curve-content-wrapper mui-wrapper mui-form-width col-12">
                      <div className="row no-gutters justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6 mt-3 mt-lg-0">
                          <FormControl variant="filled">
                            <Select
                              labelId="constrolled-tokenB-selector"
                              id="tokenB-controlled-open"
                              open={openB}
                              onClose={handleCloseB}
                              onOpen={handleOpenB}
                              value={tokenB}
                              onChange={handleChangetokenB}
                              placeholder="Select Token"
                            >
                              <MenuItem value={"DAI"}>
                                <div className="iconsHanlde row no-gutters align-items-center">
                                  <img src={daiIcon} alt="DAI token icon" />
                                  <span>DAI</span>
                                </div>
                              </MenuItem>
                              <MenuItem value={"USDC"}>
                                <span className="iconsHanlde">
                                  <img src={usdcIcon} alt="USDC token icon" />
                                  <span>USDC</span>
                                </span>
                              </MenuItem>
                              <MenuItem value={"USDT"}>
                                <span className="iconsHanlde">
                                  <img src={usdtIcon} alt="USDT token icon" />
                                  <span>USDT</span>
                                </span>
                              </MenuItem>
                              <MenuItem value={"TUSD"}>
                                <span className="iconsHanlde">
                                  <img src={tusdIcon} alt="TUSD token icon" />
                                  <span>TUSD</span>
                                </span>
                              </MenuItem>
                              <MenuItem value={"BUSD"}>
                                <span className="iconsHanlde">
                                  <img src={busdIcon} alt="BUSD token icon" />
                                  <span>BUSD</span>
                                </span>
                              </MenuItem>
                              <MenuItem value={"wBTC"}>
                                <span className="iconsHanlde">
                                  <img src={wbtcIcon} alt="wBTC token icon" />
                                  <span>wBTC</span>
                                </span>
                              </MenuItem>
                              <MenuItem value={"sBTC"}>
                                <span className="iconsHanlde">
                                  <img src={sbtcIcon} alt="sBTC token icon" />
                                  <span>sBTC</span>
                                </span>
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                        <div className="col-12 col-md-8 col-lg-6 mt-3 mt-lg-0">
                          <Box
                            component="form"
                            sx={{
                              "& > :not(style)": { m: 1, width: "25ch" },
                            }}
                            noValidate
                            autoComplete="off"
                          >
                            <TextField
                              id="tokenQuantityB"
                              placeholder="0.00"
                              variant="filled"
                              value={tokenBQuantity}
                              onChange={handleTokenBQuantity}
                            />
                          </Box>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* EXCHANGE RATE AND TRADE ROUTE */}
                  <div className="row no-gutters justify-content-end">
                    <div className="curve-content-wrapper mui-wrapper mui-form-width col-12">
                      <div className="col-12">
                        <div className="text-right">
                          <h4 className="text-body">
                            Exchange rate {tokenA} / {tokenB} (including fees):{" "}
                            <span className="text-success font-weight-bold">
                              {xrateWithFee}
                            </span>
                          </h4>
                          <h4 className="text-body">
                            Trade routed through:{" "}
                            <span className="text-success font-weight-bold">
                              {tradeRoute}
                            </span>
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* MODAL BUTTON */}
                  <div className="row no-gutters px-4 px-xl-3 pb-4 pb-xl-3 justify-content-center">
                    <div className="col-12 text-center text-md-left">
                      <div className="btnWrapper">
                        <button onClick={handleOpenAdvancedOptions}>
                          Advanced Options
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Paper>
            </div>
          </div>
        </fieldset>
      </div>

      <footer style={{ height: "10rem" }}></footer>
      <AdvancedOptions
        show={openAdvancedOptions}
        handleClose={handleCloseAdvancedOptions}
      />
      {/* <WalletModal
        show={openAdvancedOptions}
        handleClose={handleCloseAdvancedOptions}
      /> */}
    </>
  );
};

export default SwapUsingCurvePools;
