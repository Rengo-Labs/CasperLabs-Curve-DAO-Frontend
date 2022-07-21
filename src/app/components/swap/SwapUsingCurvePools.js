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
import SelectInput from "../FormsUI/SelectInput";
import TextInput from "../FormsUI/TextInput";
// MATERIAL UI
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@mui/material/Divider";
import { StyledEngineProvider } from "@mui/styled-engine";
//MATERIAL UI ICONS
import SwapVertIcon from "@mui/icons-material/SwapVert";
// FORMIK AND YUP
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
//ICONS
import daiIcon from "../../assets/img/dai.png";
import busdIcon from "../../assets/img/busd.png";
import sbtcIcon from "../../assets/img/sbtc.png";
import tusdIcon from "../../assets/img/tusd.png";
import usdcIcon from "../../assets/img/usdc.png";
import wbtcIcon from "../../assets/img/wbtc.png";

// CONTENT

const tokens = [
  {
    name: "DAI",
    icon: daiIcon, // can also use a link
  },
  {
    name: "BUSD",
    icon: busdIcon, // can also use a link
  },
  {
    name: "sBTC",
    icon: sbtcIcon, // can also use a link
  },
  {
    name: "TUSD",
    icon: tusdIcon, // can also use a link
  },
  {
    name: "USDC",
    icon: usdcIcon, // can also use a link
  },
  {
    name: "wBTC",
    icon: wbtcIcon, // can also use a link
  },
];

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

  // Content
  const initialValues = {
    selectTokenA: "",
    selectTokenB: "",
    tokenAQuantity: "",
  };
  const validationSchema = Yup.object().shape({
    selectTokenA: Yup.string().required("Required"),
    selectTokenB: Yup.string().required("Required"),
    tokenAQuantity: Yup.number().required("Required"),
    tokenBQuantity: Yup.number().required("Required"),
  });

  //   Event Handlers

  const onSubmitSelectToken = (values, props) => {
    console.log("Form data from Select Token", values);
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
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmitSelectToken}
                  >
                    <Form>
                      {/* TOKEN A */}
                      <div className="row no-gutters justify-content-center">
                        <div className="curve-content-wrapper mui-wrapper mui-form-width col-12">
                          <div className="row no-gutters justify-content-center">
                            <div className="col-12 col-md-8 col-lg-6 mt-3 mt-lg-0">
                              <SelectInput
                                name="selectTokenA"
                                label="Select Token A"
                                options={tokens}
                              />
                            </div>
                            <div className="col-12 col-md-8 col-lg-6 mt-3 mt-lg-0">
                              <TextInput
                                id="tokenAQuantity"
                                label={tokenAQuantity}
                                variant="filled"
                                name="tokenAQuantity"
                                sx={{ width: "100%" }}
                              />
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
                              <SelectInput
                                name="selectTokenB"
                                label="Select Token B"
                                options={tokens}
                              />
                            </div>
                            <div className="col-12 col-md-8 col-lg-6 mt-3 mt-lg-0">
                              <TextInput
                                id="tokenBQuantity"
                                variant="filled"
                                value={tokenBQuantity}
                                name="tokenBQuantity"
                              />
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
                                Exchange rate {tokenA} / {tokenB} (including
                                fees):{" "}
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
                      <div className="w-100 my-4">
                        <Divider />
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
                      {/* SELL BUTTON */}
                      <div className="row no-gutters justify-content-center">
                        <div className="btnWrapper">
                          <button type="submit">Sell</button>
                        </div>
                      </div>
                    </Form>
                  </Formik>
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
    </>
  );
};

export default SwapUsingCurvePools;
