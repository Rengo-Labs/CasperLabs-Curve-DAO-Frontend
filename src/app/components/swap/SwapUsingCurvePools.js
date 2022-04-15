// REACT
import React, { useState } from "react";
// CUSTOM STYLING
import "../../assets/css/SwapUsingCurvePools.css";
import "../../assets/css/curveButton.css";
import "../../assets/css/common.css";
//BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
//COMPONENTS
// MATERIAL UI
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
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

// CONTENT

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

  const handleAdvancedOptions = () => {
    caretRotate ? setCaretRotate(false) : setCaretRotate(true);
    document
      .getElementById("advOptions")
      .classList.toggle("advancedOptionsHeight");
  };

  const handleChangeSlippage = (event) => {
    setSlippageValue(event.target.value);
  };

  return (
    <>
      <div className="curve-container">
        <fieldset>
          <legend>Swap using all Curve pools</legend>
          <div className="row no-gutters justify-content-center">
            <div className="curve-content-wrapper col-12 col-lg-6">
              <div className="row no-gutters justify-content-center">
                <div className="col-12 col-md-8 col-lg-6 mt-3 mt-lg-0">
                  <FormControl>
                    {/* <InputLabel id="controlled-tokenA-selector">Age</InputLabel> */}
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
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="tokenQuantityA"
                      placeholder="0.00"
                      variant="outlined"
                      value={tokenAQuantity}
                      onChange={handleTokenAQuantity}
                    />
                  </Box>
                </div>
              </div>
            </div>
          </div>
          <div className="row no-gutters justify-content-center">
            <div className="col-12 text-center">
              <StyledEngineProvider injectFirst>
                <div className="swapIconWrapper">
                  <SwapVertIcon className="tokenSwapIcon" />
                </div>
              </StyledEngineProvider>
            </div>
          </div>
          <div className="row no-gutters justify-content-center">
            <div className="curve-content-wrapper col-12 col-lg-6">
              <div className="row no-gutters justify-content-center">
                <div className="col-12 col-md-8 col-lg-6 mt-3 mt-lg-0">
                  <FormControl>
                    {/* <InputLabel id="controlled-tokenB-selector">Age</InputLabel> */}
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
                      variant="outlined"
                      value={tokenBQuantity}
                      onChange={handleTokenBQuantity}
                    />
                  </Box>
                </div>
              </div>
            </div>
          </div>
          <div className="row no-gutters justify-content-end">
            <div className="curve-content-wrapper col-12 col-lg-6">
              <div className="col-12 col-md-8 col-lg-6">
                <div className="text-right pr-md-3">
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
          <div className="row no-gutters justify-content-center">
            <div className="col-12 col-lg-6">
              <div className="col-12 col-md-8 col-lg-6">
                <div className="btnWrapper">
                  <button onClick={handleAdvancedOptions}>
                    Advanced Options
                    {caretRotate ? (
                      <ArrowRightIcon style={{ marginLeft: "5px" }} />
                    ) : (
                      <ArrowDropDownIcon style={{ marginLeft: "5px" }} />
                    )}
                  </button>
                </div>
              </div>
              {/* {showAdvanced ? ( */}
              <div
                className="col-12 col-md-8 col-lg-6 advancedOptions advancedOptionsHeight"
                id="advOptions"
              >
                <section>
                  <h4>Advanced Options:</h4>
                  <FormControl>
                    <FormLabel id="advancedOptions">Max slippage: </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="advancedOptions"
                      name="advanced-options-for-swaping-from-curve-pools"
                      value={slippageValue}
                      onChange={handleChangeSlippage}
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
                      <TextField id="advancedOptionsInput" label="ttt" />
                    </RadioGroup>
                  </FormControl>
                </section>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <footer style={{ height: "10rem" }}></footer>
    </>
  );
};

export default SwapUsingCurvePools;
